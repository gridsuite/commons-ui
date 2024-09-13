/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export { AuthenticationRouter } from './AuthenticationRouter';

export type {
    AuthenticationRouterErrorState,
    AuthenticationRouterProps,
    UserManagerState,
} from './AuthenticationRouter';

export { Login } from './Login';

export { SignInCallbackHandler } from './SignInCallbackHandler';

export { SilentRenewCallbackHandler } from './SilentRenewCallbackHandler';

export {
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    logout,
    dispatchUser,
    getPreLoginPath,
} from './utils/authService';
