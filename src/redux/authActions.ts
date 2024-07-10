/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { User } from 'oidc-client';

// Is redux or isn't redux, that is the question, 🎭
export interface Action<T> {
    type: T;
}
type ReadonlyAction<T> = Readonly<Action<T>>;

export const USER = 'USER';
export type UserAction = ReadonlyAction<typeof USER> & {
    user: User | null;
};

export function setLoggedUser(user: User | null): UserAction {
    return { type: USER, user };
}

export const SIGNIN_CALLBACK_ERROR = 'SIGNIN_CALLBACK_ERROR';
export type SignInCallbackErrorAction = ReadonlyAction<
    typeof SIGNIN_CALLBACK_ERROR
> & {
    signInCallbackError: Error | null;
};

export function setSignInCallbackError(
    signInCallbackError: Error | null
): SignInCallbackErrorAction {
    return {
        type: SIGNIN_CALLBACK_ERROR,
        signInCallbackError,
    };
}

export type AuthenticationRouterErrorBase<T> = {
    authenticationRouterError: {
        userName?: string;
    } & T;
};

export const UNAUTHORIZED_USER_INFO = 'UNAUTHORIZED_USER_INFO';
export type UnauthorizedUserAction = ReadonlyAction<
    typeof UNAUTHORIZED_USER_INFO
> &
    AuthenticationRouterErrorBase<{
        unauthorizedUserInfo: string;
    }>;

export function setUnauthorizedUserInfo(
    userName: string | undefined,
    unauthorizedUserInfo: string
): UnauthorizedUserAction {
    return {
        type: UNAUTHORIZED_USER_INFO,
        authenticationRouterError: {
            userName,
            unauthorizedUserInfo,
        },
    };
}

export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export type LogoutErrorAction = ReadonlyAction<typeof LOGOUT_ERROR> &
    AuthenticationRouterErrorBase<{
        logoutError: { error: Error };
    }>;

export function setLogoutError(
    userName: string | undefined,
    logoutError: { error: Error }
): LogoutErrorAction {
    return {
        type: LOGOUT_ERROR,
        authenticationRouterError: {
            userName,
            logoutError,
        },
    };
}

export const USER_VALIDATION_ERROR = 'USER_VALIDATION_ERROR';
export type UserValidationErrorAction = ReadonlyAction<
    typeof USER_VALIDATION_ERROR
> &
    AuthenticationRouterErrorBase<{
        userValidationError: { error: Error };
    }>;

export function setUserValidationError(
    userName: string | undefined,
    userValidationError: { error: Error }
): UserValidationErrorAction {
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
export type AuthenticationRouterErrorAction = ReadonlyAction<
    typeof RESET_AUTHENTICATION_ROUTER_ERROR
> & {
    authenticationRouterError: null;
};

export function resetAuthenticationRouterError(): AuthenticationRouterErrorAction {
    return {
        type: RESET_AUTHENTICATION_ROUTER_ERROR,
        authenticationRouterError: null,
    };
}

export const SHOW_AUTH_INFO_LOGIN = 'SHOW_AUTH_INFO_LOGIN';
export type ShowAuthenticationRouterLoginAction = ReadonlyAction<
    typeof SHOW_AUTH_INFO_LOGIN
> & {
    showAuthenticationRouterLogin: boolean;
};

export function setShowAuthenticationRouterLogin(
    showAuthenticationRouterLogin: boolean
): ShowAuthenticationRouterLoginAction {
    return {
        type: SHOW_AUTH_INFO_LOGIN,
        showAuthenticationRouterLogin,
    };
}

export type AuthenticationActions =
    | UserAction
    | SignInCallbackErrorAction
    | UnauthorizedUserAction
    | LogoutErrorAction
    | UserValidationErrorAction
    | AuthenticationRouterErrorAction
    | ShowAuthenticationRouterLoginAction;
