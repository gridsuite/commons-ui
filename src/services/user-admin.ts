/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { User } from 'oidc-client';
import { ApiService, UserGetter } from './base-service';
import { extractUserSub, UrlString } from '../utils/api';

export default class UserAdminComSvc extends ApiService {
    public constructor(userGetter: UserGetter, restGatewayPath?: UrlString) {
        super(userGetter, 'user-admin', restGatewayPath);
    }

    /**
     * Note: is called from commons-ui AuthServices to validate user infos before setting state.user!
     */
    public async fetchValidateUser(user: User) {
        try {
            const userSub = await extractUserSub(user);
            console.debug(`Fetching access for user "${userSub}"...`);
            const response = await this.backendFetch(
                `${this.getPrefix(1)}/users/${userSub}`,
                { method: 'HEAD' },
                this.getUserToken(user) ?? undefined
            );
            // if the response is ok, the responseCode will be either 200 or 204 otherwise it's an HTTP error and it will be caught
            return response.status === 200;
        } catch (error: any) {
            if (error.status === 403) {
                return false;
            }
            throw error;
        }
    }
}
