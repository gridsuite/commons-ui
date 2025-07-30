/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';

/** Hook used to modify the appearance of Select into a readonly TextField,
    by hiding display button and setting readOnly prop to true
    if options list is only one element long.
    P.S :  Do not use on AutoComplete.
*/
export function useSelectAppearance(listLength: number) {
    return useMemo(() => {
        if (listLength === 1) {
            return {
                IconComponent: () => null,
                sx: {
                    boxShadow: 'none',
                    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                    pointerEvents: 'none',
                    border: 'none',
                },
                readOnly: true,
                disableUnderline: true,
            };
        }
        return {};
    }, [listLength]);
}
