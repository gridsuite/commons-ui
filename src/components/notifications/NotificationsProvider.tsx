/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY

import { PropsWithChildren, RefObject, useEffect, useMemo, useRef } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ListenerEventWS, ListenerOnReopen, NotificationsContext } from './contexts/NotificationsContext';
import { useListenerManager } from './hooks/useListenerManager';

// the delay before we consider the WS truly connected
const DELAY_BEFORE_WEBSOCKET_CONNECTED = 12000;

function isUrlDefined(tuple: [string, string | undefined]): tuple is [string, string] {
    return tuple[1] !== undefined;
}

type SkipFlag = { current: boolean };

type Connection = {
    urlKey: string;
    rws: ReconnectingWebSocket;
    // true when we trigger the reconnect ourselves: skip onReopen broadcast on the next open
    skipNextReopenRef: SkipFlag;
};

function createNewConnectionWS(
    urlKey: string,
    url: string,
    broadcastMessage: (key: string) => (event: MessageEvent) => void,
    broadcastOnReopen: (key: string) => () => void
): Connection {
    const skipNextReopenRef: SkipFlag = { current: false };
    const rws = new ReconnectingWebSocket(() => url, [], {
        minUptime: DELAY_BEFORE_WEBSOCKET_CONNECTED,
    });

    rws.onmessage = broadcastMessage(urlKey);

    rws.onclose = (event) => {
        if (!event.wasClean) {
            console.error(`Unexpected ${urlKey} Notification WebSocket closed`, event);
        }
    };

    rws.onerror = (event) => {
        console.error(`${urlKey} Notification WebSocket error`, event);
    };

    rws.onopen = () => {
        if (skipNextReopenRef.current) {
            skipNextReopenRef.current = false;
            return;
        }
        broadcastOnReopen(urlKey)();
    };

    return { urlKey, rws, skipNextReopenRef };
}

/**
 * Watches the access token and forces a reconnect of all WebSockets when it
 * changes (silent token renew), so the server-side session uses the fresh
 * token. The onReopen broadcast is skipped in that case since reconnects we
 * trigger ourselves don't have a notification gap that would warrant a re-fetch.
 */
function useReconnectOnRenewSilent(accessToken: string | undefined, connectionsRef: RefObject<Connection[]>) {
    const previousTokenRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        const previous = previousTokenRef.current;
        previousTokenRef.current = accessToken;

        if (!previous || !accessToken || previous === accessToken) {
            return;
        }

        const connections = connectionsRef.current ?? [];
        console.info(`Access token renewed, reconnecting ${connections.length} WebSocket(s)`);
        connections.forEach(({ rws, skipNextReopenRef }) => {
            // eslint-disable-next-line no-param-reassign
            skipNextReopenRef.current = true;
            rws.reconnect();
        });
    }, [accessToken, connectionsRef]);
}

export type NotificationsProviderProps = {
    urls: Record<string, string | undefined>;
    /**
     * Access token used as a change signal
     * to detect silent token renewals: when the value changes, all WebSockets
     * are reconnected so the server-side session uses the fresh token.
     */
    accessToken?: string;
};

export function NotificationsProvider({ urls, accessToken, children }: PropsWithChildren<NotificationsProviderProps>) {
    const {
        broadcast: broadcastMessage,
        addListener: addListenerMessage,
        removeListener: removeListenerMessage,
    } = useListenerManager<ListenerEventWS>(urls);
    const {
        broadcast: broadcastOnReopen,
        addListener: addListenerOnReopen,
        removeListener: removeListenerOnReopen,
    } = useListenerManager<ListenerOnReopen>(urls);

    const connectionsRef = useRef<Connection[]>([]);

    useEffect(() => {
        const connections = Object.entries(urls)
            .filter(isUrlDefined)
            .map(([urlKey, url]) => createNewConnectionWS(urlKey, url, broadcastMessage, broadcastOnReopen));
        connectionsRef.current = connections;

        return () => {
            connections.forEach((c) => c.rws.close());
            connectionsRef.current = [];
        };
    }, [broadcastMessage, broadcastOnReopen, urls]);

    useReconnectOnRenewSilent(accessToken, connectionsRef);

    const contextValue = useMemo(
        () => ({
            addListenerEvent: addListenerMessage,
            removeListenerEvent: removeListenerMessage,
            addListenerOnReopen,
            removeListenerOnReopen,
        }),
        [addListenerMessage, removeListenerMessage, addListenerOnReopen, removeListenerOnReopen]
    );
    return <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>;
}
