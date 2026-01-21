/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY

import { createContext } from 'react';

export type ListenerEventBase = {
    id: string;
    callback: (...args: any[]) => void;
};

export type ListenerEventWS = ListenerEventBase & {
    callback: (event: MessageEvent) => void;
};

export type ListenerOnReopen = ListenerEventBase & {
    callback: () => void;
};

export type NotificationsContextType = {
    addListenerEvent: (urlKey: string, l: ListenerEventWS) => void;
    removeListenerEvent: (urlKey: string, idListener: string) => void;
    addListenerOnReopen: (urlKey: string, l: ListenerOnReopen) => void;
    removeListenerOnReopen: (urlKey: string, idListener: string) => void;
};

export type NotificationsContextRecordType = Record<string, NotificationsContextType>;

export const NotificationsContext = createContext<NotificationsContextType>({
    addListenerEvent: () => {},
    removeListenerEvent: () => {},
    addListenerOnReopen: () => {},
    removeListenerOnReopen: () => {},
});
