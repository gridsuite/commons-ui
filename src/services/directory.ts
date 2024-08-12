/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { appendSearchParam, getRequestParam, UrlString } from '../utils/api';
import { ElementAttributes } from '../utils/types';
import { ApiService, UserGetter } from './base-service';

export default class DirectoryComSvc extends ApiService {
    public constructor(userGetter: UserGetter, restGatewayPath?: UrlString) {
        super(userGetter, 'directory', restGatewayPath);
    }

    public async fetchRootFolders(types: string[]) {
        console.debug('Fetching Root Directories');
        const urlSearchParams = getRequestParam('elementTypes', types).toString();
        return this.backendFetchJson<ElementAttributes[]>(
            `${this.getPrefix(1)}/root-directories?${urlSearchParams}`,
            'GET'
        );
    }

    public async fetchDirectoryContent(directoryUuid: UUID, types?: string[]) {
        console.debug("Fetching Folder content '%s'", directoryUuid);
        return this.backendFetchJson<ElementAttributes[]>(
            appendSearchParam(
                `${this.getPrefix(1)}/directories/${directoryUuid}/elements`,
                getRequestParam('elementTypes', types)
            ),
            'GET'
        );
    }

    public async fetchDirectoryElementPath(elementUuid: UUID) {
        console.debug(`Fetching element '${elementUuid}' and its parents info ...`);
        const fetchPathUrl = `${this.getPrefix(1)}/elements/${encodeURIComponent(elementUuid)}/path`;
        return this.backendFetchJson<ElementAttributes[]>(fetchPathUrl, 'GET');
    }

    public async elementExists(directoryUuid: UUID, elementName: string, type: string) {
        const response = await this.backendFetch(
            `${this.getPrefix(1)}/directories/${directoryUuid}/elements/${encodeURIComponent(
                elementName
            )}/types/${type}`,
            'HEAD'
        );
        return response.status !== 204; // HTTP 204 : No-content
    }
}
