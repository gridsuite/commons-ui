/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from '@mui/material';
import { FilterDataTypes, FilterTextComparators } from '../../../../../utils';
import { FilterConfig, FilterData, FilterParams } from '../../custom-aggrid-types';
import { useCustomAggridFilterContext } from '../../context/custom-aggrid-context';
import { computeTolerance } from '../utils/filter-tolerance-utils';

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
    }
    const updatedArray = [...filtersArrayToModify];
    updatedArray[filterIndex] = newData;
    return updatedArray;
};

export const useCustomAggridColumnFilter = (colId: string, filterParams: FilterParams) => {
    const { type, tab, dataType, comparators = [], debounceMs = 1000 } = filterParams;

    const [selectedFilterComparator, setSelectedFilterComparator] = useState<string>('');
    const [selectedFilterData, setSelectedFilterData] = useState<unknown>();
    const [tolerance, setTolerance] = useState<number | undefined>();

    // Track if user is currently editing to prevent external sync from overriding input
    const isEditingRef = useRef(false);

    const { getFilters, updateFilter: contextUpdateFilter } = useCustomAggridFilterContext();
    const filters = getFilters({ type, tab });

    const updateFilter = useCallback(
        (data: FilterData): void => {
            const newFilter: FilterConfig = {
                column: colId,
                dataType: data.dataType,
                tolerance:
                    data.dataType === FilterDataTypes.NUMBER &&
                    data.type !== FilterTextComparators.IS_EMPTY &&
                    data.type !== FilterTextComparators.IS_NOT_EMPTY
                        ? computeTolerance(data.value)
                        : undefined,
                type: data.type,
                value: data.value,
            };

            let updatedFilters: FilterConfig[];
            const filterWithoutValue =
                data.type === FilterTextComparators.IS_EMPTY || data.type === FilterTextComparators.IS_NOT_EMPTY;
            if (!data.value && !filterWithoutValue) {
                updatedFilters = removeElementFromArrayWithFieldValue(filters, colId);
            } else {
                updatedFilters = changeValueFromArrayWithFieldValue(filters, colId, newFilter);
            }

            const colFilter = updatedFilters.find((f) => f.column === colId);
            contextUpdateFilter(colId, filterParams, updatedFilters, colFilter);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [colId, filters, contextUpdateFilter]
    );

    // We intentionally exclude `updateFilter` from dependencies.
    // `updateFilter` depends on `filters`, which changes on every filter update.
    // Including it would recreate the debounced function on each change,
    // canceling any pending debounced call and preventing updates from being sent.
    // PS: it only works because most of the props never change...
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdateFilter = useCallback(
        debounce((data) => {
            updateFilter(data);
            isEditingRef.current = false;
        }, debounceMs),
        [debounceMs]
    );

    const handleChangeFilterValue = useCallback(
        (filterData: FilterData) => {
            isEditingRef.current = true;
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
            isEditingRef.current = true;
            setSelectedFilterComparator(newType);
            const filterWithoutValue =
                newType === FilterTextComparators.IS_EMPTY || newType === FilterTextComparators.IS_NOT_EMPTY;
            if (filterWithoutValue) {
                debouncedUpdateFilter({ value: true, type: newType, dataType, tolerance });
            } else if (selectedFilterData && selectedFilterData !== true) {
                debouncedUpdateFilter({ value: selectedFilterData, type: newType, dataType, tolerance });
            } else {
                // We switch from IS_EMPTY or IS_NOT_EMPTY comparator to a comparator with a value
                setSelectedFilterData(undefined);
                debouncedUpdateFilter({ value: undefined, type: newType, dataType, tolerance });
            }
        },
        [dataType, selectedFilterData, tolerance, debouncedUpdateFilter]
    );

    useEffect(() => {
        if (!selectedFilterComparator && comparators.length > 0) {
            setSelectedFilterComparator(comparators[0]);
        }
    }, [selectedFilterComparator, comparators]);

    // Sync from external filter changes
    // Only sync when NOT actively editing to prevent race conditions
    useEffect(() => {
        // Skip sync if user is currently editing
        if (isEditingRef.current) {
            return;
        }
        const filterObject = filters?.find((filter) => filter.column === colId);
        if (filterObject) {
            setSelectedFilterData(filterObject.value);
            setSelectedFilterComparator(filterObject.type ?? '');
        } else {
            setSelectedFilterData(undefined);
        }
    }, [filters, colId]);

    return {
        selectedFilterData,
        selectedFilterComparator,
        handleChangeFilterValue,
        handleChangeComparator,
    };
};
