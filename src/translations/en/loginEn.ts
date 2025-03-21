/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const loginEn = defineMessages({
    'login/login': { defaultMessage: 'Login' },
    'login/connection': { defaultMessage: 'Connection' },
    'login/unauthorizedAccess': { defaultMessage: 'Unauthorized access' },
    'login/unauthorizedAccessMessage': {
        defaultMessage: 'The user {userName} does not have permission to access GridSuite yet.',
    },
    'login/errorInUserValidation': { defaultMessage: 'Error during user validation' },
    'login/errorInUserValidationMessage': {
        defaultMessage: 'An unexpected error occurred during user validation for {userName}.',
    },
    'login/errorInLogout': { defaultMessage: 'Error during user logout' },
    'login/errorInLogoutMessage': { defaultMessage: 'An unexpected error occurred during user logout for {userName}.' },
    'login/logout': { defaultMessage: 'Logout' },
});
