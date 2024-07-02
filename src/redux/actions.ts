/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { User } from 'oidc-client';

export const USER = 'USER';

export function setLoggedUser(user: User | null) {
    return { type: USER, user };
}

export const SIGNIN_CALLBACK_ERROR = 'SIGNIN_CALLBACK_ERROR';

export function setSignInCallbackError(signInCallbackError: string | null) {
    return {
        type: SIGNIN_CALLBACK_ERROR,
        signInCallbackError,
    };
}

export const UNAUTHORIZED_USER_INFO = 'UNAUTHORIZED_USER_INFO';

export function setUnauthorizedUserInfo(
    userName: string | undefined,
    unauthorizedUserInfo: string
) {
    return {
        type: UNAUTHORIZED_USER_INFO,
        authenticationRouterError: {
            userName,
            unauthorizedUserInfo,
        },
    };
}

export const LOGOUT_ERROR = 'LOGOUT_ERROR';

export function setLogoutError(
    userName: string | undefined,
    logoutError: { error: Error }
) {
    return {
        type: LOGOUT_ERROR,
        authenticationRouterError: {
            userName,
            logoutError,
        },
    };
}

export const USER_VALIDATION_ERROR = 'USER_VALIDATION_ERROR';

export function setUserValidationError(
    userName: string | undefined,
    userValidationError: { error: Error }
) {
    return {
        type: USER_VALIDATION_ERROR,
        authenticationRouterError: {
            userName,
            userValidationError,
        },
    };
}

export const RESET_AUTHENTICATION_ROUTER_ERROR =
    'RESET_AUTHENTICATION_ROUTER_ERROR';

export function resetAuthenticationRouterError() {
    return {
        type: RESET_AUTHENTICATION_ROUTER_ERROR,
        authenticationRouterError: null,
    };
}

export const SHOW_AUTH_INFO_LOGIN = 'SHOW_AUTH_INFO_LOGIN';

export function setShowAuthenticationRouterLogin(
    showAuthenticationRouterLogin: boolean
) {
    return {
        type: SHOW_AUTH_INFO_LOGIN,
        showAuthenticationRouterLogin,
    };
}
