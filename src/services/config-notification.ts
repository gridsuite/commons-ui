/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ReconnectingWebSocket, { Event } from 'reconnecting-websocket';
import { UrlString } from '../utils/api';
import { UserGetter, WsService } from './base-service';

export default class ConfigNotificationComSvc extends WsService {
    public constructor(userGetter: UserGetter, wsGatewayPath?: UrlString) {
        super(userGetter, 'config-notification', wsGatewayPath);
    }

    public connectNotificationsWsUpdateConfig(
        appName: string
    ): ReconnectingWebSocket {
        const webSocketUrl = `${this.queryPrefix}/notify?appName=${appName}`;
        const reconnectingWebSocket = new ReconnectingWebSocket(
            () => this.getUrlWithToken(webSocketUrl),
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
}
