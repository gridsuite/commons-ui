/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-disable import/prefer-default-export */

import ReconnectingWebSocket, { Event } from 'reconnecting-websocket';
import { getUrlWithToken, getWsBase } from '../utils/api';

/**
 * Return the base API prefix to the config server
 * <br/>Note: cannot be a const because part of the prefix can be overridden at runtime
 * @param vApi the version of api to use
 */
function getPrefix() {
    return `${getWsBase()}/config-notification`;
}

export function connectNotificationsWsUpdateConfig(
    appName: string
): ReconnectingWebSocket {
    const webSocketUrl = `${getPrefix()}/notify?appName=${appName}`;
    const reconnectingWebSocket = new ReconnectingWebSocket(
        () => getUrlWithToken(webSocketUrl),
        undefined,
        { debug: `${import.meta.env.VITE_DEBUG_REQUESTS}` === 'true' }
    );
    reconnectingWebSocket.onopen = (event: Event) => {
        console.groupCollapsed(
            `Connected Websocket update config ui: ${appName}`
        );
        console.debug(`Websocket URL: ${webSocketUrl}`);
        console.dir(event);
        console.groupEnd();
    };
    return reconnectingWebSocket;
}
