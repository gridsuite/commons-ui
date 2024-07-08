/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { User } from 'oidc-client';

// Is redux or isn't redux, that is the question, 🎭
interface Action<T> {
    type: T;
}

export interface UnknownAction extends Action<any> {
    [extraProps: string]: unknown;
}

export const USER = 'USER';
export type UserAction = Readonly<
    Action<typeof USER> & {
        user: User | null;
    }
>;

export function setLoggedUser(user: User | null): UserAction {
    return { type: USER, user: user };
}

export const SIGNIN_CALLBACK_ERROR = 'SIGNIN_CALLBACK_ERROR';
export type SignInCallbackErrorAction = Readonly<
    Action<typeof SIGNIN_CALLBACK_ERROR> & {
        signInCallbackError: string | null;
    }
>;

export function setSignInCallbackError(
    signInCallbackError: string | null
): SignInCallbackErrorAction {
    return {
        type: SIGNIN_CALLBACK_ERROR,
        signInCallbackError: signInCallbackError,
    };
}

export type AuthenticationRouterError<T> = {
    authenticationRouterError: {
        userName?: string;
    } & T;
};

export const UNAUTHORIZED_USER_INFO = 'UNAUTHORIZED_USER_INFO';
export type UnauthorizedUserAction = Readonly<
    Action<typeof UNAUTHORIZED_USER_INFO> &
        AuthenticationRouterError<{
            unauthorizedUserInfo: string;
        }>
>;

export function setUnauthorizedUserInfo(
    userName: string | undefined,
    unauthorizedUserInfo: string
): UnauthorizedUserAction {
    return {
        type: UNAUTHORIZED_USER_INFO,
        authenticationRouterError: {
            userName: userName,
            unauthorizedUserInfo: unauthorizedUserInfo,
        },
    };
}

export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export type LogoutErrorAction = Readonly<
    Action<typeof LOGOUT_ERROR> &
        AuthenticationRouterError<{
            logoutError: { error: Error };
        }>
>;

export function setLogoutError(
    userName: string | undefined,
    logoutError: { error: Error }
): LogoutErrorAction {
    return {
        type: LOGOUT_ERROR,
        authenticationRouterError: {
            userName: userName,
            logoutError: logoutError,
        },
    };
}

export const USER_VALIDATION_ERROR = 'USER_VALIDATION_ERROR';
export type UserValidationErrorAction = Readonly<
    Action<typeof USER_VALIDATION_ERROR> &
        AuthenticationRouterError<{
            userValidationError: { error: Error };
        }>
>;

export function setUserValidationError(
    userName: string | undefined,
    userValidationError: { error: Error }
): UserValidationErrorAction {
    return {
        type: USER_VALIDATION_ERROR,
        authenticationRouterError: {
            userName: userName,
            userValidationError: userValidationError,
        },
    };
}

export const RESET_AUTHENTICATION_ROUTER_ERROR =
    'RESET_AUTHENTICATION_ROUTER_ERROR';
export type AuthenticationRouterErrorAction = Readonly<
    Action<typeof RESET_AUTHENTICATION_ROUTER_ERROR> & {
        authenticationRouterError: null;
    }
>;

export function resetAuthenticationRouterError(): AuthenticationRouterErrorAction {
    return {
        type: RESET_AUTHENTICATION_ROUTER_ERROR,
        authenticationRouterError: null,
    };
}

export const SHOW_AUTH_INFO_LOGIN = 'SHOW_AUTH_INFO_LOGIN';
export type ShowAuthenticationRouterLoginAction = Readonly<
    Action<typeof SHOW_AUTH_INFO_LOGIN> & {
        showAuthenticationRouterLogin: boolean;
    }
>;

export function setShowAuthenticationRouterLogin(
    showAuthenticationRouterLogin: boolean
): ShowAuthenticationRouterLoginAction {
    return {
        type: SHOW_AUTH_INFO_LOGIN,
        showAuthenticationRouterLogin: showAuthenticationRouterLogin,
    };
}
