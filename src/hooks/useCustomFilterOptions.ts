/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { createFilterOptions, FilterOptionsState } from '@mui/material';

/**
 * Hook used to add custom filterOptions, use only when freeSolo = true
 */
export function useCustomFilterOptions() {
    return useCallback((options: string[], params: FilterOptionsState<string>) => {
        const filter = createFilterOptions<string>();
        const filteredOptions = filter(options, params);
        const { inputValue } = params;

        const isExisting = options.some((option) => inputValue === option);
        if (isExisting && options.length === 1 && options[0] === inputValue) {
            // exact match : nothing to show
            return [];
        }

        if (inputValue !== '' && !isExisting) {
            filteredOptions.push(inputValue);
        }
        return filteredOptions;
    }, []);
}
