/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// @author Quentin CAPY

import { useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NotificationsContext } from '../contexts/NotificationsContext';

export const useNotificationsListener = (
    listenerKey: string,
    {
        listenerCallbackMessage,
        listenerCallbackOnReopen,
        propsId,
    }: {
        listenerCallbackMessage?: (event: MessageEvent<any>) => void;
        listenerCallbackOnReopen?: () => void;
        propsId?: string;
    }
) => {
    const { addListenerEvent, removeListenerEvent, addListenerOnReopen, removeListenerOnReopen } =
        useContext(NotificationsContext);

    useEffect(() => {
        const id = propsId ?? uuidv4();
        if (listenerCallbackMessage) {
            addListenerEvent(listenerKey, {
                id,
                callback: listenerCallbackMessage,
            });
        }
        return () => removeListenerEvent(listenerKey, id);
    }, [addListenerEvent, removeListenerEvent, listenerKey, listenerCallbackMessage, propsId]);

    useEffect(() => {
        const id = propsId ?? uuidv4();
        if (listenerCallbackOnReopen) {
            addListenerOnReopen(listenerKey, {
                id,
                callback: listenerCallbackOnReopen,
            });
        }
        return () => removeListenerOnReopen(listenerKey, id);
    }, [addListenerOnReopen, removeListenerOnReopen, listenerKey, listenerCallbackOnReopen, propsId]);
};
