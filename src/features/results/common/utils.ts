/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { IFilterOptionDef } from 'ag-grid-community';

export const RESULT_PAGE_OPTIONS = [25, 100, 500, 1000];

export const createMultiEnumFilterParams = (): { filterOptions: IFilterOptionDef[] } => ({
    filterOptions: [
        {
            displayKey: 'customInRange',
            displayName: 'customInRange',
            predicate: (filterValues: (string | number)[][], cellValue: string | number) => {
                const allowedValues = filterValues[0];
                // if allowedValues is empty, there is no filter
                if (!allowedValues || allowedValues.length === 0) {
                    return true;
                }
                // allowedValues contains the list of selected enum values.
                return allowedValues.map(String).includes(String(cellValue));
            },
        },
    ],
});
