/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { getUserToken } from '../../redux';

// the delay before we consider the WS truly connected
export const DELAY_BEFORE_WEBSOCKET_CONNECTED = 12000;

export function isUrlDefined(tuple: [string, string | undefined]): tuple is [string, string] {
    return tuple[1] !== undefined;
}

export function appendToken(url: string): string {
    const token = getUserToken();
    if (!token) {
        return url;
    }
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}access_token=${encodeURIComponent(token)}`;
}
