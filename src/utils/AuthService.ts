/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Log, User, UserManager } from 'oidc-client';
import { UserManagerMock } from './UserManagerMock';
import {
    resetAuthenticationRouterError,
    setLoggedUser,
    setLogoutError,
    setShowAuthenticationRouterLogin,
    setSignInCallbackError,
    setUnauthorizedUserInfo,
    setUserValidationError,
} from '../redux/actions';
import { jwtDecode } from 'jwt-decode';
import { Dispatch } from 'react';
import { NavigateFunction } from 'react-router-dom';

type UserValidationFunc = (user: User) => Promise<boolean>;
type IdpSettingsGetter = () => Promise<IdpSettings>;

export type IdpSettings = {
    authority: string;
    client_id: string;
    redirect_uri: string;
    post_logout_redirect_uri: string;
    silent_redirect_uri: string;
    scope: string;
    maxExpiresIn?: number;
};

type CustomUserManager = UserManager & {
    idpSettings?: {
        maxExpiresIn?: number;
    };
};

// set as a global variable to allow log level configuration at runtime
//@ts-ignore
window.OIDCLog = Log;

const hackAuthorityKey = 'oidc.hack.authority';
const oidcHackReloadedKey = 'gridsuite-oidc-hack-reloaded';
const pathKey = 'powsybl-gridsuite-current-path';

function isIssuerError(error: Error) {
    return error.message.includes('Invalid issuer in token');
}

function extractIssuerToSessionStorage(error: Error) {
    const issuer = error.message.split(' ').pop();
    if (issuer !== undefined) {
        sessionStorage.setItem(hackAuthorityKey, issuer);
    }
}

function reload() {
    if (!sessionStorage.getItem(oidcHackReloadedKey)) {
        sessionStorage.setItem(oidcHackReloadedKey, true.toString());
        console.log('Hack oidc, reload page to make login work');
        window.location.reload();
    }
}

function reloadTimerOnExpiresIn(
    user: User,
    userManager: UserManager,
    expiresIn: number
) {
    // Not allowed by TS because expires_in is supposed to be readonly
    // @ts-ignore
    user.expires_in = expiresIn;
    userManager.storeUser(user).then(() => {
        userManager.getUser();
    });
}

function handleSigninSilent(
    dispatch: Dispatch<unknown>,
    userManager: UserManager
) {
    userManager.getUser().then((user) => {
        if (user == null || getIdTokenExpiresIn(user) < 0) {
            return userManager.signinSilent().catch((error: Error) => {
                dispatch(setShowAuthenticationRouterLogin(true));
                if (isIssuerError(error)) {
                    extractIssuerToSessionStorage(error);
                    reload();
                }
            });
        }
    });
}

export async function initializeAuthenticationDev(
    dispatch: Dispatch<unknown>,
    isSilentRenew: boolean,
    validateUser: UserValidationFunc,
    isSigninCallback: boolean
) {
    const userManager: UserManager = new UserManagerMock({});
    if (!isSilentRenew) {
        handleUser(dispatch, userManager, validateUser);
        if (!isSigninCallback) {
            handleSigninSilent(dispatch, userManager);
        }
    }
    return userManager;
}

const accessTokenExpiringNotificationTime = 60; // seconds

export async function initializeAuthenticationProd(
    dispatch: Dispatch<unknown>,
    isSilentRenew: boolean,
    idpSettingsGetter: IdpSettingsGetter,
    validateUser: UserValidationFunc,
    isSigninCallback: boolean
) {
    const idpSettings = await idpSettingsGetter();
    try {
        const settings = {
            authority:
                sessionStorage.getItem(hackAuthorityKey) ||
                idpSettings.authority,
            client_id: idpSettings.client_id,
            redirect_uri: idpSettings.redirect_uri,
            post_logout_redirect_uri: idpSettings.post_logout_redirect_uri,
            silent_redirect_uri: idpSettings.silent_redirect_uri,
            scope: idpSettings.scope,
            automaticSilentRenew: !isSilentRenew,
            accessTokenExpiringNotificationTime:
                accessTokenExpiringNotificationTime,
            response_type: 'code',
        };
        let userManager: CustomUserManager = new UserManager(settings);
        // Hack to enrich UserManager object
        userManager.idpSettings = idpSettings; //store our settings in there as well to use it later
        if (!isSilentRenew) {
            handleUser(dispatch, userManager, validateUser);
            if (!isSigninCallback) {
                handleSigninSilent(dispatch, userManager);
            }
        }
        return userManager;
    } catch (error: unknown) {
        console.debug('error when importing the idp settings', error);
        dispatch(setShowAuthenticationRouterLogin(true));
        throw error;
    }
}

function computeMinExpiresIn(
    expiresIn: number,
    idToken: string,
    maxExpiresIn: number | undefined
) {
    const now = Date.now() / 1000;
    const exp = jwtDecode(idToken).exp;
    if (exp === undefined) {
        return expiresIn;
    }
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

export function login(location: Location, userManagerInstance: UserManager) {
    sessionStorage.setItem(pathKey, location.pathname + location.search);
    return userManagerInstance
        .signinRedirect()
        .then(() => console.debug('login'));
}

export function logout(
    dispatch: Dispatch<unknown>,
    userManagerInstance: UserManager
) {
    sessionStorage.removeItem(hackAuthorityKey); //To remove when hack is removed
    sessionStorage.removeItem(oidcHackReloadedKey);
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

function getIdTokenExpiresIn(user: User) {
    const now = Date.now() / 1000;
    const exp = jwtDecode(user.id_token).exp;
    if (exp === undefined) {
        return 0;
    }
    return exp - now;
}

export function dispatchUser(
    dispatch: Dispatch<unknown>,
    userManagerInstance: CustomUserManager,
    validateUser: UserValidationFunc
) {
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
                            setUnauthorizedUserInfo(user?.profile?.name, '')
                        );
                    }
                    console.debug(
                        'User has been successfully loaded from store.'
                    );
                    // In authorization code flow we have to make the oidc-client lib re-evaluate the date of the token renewal timers
                    // because it is not hacked at page loading on the fragment before oidc-client lib initialization
                    reloadTimerOnExpiresIn(
                        user,
                        userManagerInstance,
                        computeMinExpiresIn(
                            user.expires_in,
                            user.id_token,
                            userManagerInstance.idpSettings?.maxExpiresIn
                        )
                    );
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

export function getPreLoginPath() {
    return sessionStorage.getItem(pathKey);
}

function navigateToPreLoginPath(navigate: NavigateFunction) {
    const previousPath = getPreLoginPath();
    if (previousPath !== null) {
        navigate(previousPath);
    }
}

export function handleSigninCallback(
    dispatch: Dispatch<unknown>,
    navigate: NavigateFunction,
    userManagerInstance: UserManager
) {
    let reloadAfterNavigate = false;
    userManagerInstance
        .signinRedirectCallback()
        .catch(function (e) {
            if (isIssuerError(e)) {
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

export function handleSilentRenewCallback(userManagerInstance: UserManager) {
    userManagerInstance.signinSilentCallback();
}

function handleUser(
    dispatch: Dispatch<unknown>,
    userManager: CustomUserManager,
    validateUser: UserValidationFunc
) {
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
                    return;
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
                } else if (userManager.idpSettings?.maxExpiresIn) {
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
                                (idTokenExpiresIn -
                                    accessTokenExpiringNotificationTime) +
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
                            userManager.idpSettings?.maxExpiresIn,
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
