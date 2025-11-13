/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function copyToClipboard(valueToCopy: string, onSuccess?: () => void, onError?: () => void) {
    if ('clipboard' in navigator) {
        navigator.clipboard
            .writeText(valueToCopy)
            .then(() => {
                if (onSuccess) onSuccess();
            })
            .catch((error: any) => {
                console.error('Clipboard copy error: ', error);
                if (onError) onError();
            });
    } else {
        console.error('navigator.clipboard is not supported by your current navigator');
        if (onError) onError();
    }
}
