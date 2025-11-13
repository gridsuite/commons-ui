/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';

type CopyState = 'READY' | 'START' | 'SUCCESS' | 'ERROR';

export const useClipboard = () => {
    const [copyState, setCopyState] = useState<CopyState>('READY');

    function ready() {
        setCopyState('READY');
    }

    function copy(valueToCopy: string) {
        setCopyState('START');
        if ('clipboard' in navigator) {
            navigator.clipboard
                .writeText(valueToCopy)
                .then(() => setCopyState('SUCCESS'))
                .catch((error: any) => {
                    console.error('Clipboard copy error: ', error);
                    setCopyState('ERROR');
                });
        } else {
            console.error('navigation.clipboard is not supported by current navigator');
            setCopyState('ERROR');
        }
    }

    return { copy, copyState, ready };
};
