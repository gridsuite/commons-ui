/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type AnnouncementDto, type UserDetail } from '../utils/types/types';
import { PREFIX_STUDY_SERVER_QUERIES } from './loadflow';
import { backendFetchJson } from './utils';

export function fetchUserDetails(user: string): Promise<UserDetail> {
    console.info('get user details');
    return backendFetchJson(`${PREFIX_STUDY_SERVER_QUERIES}/v1/user-admin/users/${user}/detail`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });
}

export function fetchCurrentAnnouncement(): Promise<AnnouncementDto | null> {
    console.info(`Fetching current announcement ...`);
    const url = `${PREFIX_STUDY_SERVER_QUERIES}/v1/user-admin/announcements/current`;
    return backendFetchJson(url, {
        method: 'get',
    });
}
