/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getGatewayWsPath } from './variables';
import { getUserToken } from './utils';

export function getWsBase(): string {
    // We use the `baseURI` (from `<base/>` in index.html) to build the URL, which is corrected by httpd/nginx
    return (
        document.baseURI
            .replace(/^http(s?):\/\//, 'ws$1://')
            .replace(/\/+$/, '') + getGatewayWsPath()
    );
}

export function getUrlWithToken(baseUrl: string) {
    const querySymbol = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${querySymbol}access_token=${getUserToken()}`;
}
