/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UserManager } from 'oidc-client';
import { UserManagerMock } from './UserManagerMock';
import { setLoggedUser, setSignInCallbackError } from './actions';
import jwtDecode from 'jwt-decode';

const hackauthoritykey = 'oidc.hack.authority';

const pathKey = 'powsybl-gridsuite-current-path';

function initializeAuthenticationDev(dispatch, isSilentRenew) {
    let userManager = new UserManagerMock({});
    if (!isSilentRenew) {
        handleUser(dispatch, userManager);
    }
    return Promise.resolve(userManager);
}

function initializeAuthenticationProd(dispatch, isSilentRenew, idpSettings) {
    return idpSettings
        .then((r) => r.json())
        .then((idpSettings) => {
            /* hack to ignore the iss check. XXX TODO to remove */
            const regextoken = /id_token=[^&]*/;
            const regexstate = /state=[^&]*/;
            let authority;
            if (window.location.hash) {
                const matched_id_token = window.location.hash.match(regextoken);
                const matched_state = window.location.hash.match(regexstate);
                if (matched_id_token != null && matched_state != null) {
                    const id_token = matched_id_token[0].split('=')[1];
                    const state = matched_state[0].split('=')[1];
                    const strState = localStorage.getItem('oidc.' + state);
                    if (strState != null) {
                        authority = jwtDecode(id_token).iss;
                        const storedState = JSON.parse(strState);
                        storedState.authority = authority;
                        localStorage.setItem(
                            'oidc.' + state,
                            JSON.stringify(storedState)
                        );
                        sessionStorage.setItem(hackauthoritykey, authority);
                    }
                }
            }
            authority =
                authority ||
                sessionStorage.getItem(hackauthoritykey) ||
                idpSettings.authority;
            let settings = {
                authority,
                client_id: idpSettings.client_id,
                redirect_uri: idpSettings.redirect_uri,
                post_logout_redirect_uri: idpSettings.post_logout_redirect_uri,
                silent_redirect_uri: idpSettings.silent_redirect_uri,
                response_mode: 'fragment',
                response_type: 'id_token token',
                scope: idpSettings.scope,
                automaticSilentRenew: !isSilentRenew,
                accessTokenExpiringNotificationTime: 60,
            };
            let userManager = new UserManager(settings);
            if (!isSilentRenew) {
                handleUser(dispatch, userManager);
            }
            return userManager;
        });
}

function login(location, userManagerInstance) {
    sessionStorage.setItem(pathKey, location.pathname + location.search);
    return userManagerInstance
        .signinRedirect()
        .then(() => console.debug('login'));
}

function logout(dispatch, userManagerInstance) {
    dispatch(setLoggedUser(null));
    sessionStorage.removeItem(hackauthoritykey); //To remove when hack is removed
    return userManagerInstance
        .signoutRedirect()
        .then(() => console.debug('logged out'));
}

function dispatchUser(dispatch, userManagerInstance) {
    return userManagerInstance.getUser().then((user) => {
        if (user) {
            console.debug('User has been successfully loaded from store.');
            return dispatch(setLoggedUser(user));
        } else {
            console.debug('You are not logged in.');
        }
    });
}

function getPreLoginPath() {
    return sessionStorage.getItem(pathKey);
}

function handleSigninCallback(dispatch, history, userManagerInstance) {
    userManagerInstance
        .signinRedirectCallback()
        .then(function () {
            dispatch(setSignInCallbackError(null));
            const previousPath = getPreLoginPath();
            history.replace(previousPath);
        })
        .catch(function (e) {
            dispatch(setSignInCallbackError(e));
            console.error(e);
        });
}

function handleSilentRenewCallback(userManagerInstance) {
    userManagerInstance.signinSilentCallback();
}

function handleUser(dispatch, userManager) {
    userManager.events.addUserLoaded((user) => {
        console.debug('user loaded');
        dispatchUser(dispatch, userManager);
    });

    userManager.events.addSilentRenewError((error) => {
        console.debug(error);
        logout(dispatch, userManager);
    });

    console.debug('dispatch user');
    dispatchUser(dispatch, userManager);
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
