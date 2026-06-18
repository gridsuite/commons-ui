/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback } from 'react';
import { GridApi } from 'ag-grid-community';
import { snackWithFallback } from '../../../utils';
import { useSnackMessage } from '../../../hooks';
import { SortParams, SortWay } from './custom-aggrid-types';
import { useCustomAggridSortContext } from './custom-aggrid-context';

export const useCustomAggridSort = (colId: string, sortParams?: SortParams, api?: GridApi) => {
    const { getSortConfig, setSortConfig } = useCustomAggridSortContext();
    const { snackError } = useSnackMessage();

    const sortConfig = getSortConfig(sortParams);
    const columnSort = sortConfig?.find((value) => value.colId === colId);
    const isColumnSorted = !!columnSort;

    const handleSortChange = useCallback(() => {
        if (!sortParams || !sortConfig) {
            return;
        }

        let newSort;
        if (!isColumnSorted) {
            newSort = SortWay.ASC;
        } else if (columnSort.sort === SortWay.DESC) {
            newSort = SortWay.ASC;
        } else {
            newSort = SortWay.DESC;
        }

        const updatedSortConfig = sortConfig
            .filter((sort) => (sort.children ?? false) !== (sortParams.isChildren ?? false))
            .concat({ colId, sort: newSort, children: sortParams.isChildren });

        if (sortParams && sortParams.persistSort && updatedSortConfig?.[0] && api) {
            sortParams.persistSort(api, updatedSortConfig[0]).catch((error) => snackWithFallback(snackError, error));
        }
        setSortConfig(sortParams, updatedSortConfig, api);
    }, [sortParams, sortConfig, isColumnSorted, columnSort?.sort, colId, api, setSortConfig, snackError]);

    return { columnSort, handleSortChange };
};
