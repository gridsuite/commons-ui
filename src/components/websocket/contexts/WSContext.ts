/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY

import { createContext } from 'react';

export type ListenerWS = {
    id: string;
    callback: (event: MessageEvent) => void;
};

export type WSContextType = {
    addListener: (urlKey: string, l: ListenerWS) => void;
    removeListener: (urlKey: string, idListener: string) => void;
};

export type WSContextRecordType = Record<string, WSContextType>;

export const WSContext = createContext<WSContextType>({
    addListener: () => {},
    removeListener: () => {},
});
