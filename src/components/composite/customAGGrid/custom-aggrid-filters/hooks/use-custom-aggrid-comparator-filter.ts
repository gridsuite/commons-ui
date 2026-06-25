/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ChangeEvent, useMemo } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useSnackMessage } from '../../../../../hooks';
import { FilterDataTypes, FilterTextComparators } from '../../../../../utils';
import { FilterParams } from '../../custom-aggrid-types';
import { countDecimalPlacesFromString } from '../../../../../utils/rounding';
import { computeTolerance } from '../utils/filter-tolerance-utils';
import { useCustomAggridColumnFilter } from './use-custom-aggrid-column-filter';

export const useCustomAggridComparatorFilter = (colId: string, filterParams: FilterParams) => {
    const { dataType = FilterDataTypes.TEXT, comparators = [] } = filterParams;

    const isNumberInput = dataType === FilterDataTypes.NUMBER;

    const { selectedFilterData, selectedFilterComparator, handleChangeFilterValue, handleChangeComparator } =
        useCustomAggridColumnFilter(colId, filterParams);

    const { snackWarning } = useSnackMessage();

    const handleFilterComparatorChange = (event: SelectChangeEvent) => {
        const newType = event.target.value;
        handleChangeComparator(newType);
    };

    const handleClearFilter = () => {
        if (
            (selectedFilterComparator === FilterTextComparators.IS_EMPTY ||
                selectedFilterComparator === FilterTextComparators.IS_NOT_EMPTY) &&
            comparators.length > 0
        ) {
            // we switch to the first comparator when we clear the IS_EMPTY or IS_NOT_EMPTY comparator
            handleChangeComparator(comparators[0]);
        } else {
            handleChangeFilterValue({
                value: undefined,
            });
        }
    };
    const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toUpperCase();
        handleChangeFilterValue({
            value,
            tolerance: isNumberInput ? computeTolerance(value) : undefined,
        });
    };

    const decimalAfterDot = useMemo(() => {
        if (isNumberInput) {
            const countDecimalAfterDot: number = countDecimalPlacesFromString(String(selectedFilterData));
            if (decimalAfterDot >= 13) {
                snackWarning({
                    headerId: 'filter.warnRounding',
                });
            }
            return countDecimalAfterDot;
        }
        return 0;
    }, [isNumberInput, selectedFilterData, snackWarning]);

    return {
        selectedFilterData,
        selectedFilterComparator,
        decimalAfterDot,
        isNumberInput,
        handleFilterComparatorChange,
        handleFilterTextChange,
        handleClearFilter,
    };
};
