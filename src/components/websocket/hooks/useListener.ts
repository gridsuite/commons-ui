/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY

import { useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WSContext } from '../contexts/WSContext';

const useListener = (
    listenerKey: string,
    listenerCallback: (event: MessageEvent<any>) => void,
    propsId?: string
) => {
    const { addListener, removeListener } = useContext(WSContext);
    useEffect(() => {
        const id = propsId ?? uuidv4();
        addListener(listenerKey, {
            id,
            callback: listenerCallback,
        });
        return () => removeListener(listenerKey, id);
    }, [addListener, removeListener, listenerKey, listenerCallback, propsId]);
};

export default useListener;
