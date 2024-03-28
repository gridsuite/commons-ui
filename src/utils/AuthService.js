/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Log, UserManager } from 'oidc-client';
import { UserManagerMock } from './UserManagerMock';
import {
    setLoggedUser,
    setSignInCallbackError,
    setUnauthorizedUserInfo,
    setLogoutError,
    setUserValidationError,
    resetAuthenticationRouterError,
    setShowAuthenticationRouterLogin,
} from './actions';
import { jwtDecode } from 'jwt-decode';

// set as a global variable to allow log level configuration at runtime
window.OIDCLog = Log;

const hackAuthorityKey = 'oidc.hack.authority';
const oidcHackReloadedKey = 'gridsuite-oidc-hack-reloaded';
const pathKey = 'powsybl-gridsuite-current-path';

function isIssuerErrorForCodeFlow(error) {
    return error.message.includes('Invalid issuer in token');
}

function extractIssuerToSessionStorage(error) {
    const issuer = error.message.split(' ').pop();
    sessionStorage.setItem(hackAuthorityKey, issuer);
}

function reload() {
    if (!sessionStorage.getItem(oidcHackReloadedKey)) {
        sessionStorage.setItem(oidcHackReloadedKey, true);
        console.log('Hack oidc, reload page to make login work');
        window.location.reload();
    }
}

function reloadTimerOnExpiresIn(user, userManager, expiresIn) {
    // TODO: Can we stop doing it in the hash for implicit flow ? To make it common for both flows
    user.expires_in = expiresIn;
    userManager.storeUser(user).then(() => {
        userManager.getUser();
    });
}

function handleSigninSilent(dispatch, userManager) {
    userManager.getUser().then((user) => {
        if (user == null || getIdTokenExpiresIn(user) < 0) {
            return userManager.signinSilent().catch((error) => {
                dispatch(setShowAuthenticationRouterLogin(true));
                const errorIssuerCodeFlow = isIssuerErrorForCodeFlow(error);
                const errorIssuerImplicitFlow =
                    error.message ===
                    'authority mismatch on settings vs. signin state';
                if (errorIssuerCodeFlow) {
                    // Replacing authority for code flow only because it's done in the hash for implicit flow
                    // TODO: Can we stop doing it in the hash for implicit flow ? To make it common here for both flows
                    extractIssuerToSessionStorage(error);
                }
                if (errorIssuerCodeFlow || errorIssuerImplicitFlow) {
                    reload();
                }
            });
        }
    });
}

function initializeAuthenticationDev(
    dispatch,
    isSilentRenew,
    validateUser,
    isSigninCallback
) {
    let userManager = new UserManagerMock({});
    if (!isSilentRenew) {
        handleUser(dispatch, userManager, validateUser);
        if (!isSigninCallback) {
            handleSigninSilent(dispatch, userManager);
        }
    }
    return Promise.resolve(userManager);
}

const accessTokenExpiringNotificationTime = 60; // seconds

function initializeAuthenticationProd(
    dispatch,
    isSilentRenew,
    idpSettings,
    validateUser,
    authorizationCodeFlowEnabled,
    isSigninCallback
) {
    return idpSettings
        .then((r) => r.json())
        .then((idpSettings) => {
            /* hack to ignore the iss check. XXX TODO to remove */
            const regextoken = /id_token=[^&]*/;
            const regexstate = /state=[^&]*/;
            const regexexpires = /expires_in=[^&]*/;
            let authority;
            if (window.location.hash) {
                const matched_id_token = window.location.hash.match(regextoken);
                const matched_state = window.location.hash.match(regexstate);
                if (matched_id_token != null && matched_state != null) {
                    const id_token = matched_id_token[0].split('=')[1];
                    const state = matched_state[0].split('=')[1];
                    const strState = localStorage.getItem('oidc.' + state);
                    if (strState != null) {
                        const decoded = jwtDecode(id_token);
                        authority = decoded.iss;
                        const storedState = JSON.parse(strState);
                        console.debug(
                            'Replacing authority in storedState. Before: ',
                            storedState.authority,
                            'after: ',
                            authority
                        );
                        storedState.authority = authority;
                        localStorage.setItem(
                            'oidc.' + state,
                            JSON.stringify(storedState)
                        );
                        sessionStorage.setItem(hackAuthorityKey, authority);
                        const matched_expires =
                            window.location.hash.match(regexexpires);
                        if (matched_expires != null) {
                            const expires_in = parseInt(
                                matched_expires[0].split('=')[1]
                            );
                            window.location.hash = window.location.hash.replace(
                                matched_expires[0],
                                'expires_in=' +
                                    computeMinExpiresIn(
                                        expires_in,
                                        id_token,
                                        idpSettings.maxExpiresIn
                                    )
                            );
                        }
                    }
                }
            }
            authority =
                authority ||
                sessionStorage.getItem(hackAuthorityKey) ||
                idpSettings.authority;

            const responseSettings = authorizationCodeFlowEnabled
                ? { response_type: 'code' }
                : {
                      response_type: 'id_token token',
                      response_mode: 'fragment',
                  };
            const settings = {
                authority,
                client_id: idpSettings.client_id,
                redirect_uri: idpSettings.redirect_uri,
                post_logout_redirect_uri: idpSettings.post_logout_redirect_uri,
                silent_redirect_uri: idpSettings.silent_redirect_uri,
                scope: idpSettings.scope,
                automaticSilentRenew: !isSilentRenew,
                accessTokenExpiringNotificationTime:
                    accessTokenExpiringNotificationTime,
                ...responseSettings,
            };
            let userManager = new UserManager(settings);
            userManager.idpSettings = idpSettings; //store our settings in there as well to use it later
            userManager.authorizationCodeFlowEnabled =
                authorizationCodeFlowEnabled;
            if (!isSilentRenew) {
                handleUser(dispatch, userManager, validateUser);
                if (!isSigninCallback) {
                    handleSigninSilent(dispatch, userManager);
                }
            }
            return userManager;
        })
        .catch((error) => {
            console.debug('error when importing the idp settings', error);
            dispatch(setShowAuthenticationRouterLogin(true));
            throw error;
        });
}

