/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useContext, useEffect, useRef } from 'react';
import { WSContext } from '../contexts/WSContext';

export const randomUniqueID = (length: number) =>
    Math.random()
        .toString(36)
        .slice(13 - Math.min(length, 13));

const useListener = (
    listenerKey: string,
    listenerCallback: (event: MessageEvent<any>) => void,
    propsId?: string
) => {
    // protect callback if not memoise
    const callbackRef = useRef(listenerCallback);
    const { addListener, removeListener } = useContext(WSContext);
    useEffect(() => {
        const id = propsId ?? randomUniqueID(13);
        addListener(listenerKey, {
            id,
            callback: callbackRef.current,
        });
        return () => removeListener(listenerKey, id);
    }, [addListener, removeListener, listenerKey, propsId]);
};

export default useListener;
