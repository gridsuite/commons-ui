/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default function useDebugRender(label: string) {
    // uncomment when you want the output in the console
    if (`${import.meta.env.VITE_DEBUG_HOOK_RENDER}` === 'true') {
        const logLabel = `${label} render`;
        console.count?.(logLabel);
        console.timeStamp?.(logLabel);
    }
}
