/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo } from 'react';
import { debounce } from '@mui/material';

export const useDebounce = (func: (...args: any[]) => any, delay = 700) => {
    const debouncedChangeHandler = useMemo(
        () => debounce(func, delay),
        [func, delay]
    );

    // Stop the invocation of the debounced function after unmounting

    useEffect(() => {
        return () => {
            debouncedChangeHandler.clear();
        };
    }, [debouncedChangeHandler]);

    return debouncedChangeHandler;
};
