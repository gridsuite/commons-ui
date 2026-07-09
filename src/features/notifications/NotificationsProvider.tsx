/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY

import { PropsWithChildren, useEffect, useMemo, useSyncExternalStore } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ListenerEventWS, ListenerOnReopen, NotificationsContext } from './contexts/NotificationsContext';
import { useListenerManager } from './hooks/useListenerManager';
import { getUser, getUserToken, subscribeToUserState } from '../../redux';

// the delay before we consider the WS truly connected
const DELAY_BEFORE_WEBSOCKET_CONNECTED = 12000;

function isUrlDefined(tuple: [string, string | undefined]): tuple is [string, string] {
    return tuple[1] !== undefined;
}

function appendTokenToUrl(url: string, token: string): string {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}access_token=${encodeURIComponent(token)}`;
}

export type NotificationsProviderProps = { urls: Record<string, string | undefined> };
export function NotificationsProvider({ urls, children }: PropsWithChildren<NotificationsProviderProps>) {
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

    // useSyncExternalStore: commons-ui has no react-redux dep, so we subscribe to the store (wired by the app via setCommonStore) directly.
    // Snapshot is a boolean, we only want to re-render on transitions where getUserToken()'s behavior changes (starts/stops producing a token)
    // i.e. login/logout, not on every silent renew.
    // We observe getUser() instead of getUserToken() because id_token blips through undefined during a renew while the user object stays
    // non-null, making it a stable proxy for "getUserToken() will return a token"
    const isAuthenticated = useSyncExternalStore(subscribeToUserState, () => getUser() !== null);
    useEffect(() => {
        const token = getUserToken();
        // Skip when unauthenticated: without a token, ReconnectingWebSocket would loop on rejected connections.
        // The isAuthenticated dep gates (re)creation on login/logout transitions.
        if (!isAuthenticated || !token) {
            console.info('Skipping Notification WebSockets: no user token available');
            return undefined;
        }
        const connections = Object.entries(urls)
            .filter(isUrlDefined)
            .map(([urlKey, url]) => {
                // URL lambda: called by ReconnectingWebSocket on each (re)connect, so reconnections always uses the
                // current token without putting the token in the effect deps (which would recreate the WS on every silent renew).
                const rws = new ReconnectingWebSocket(() => appendTokenToUrl(url, getUserToken() ?? ''), [], {
                    // this option set the minimum duration being connected before reset the retry count to 0
                    minUptime: DELAY_BEFORE_WEBSOCKET_CONNECTED,
                });

                rws.onmessage = broadcastMessage(urlKey);

                rws.onclose = (event) => {
                    console.error(`Unexpected ${urlKey} Notification WebSocket closed`, event);
                };
                rws.onerror = (event) => {
                    console.error(`Unexpected ${urlKey} Notification WebSocket error`, event);
                };

                rws.onopen = () => {
                    console.info(`${urlKey} Notification Websocket connected`);
                    broadcastOnReopen(urlKey)();
                };
                return rws;
            });

        return () => connections.forEach((c) => c.close());
    }, [broadcastMessage, broadcastOnReopen, urls, isAuthenticated]);

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
