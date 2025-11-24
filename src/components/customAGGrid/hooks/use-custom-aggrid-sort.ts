/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useMemo } from 'react';
import { SortConfig, SortWay } from '../../../types/custom-aggrid-types';

export type SortParams = {
    sortConfig?: SortConfig[];
    isChildren?: boolean;
    onChange: (updatedSortConfig: SortConfig[]) => void;
};

export const useCustomAggridSort = (colId: string, sortParams?: SortParams) => {
    const columnSort = useMemo(
        () => sortParams?.sortConfig?.find((value) => value.colId === colId),
        [sortParams?.sortConfig, colId]
    );
    const isColumnSorted = !!columnSort;

    const handleSortChange = useCallback(() => {
        if (!sortParams || !sortParams.sortConfig) {
            return;
        }

        let newSort: SortWay;
        if (!isColumnSorted) {
            newSort = SortWay.ASC;
        } else if (columnSort!.sort === SortWay.DESC) {
            newSort = SortWay.ASC;
        } else {
            newSort = SortWay.DESC;
        }

        const updatedSortConfig = sortParams.sortConfig
            .filter((sort) => (sort.children ?? false) !== (sortParams.isChildren ?? false))
            .concat({ colId, sort: newSort, children: sortParams.isChildren });

        sortParams.onChange(updatedSortConfig);
    }, [sortParams, isColumnSorted, columnSort?.sort, colId]);

    return { columnSort, handleSortChange };
};
