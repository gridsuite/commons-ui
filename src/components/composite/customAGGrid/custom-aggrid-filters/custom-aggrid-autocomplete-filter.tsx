/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import { useCustomAggridColumnFilter } from './hooks/use-custom-aggrid-column-filter';
import { FilterTextComparators, isNonEmptyStringOrArray } from '../../../../utils';
import { CustomAggridFilterParams } from '../custom-aggrid-types';

export interface CustomAggridAutocompleteFilterParams extends CustomAggridFilterParams {
    getOptionLabel?: (value: string) => string; // Used for translation of enum values in the filter
    options?: string[];
}

export function CustomAggridAutocompleteFilter({
    api,
    colId,
    filterParams,
    getOptionLabel,
    options,
}: CustomAggridAutocompleteFilterParams) {
    const intl = useIntl();
    const { selectedFilterData, handleChangeFilterValue } = useCustomAggridColumnFilter(colId, filterParams);
    const [computedFilterOptions, setComputedFilterOptions] = useState<string[]>(options ?? []);

    const getUniqueValues = useCallback(() => {
        const uniqueValues = new Set<string>();
        let allNumbers = true;
        api.forEachNode((node) => {
            const value = api.getCellValue({
                rowNode: node,
                colKey: colId,
            });
            if (value !== undefined && value !== null && value !== '') {
                uniqueValues.add(value);
                if (allNumbers && Number.isNaN(Number(value))) {
                    allNumbers = false;
                }
            }
        });
        // sort the values if they are all numbers
        if (allNumbers) {
            return Array.from(uniqueValues).sort((a, b) => Number(a) - Number(b));
        }
        return Array.from(uniqueValues);
    }, [api, colId]);

    useEffect(() => {
        if (!options) {
            setComputedFilterOptions(getUniqueValues());
        }
    }, [options, getUniqueValues]);

    const handleFilterAutoCompleteChange = (_: SyntheticEvent, data: string[]) => {
        handleChangeFilterValue({ value: data, type: FilterTextComparators.EQUALS });
    };

    return (
        <Autocomplete
            multiple
            value={Array.isArray(selectedFilterData) ? selectedFilterData : []}
            options={computedFilterOptions}
            getOptionLabel={(option) => String(getOptionLabel ? getOptionLabel(option) : option)}
            onChange={handleFilterAutoCompleteChange}
            size="small"
            disableCloseOnSelect
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={
                        !isNonEmptyStringOrArray(selectedFilterData)
                            ? intl.formatMessage({
                                  id: 'filter.filterOoo',
                              })
                            : ''
                    }
                />
            )}
            fullWidth
        />
    );
}
