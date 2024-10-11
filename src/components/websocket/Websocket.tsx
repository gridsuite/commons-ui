/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY

import { PropsWithChildren, useEffect, useMemo } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ListenerEventWS, ListenerOnOpen, WSContext } from './contexts/WSContext';
import { useListenerManager } from './hooks/useListenerManager';

// the delay before we consider the WS truly connected
const DELAY_BEFORE_WEBSOCKET_CONNECTED = 12000;

export type WebsocketProps = { urls: Record<string, string> };
export function Websocket({ urls, children }: PropsWithChildren<WebsocketProps>) {
    const {
        broadcast: broadcastMessage,
        addListener: addListenerMessage,
        removeListener: removeListenerMessage,
    } = useListenerManager<ListenerEventWS, MessageEvent>(urls);
    const {
        broadcast: broadcastOnOpen,
        addListener: addListenerOnOpen,
        removeListener: removeListenerOnOpen,
    } = useListenerManager<ListenerOnOpen, never>(urls);

    useEffect(() => {
        const connections = Object.keys(urls).map((urlKey) => {
            const rws = new ReconnectingWebSocket(() => urls[urlKey], [], {
                // this option set the minimum duration being connected before reset the retry count to 0
                minUptime: DELAY_BEFORE_WEBSOCKET_CONNECTED,
            });

            rws.onmessage = broadcastMessage(urlKey);

            rws.onclose = (event) => {
                console.error('Unexpected Notification WebSocket closed', event);
            };
            rws.onerror = (event) => {
                console.error('Unexpected Notification WebSocket error', event);
            };

            rws.onopen = () => broadcastOnOpen(urlKey);
            return rws;
        });

        return () => {
            connections.forEach((c) => c.close());
        };
    }, [broadcastMessage, broadcastOnOpen, urls]);

    const contextValue = useMemo(
        () => ({
            addListenerEvent: addListenerMessage,
            removeListenerEvent: removeListenerMessage,
            addListenerOnOpen,
            removeListenerOnOpen,
        }),
        [addListenerMessage, removeListenerMessage, addListenerOnOpen, removeListenerOnOpen]
    );
    return <WSContext.Provider value={contextValue}>{children}</WSContext.Provider>;
}
