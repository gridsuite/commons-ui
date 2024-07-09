/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from 'react';
import { User } from 'oidc-client';
import {
    AuthenticationRouterErrorAction,
    LogoutErrorAction,
    ShowAuthenticationRouterLoginAction,
    SignInCallbackErrorAction,
    UnauthorizedUserAction,
    UserAction,
    UserValidationErrorAction,
} from './actions';

export type CommonStoreState = {
    user: User;
};

export type CommonActions =
    | UserAction
    | SignInCallbackErrorAction
    | UnauthorizedUserAction
    | LogoutErrorAction
    | UserValidationErrorAction
    | AuthenticationRouterErrorAction
    | ShowAuthenticationRouterLoginAction;

interface CommonStore {
    getState(): CommonStoreState;
    dispatch: Dispatch<CommonActions>;
}

let commonStore: CommonStore | undefined;

/**
 * Set a copy of the reference to the store to be able to access it from this library.
 * It's useful to get access to the user token outside of the React context in API files.
 * NB : temporary solution before refactoring the token management in the whole gridsuite stack.
 */
export function setCommonStore(store: CommonStore): void {
    commonStore = store;
}

export function getUserToken() {
    return commonStore?.getState().user.id_token;
}
