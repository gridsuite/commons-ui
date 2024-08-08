/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { appendSearchParam, getRequestParams, HttpContentType, UrlString } from '../utils/api';
import { ElementAttributes } from '../utils/types';
import { ApiService, UserGetter } from './base-service';

export default class ExploreComSvc extends ApiService {
    public constructor(userGetter: UserGetter, restGatewayPath?: UrlString) {
        super(userGetter, 'explore', restGatewayPath);
    }

    public async createFilter(newFilter: any, name: string, description: string, parentDirectoryUuid?: UUID) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('name', name);
        urlSearchParams.append('description', description);
        if (parentDirectoryUuid) {
            urlSearchParams.append('parentDirectoryUuid', parentDirectoryUuid);
        }
        await this.backendFetch(`${this.getPrefix(1)}/explore/filters?${urlSearchParams.toString()}`, {
            method: 'POST',
            headers: { 'Content-Type': HttpContentType.APPLICATION_JSON },
            body: JSON.stringify(newFilter),
        });
    }

    public async saveFilter(filter: Record<string, unknown>, name: string) {
        await this.backendFetch(
            `${this.getPrefix(1)}/explore/filters/${filter.id}?${new URLSearchParams({
                name,
            }).toString()}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': HttpContentType.APPLICATION_JSON },
                body: JSON.stringify(filter),
            }
        );
    }

    public async fetchElementsInfos(ids: UUID[], elementTypes?: string[], equipmentTypes?: string[]) {
        console.info('Fetching elements metadata');
        const urlSearchParams = getRequestParams({
            ids: ids.filter((id) => id), // filter falsy elements
            equipmentTypes: equipmentTypes ?? [],
            elementTypes: elementTypes ?? [],
        });
        return this.backendFetchJson<ElementAttributes[]>(
            appendSearchParam(`${this.getPrefix(1)}/explore/elements/metadata?${urlSearchParams}`, urlSearchParams),
            'GET'
        );
    }
}
