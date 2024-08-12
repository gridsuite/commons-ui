/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ApiService, UserGetter } from './base-service';
import { UrlString } from '../utils/api';

export default class FilterComSvc extends ApiService {
    public constructor(userGetter: UserGetter, restGatewayPath?: UrlString) {
        super(userGetter, 'filter', restGatewayPath);
    }

    /**
     * Get filter by id
     * @returns {Promise<unknown>}
     */
    public async getFilterById(id: string) {
        return this.backendFetchJson<Record<string, any>>(`${this.getPrefix(1)}/filters/${id}`);
    }
}
