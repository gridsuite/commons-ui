/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY

import { createContext } from 'react';

export type ListenerEventWS = {
    id: string;
    callback: (event: MessageEvent) => void;
};

export type ListenerOnOpen = {
    id: string;
    callback: () => void;
};

export type WSContextType = {
    addListenerEvent: (urlKey: string, l: ListenerEventWS) => void;
    removeListenerEvent: (urlKey: string, idListener: string) => void;
    addListenerOnOpen: (urlKey: string, l: ListenerOnOpen) => void;
    removeListenerOnOpen: (urlKey: string, idListener: string) => void;
};

export type WSContextRecordType = Record<string, WSContextType>;

export const WSContext = createContext<WSContextType>({
    addListenerEvent: () => {},
    removeListenerEvent: () => {},
    addListenerOnOpen: () => {},
    removeListenerOnOpen: () => {},
});