function computeMinExpiresIn(expiresIn, idToken, maxExpiresIn) {
    const now = parseInt(Date.now() / 1000);
    const exp = jwtDecode(idToken).exp;
    const idTokenExpiresIn = exp - now;
    let newExpiresIn = expiresIn;
    let newExpiresInReplaceReason;
    if (expiresIn === undefined || idTokenExpiresIn < newExpiresIn) {
        newExpiresIn = idTokenExpiresIn;
        newExpiresInReplaceReason = 'idtoken.exp is earlier';
    }
    if (maxExpiresIn && maxExpiresIn < newExpiresIn) {
        newExpiresIn = maxExpiresIn;
        newExpiresInReplaceReason = 'idpSettings.maxExpiresIn is smaller';
    }
    if (newExpiresInReplaceReason) {
        console.debug(
            'Replacing expiresIn in user to ' +
                newExpiresIn +
                ' because ' +
                newExpiresInReplaceReason +
                '. ',
            'debug:',
            'original expires_in: ' + expiresIn + ', ',
            'idTokenExpiresIn: ' +
                idTokenExpiresIn +
                ', idpSettings maxExpiresIn: ' +
                maxExpiresIn
        );
    }
    return newExpiresIn;
}

function login(location, userManagerInstance) {
    sessionStorage.setItem(pathKey, location.pathname + location.search);
    return userManagerInstance
        .signinRedirect()
        .then(() => console.debug('login'));
}

function logout(dispatch, userManagerInstance) {
    sessionStorage.removeItem(hackAuthorityKey); //To remove when hack is removed
    return userManagerInstance.getUser().then((user) => {
        if (user) {
            // We don't need to check if token is valid at this point
            return userManagerInstance
                .signoutRedirect({
                    extraQueryParams: {
                        TargetResource:
                            userManagerInstance.settings
                                .post_logout_redirect_uri,
                    },
                })
                .then(() => {
                    console.debug('logged out, window is closing...');
                })
                .catch((e) => {
                    console.log('Error during logout :', e);
                    // An error occured, window may not be closed, reset the user state
                    dispatch(setLoggedUser(null));
                    dispatch(setLogoutError(user?.profile?.name, { error: e }));
                });
        } else {
            console.log('Error nobody to logout ');
        }
    });
}

function getIdTokenExpiresIn(user) {
    const now = parseInt(Date.now() / 1000);
    const exp = jwtDecode(user.id_token).exp;
    return exp - now;
}

function dispatchUser(dispatch, userManagerInstance, validateUser) {
    return userManagerInstance.getUser().then((user) => {
        if (user) {
            // If session storage contains a expired token at initialization
            // We do not dispatch the user
            // Our explicit SigninSilent will attempt to connect once
            if (getIdTokenExpiresIn(user) < 0) {
                console.debug(
                    'User token is expired and will not be dispatched'
                );
                return;
            }
            // without validateUser defined, valid user by default
            let validateUserPromise =
                (validateUser && validateUser(user)) || Promise.resolve(true);
            return validateUserPromise
                .then((valid) => {
                    if (!valid) {
                        console.debug(
                            "User isn't authorized to log in and will not be dispatched"
                        );
                        return dispatch(
                            setUnauthorizedUserInfo(user?.profile?.name, {})
                        );
                    }
                    console.debug(
                        'User has been successfully loaded from store.'
                    );

                    // In authorization code flow we have to make the oidc-client lib re-evaluate the date of the token renewal timers
                    // because it is not hacked at page loading on the fragment before oidc-client lib initialization
                    if (userManagerInstance.authorizationCodeFlowEnabled) {
                        reloadTimerOnExpiresIn(
                            user,
                            userManagerInstance,
                            computeMinExpiresIn(
                                user.expires_in,
                                user.id_token,
                                userManagerInstance.idpSettings.maxExpiresIn
                            )
                        );
                    }
                    return dispatch(setLoggedUser(user));
                })
                .catch((e) => {
                    console.log('Error in dispatchUser', e);
                    return dispatch(
                        setUserValidationError(user?.profile?.name, {
                            error: e,
                        })
                    );
                });
        } else {
            console.debug('You are not logged in.');
        }
    });
}

