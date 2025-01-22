/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UserManager } from 'oidc-client';
import { Dispatch } from 'react';
import { NavigateFunction, Location } from 'react-router-dom';
import { AuthenticationActions } from '../../redux/actions/authActions';

export type AuthenticationRouterErrorState = {
    userName?: string;
    userValidationError?: { error: Error };
    logoutError?: { error: Error };
    unauthorizedUserInfo?: string;
};

export type UserManagerState = {
    instance: UserManager | null;
    error: string | null;
};

export interface AuthenticationRouterProps {
    userManager: UserManagerState;
    signInCallbackError: Error | null;
    authenticationRouterError: AuthenticationRouterErrorState | null;
    showAuthenticationRouterLogin: boolean;
    dispatch: Dispatch<AuthenticationActions>;
    navigate: NavigateFunction;
    location: Location;
}
