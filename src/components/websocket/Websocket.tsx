/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY

import {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ListenerWS, WSContext, WSContextType } from './contexts/WSContext';

// the delay before we consider the WS truly connected
const DELAY_BEFORE_WEBSOCKET_CONNECTED = 12000;

type WebsocketProps = { urls: Record<string, string> };
function Websocket({ urls, children }: PropsWithChildren<WebsocketProps>) {
    const urlsListenersRef = useRef(
        Object.keys(urls).reduce((acc, urlKey) => {
            acc[urlKey] = [];
            return acc;
        }, {} as Record<string, ListenerWS[]>)
    );

    const broadcastMessage = useCallback(
        (urlKey: string) => (event: MessageEvent) => {
            const listenerList = urlsListenersRef.current?.[urlKey];
            if (listenerList) {
                listenerList.forEach(({ callback }) => {
                    callback(event);
                });
            }
        },
        []
    );

    useEffect(() => {
        const connections = Object.keys(urls).map((urlKey) => {
            const rws = new ReconnectingWebSocket(() => urls[urlKey], [], {
                minUptime: DELAY_BEFORE_WEBSOCKET_CONNECTED,
            });

            rws.onmessage = broadcastMessage(urlKey);

            rws.onclose = (event) => {
                console.error(
                    'Unexpected Notification WebSocket closed',
                    event
                );
            };
            rws.onerror = (event) => {
                console.error('Unexpected Notification WebSocket error', event);
            };

            rws.onopen = () => {
                console.log('Notification WebSocket opened');
            };
            return rws;
        });

        return () => {
            connections.forEach((c) => c.close());
        };
    }, [broadcastMessage, urls]);

    const addListener: WSContextType['addListener'] = useCallback(
        (urlKey, listener) => {
            const urlsListeners = urlsListenersRef.current;
            if (urlKey in urlsListeners) {
                urlsListeners[urlKey].push(listener);
            } else {
                urlsListeners[urlKey] = [listener];
            }
            urlsListenersRef.current = urlsListeners;
        },
        []
    );
    const removeListener: WSContextType['removeListener'] = useCallback(
        (urlKey, id) => {
            const listeners = urlsListenersRef.current?.[urlKey];
            if (listeners) {
                const newListerner = listeners.filter((l) => l.id !== id);
                urlsListenersRef.current = {
                    ...urlsListenersRef.current,
                    [urlKey]: newListerner,
                };
            }
        },
        []
    );
    const contextValue = useMemo(
        () => ({ addListener, removeListener }),
        [addListener, removeListener]
    );
    return (
        <WSContext.Provider value={contextValue}>{children}</WSContext.Provider>
    );
}

export default Websocket;