function getPreLoginPath() {
    return sessionStorage.getItem(pathKey);
}

function navigateToPreLoginPath(navigate) {
    const previousPath = getPreLoginPath();
    navigate(previousPath);
}

function handleSigninCallback(dispatch, navigate, userManagerInstance) {
    let reloadAfterNavigate = false;
    userManagerInstance
        .signinRedirectCallback()
        .catch(function (e) {
            if (isIssuerErrorForCodeFlow(e)) {
                // Replacing authority for code flow only because it's done in the hash for implicit flow
                // TODO: Can we also do it here for the implicit flow ? To make it common here for both flows
                extractIssuerToSessionStorage(e);
                // After navigate, location will be out of a redirection route (sign-in-silent or sign-in-callback) so reloading the page will attempt a silent signin
                // It will reload the user manager based on hacked authority at initialization with the new authority
                // We do this because on Azure we only get to know the issuer of the user in the idtoken and so signingredirectcallback will always fail
                // We could restart the whole login process from signin redirect with the correct issuer, but instead we just rely on the silent login after the reload which will work
                reloadAfterNavigate = true;
            } else {
                throw e;
            }
        })
        .then(function () {
            dispatch(setSignInCallbackError(null));
            navigateToPreLoginPath(navigate);
            if (reloadAfterNavigate) {
                reload();
            }
        })
        .catch(function (e) {
            dispatch(setSignInCallbackError(e));
            console.error(e);
        });
}

function handleSilentRenewCallback(userManagerInstance) {
    userManagerInstance.signinSilentCallback();
}

function handleUser(dispatch, userManager, validateUser) {
    userManager.events.addUserLoaded((user) => {
        console.debug('user loaded', user);
        dispatchUser(dispatch, userManager, validateUser);
    });

    userManager.events.addSilentRenewError((error) => {
        console.debug(error);
        // Wait for accessTokenExpiringNotificationTime so that the user is expired and not between expiring and expired
        // otherwise the library will fire AccessTokenExpiring everytime we do getUser()
        // Indeed, getUSer() => loadUser() => load() on events => if it's already expiring it will be init and triggerred again
        window.setTimeout(() => {
            userManager.getUser().then((user) => {
                if (!user) {
                    console.error(
                        "user is null at silent renew error, it shouldn't happen."
                    );
                }
                const idTokenExpiresIn = getIdTokenExpiresIn(user);
                if (idTokenExpiresIn < 0) {
                    console.log(
                        'Error in silent renew, idtoken expired: ' +
                            idTokenExpiresIn +
                            ' => Logging out.',
                        error
                    );
                    // remove the user from our app, but don't sso logout on all other apps
                    dispatch(setShowAuthenticationRouterLogin(true));
                    // logout during token expiration, show login without errors
                    dispatch(resetAuthenticationRouterError());
                    return dispatch(setLoggedUser(null));
                } else if (userManager.idpSettings.maxExpiresIn) {
                    if (
                        idTokenExpiresIn < userManager.idpSettings.maxExpiresIn
                    ) {
                        // TODO here attempt last chance login ? snackbar to notify the user ? Popup ?
                        // for now we do the same thing as in the else block
                        console.log(
                            'Error in silent renew, but idtoken ALMOST expiring (expiring in' +
                                idTokenExpiresIn +
                                ') => last chance, next error will logout',
                            'maxExpiresIn = ' +
                                userManager.idpSettings.maxExpiresIn,
                            'last renew attempt in ' +
                                idTokenExpiresIn -
                                accessTokenExpiringNotificationTime +
                                'seconds',
                            error
                        );
                        reloadTimerOnExpiresIn(
                            user,
                            userManager,
                            idTokenExpiresIn
                        );
                    } else {
                        console.log(
                            'Error in silent renew, but idtoken NOT expiring (expiring in' +
                                idTokenExpiresIn +
                                ') => postponing expiration to' +
                                userManager.idpSettings.maxExpiresIn,
                            error
                        );
                        reloadTimerOnExpiresIn(
                            user,
                            userManager,
                            userManager.idpSettings.maxExpiresIn
                        );
                    }
                } else {
                    console.log(
                        'Error in silent renew, unsupported configuration: token still valid for ' +
                            idTokenExpiresIn +
                            ' but maxExpiresIn is not configured:' +
                            userManager.idpSettings.maxExpiresIn,
                        error
                    );
                }
            });
        }, accessTokenExpiringNotificationTime * 1000);
        // Should be min(accessTokenExpiringNotificationTime * 1000, idTokenExpiresIn) to avoid rare case
        // when user connection is dying and you refresh the page between expiring and expired.
        // but gateway has a DEFAULT_MAX_CLOCK_SKEW = 60s then the token is still valid for this time
        // even if expired
        // We accept to not manage this case further
    });

    console.debug('dispatch user');
    dispatchUser(dispatch, userManager, validateUser);
}

export {
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    handleSilentRenewCallback,
    login,
    logout,
    dispatchUser,
    handleSigninCallback,
    getPreLoginPath,
};
