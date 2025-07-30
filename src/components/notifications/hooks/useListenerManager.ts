/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY
import { useCallback, useEffect, useRef } from 'react';
import { ListenerEventWS, ListenerOnReopen } from '../contexts/NotificationsContext';

export const useListenerManager = <TListener extends ListenerEventWS | ListenerOnReopen, TMessage extends MessageEvent>(
    urls: Record<string, string | undefined>
) => {
    const urlsListenersRef = useRef<Record<string, TListener[]>>({});

    useEffect(() => {
        urlsListenersRef.current = Object.keys(urls).reduce(
            (acc, urlKey) => {
                acc[urlKey] = urlsListenersRef.current[urlKey] ?? [];
                return acc;
            },
            {} as Record<string, TListener[]>
        );
    }, [urls]);

    const addListenerEvent = useCallback((urlKey: string, listener: TListener) => {
        const urlsListeners = urlsListenersRef.current;
        if (urlKey in urlsListeners) {
            urlsListeners[urlKey].push(listener);
        } else {
            urlsListeners[urlKey] = [listener];
        }
        urlsListenersRef.current = urlsListeners;
    }, []);
    const removeListenerEvent = useCallback((urlKey: string, id: string) => {
        const listeners = urlsListenersRef.current?.[urlKey];
        if (listeners) {
            const newListerners = listeners.filter((l) => l.id !== id);
            urlsListenersRef.current = {
                ...urlsListenersRef.current,
                [urlKey]: newListerners,
            };
        }
    }, []);
    const broadcast = useCallback(
        (urlKey: string) => (event: TMessage) => {
            const listeners = urlsListenersRef.current?.[urlKey];
            if (listeners) {
                listeners.forEach(({ callback }) => {
                    callback(event);
                });
            }
        },
        []
    );

    return {
        addListener: addListenerEvent,
        removeListener: removeListenerEvent,
        broadcast,
    };
};
