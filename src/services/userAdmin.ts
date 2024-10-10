/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UserDetail } from '../utils/types/types';
import { backendFetchJson } from './utils';

const PREFIX_USER_ADMIN_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/user-admin/v1`;
function fetchUserDetails(user: string): Promise<UserDetail> {
    console.info('get user details');
    return backendFetchJson(`${PREFIX_USER_ADMIN_QUERIES}/users/${user}/detail`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });
}

export default fetchUserDetails;
