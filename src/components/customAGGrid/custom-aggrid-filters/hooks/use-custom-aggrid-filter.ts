/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useState } from 'react';
import { debounce } from '@mui/material';
import { GridApi } from 'ag-grid-community';
import { computeTolerance } from '../utils/filter-tolerance-utils';
import { FilterConfig, FilterData, FilterParams } from '../../../../types/custom-aggrid-types';
import { FILTER_DATA_TYPES } from '../custom-aggrid-filter.type';

const removeElementFromArrayWithFieldValue = (filtersArrayToRemoveFieldValueFrom: FilterConfig[], field: string) => {
    return filtersArrayToRemoveFieldValueFrom.filter((f) => f.column !== field);
};

const changeValueFromArrayWithFieldValue = (
    filtersArrayToModify: FilterConfig[],
    field: string,
    newData: FilterConfig
) => {
    const filterIndex = filtersArrayToModify.findIndex((f) => f.column === field);
    if (filterIndex === -1) {
        return [...filtersArrayToModify, newData];
    } else {
        const updatedArray = [...filtersArrayToModify];
        updatedArray[filterIndex] = newData;
        return updatedArray;
    }
};

export const useCustomAggridFilter = (
    api: GridApi,
    colId: string,
    { type, tab, dataType, comparators = [], debounceMs = 1000, updateFilterCallback, filters, setFilters }: FilterParams
) => {
    const [selectedFilterComparator, setSelectedFilterComparator] = useState<string>('');
    const [selectedFilterData, setSelectedFilterData] = useState<unknown>();
    const [tolerance, setTolerance] = useState<number | undefined>();

    // Store-agnostic: if consumer does not provide external filters, maintain a local list
    const [localFilters, setLocalFilters] = useState<FilterConfig[]>([]);
    const currentFilters = filters ?? localFilters;
    const pushFilters = setFilters ?? setLocalFilters;

    const updateFilter = useCallback(
        (colId: string, data: FilterData): void => {
            const newFilter = {
                column: colId,
                dataType: data.dataType,
                tolerance: data.dataType === FILTER_DATA_TYPES.NUMBER ? computeTolerance(data.value) : undefined,
                type: data.type,
                value: data.value,
            };

            let updatedFilters: FilterConfig[];
            if (!data.value) {
                updatedFilters = removeElementFromArrayWithFieldValue(currentFilters, colId);
            } else {
                updatedFilters = changeValueFromArrayWithFieldValue(currentFilters, colId, newFilter);
            }

            updateFilterCallback && updateFilterCallback(api, updatedFilters);
            pushFilters(updatedFilters);
        },
        [updateFilterCallback, api, pushFilters, currentFilters]
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdateFilter = useCallback(
        debounce((data) => updateFilter(colId, data), debounceMs),
        [colId, debounceMs]
    );

    const handleChangeFilterValue = useCallback(
        (filterData: FilterData) => {
            setSelectedFilterData(filterData.value);
            setTolerance(filterData.tolerance);
            debouncedUpdateFilter({
                value: filterData.value,
                type: filterData.type ?? selectedFilterComparator,
                dataType,
                tolerance: filterData.tolerance,
            });
        },
        [dataType, debouncedUpdateFilter, selectedFilterComparator]
    );

    const handleChangeComparator = useCallback(
        (newType: string) => {
            setSelectedFilterComparator(newType);
            if (selectedFilterData) {
                updateFilter(colId, {
                    value: selectedFilterData,
                    type: newType,
                    dataType,
                    tolerance: tolerance,
                });
            }
        },
        [colId, dataType, selectedFilterData, tolerance, updateFilter]
    );

    useEffect(() => {
        if (!selectedFilterComparator) {
            setSelectedFilterComparator(comparators[0]);
        }
    }, [selectedFilterComparator, comparators]);

    useEffect(() => {
        const filterObject = currentFilters?.find((filter) => filter.column === colId);
        if (filterObject) {
            setSelectedFilterData(filterObject.value);
            setSelectedFilterComparator(filterObject.type ?? '');
        } else {
            setSelectedFilterData(undefined);
        }
    }, [currentFilters, colId]);

    return {
        selectedFilterData,
        selectedFilterComparator,
        handleChangeFilterValue,
        handleChangeComparator,
    };
};
