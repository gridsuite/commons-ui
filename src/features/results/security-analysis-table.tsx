/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { SecurityAnalysisTableProps } from './security-analysis.type';
import { CustomAGGrid, DefaultCellRenderer } from '../../components';

export function SecurityAnalysisTable({
    rowData,
    columnDefs,
    overlayNoRowsTemplate,
    agGridProps,
    onGridReady,
}: SecurityAnalysisTableProps) {
    const defaultColDef = useMemo(
        () => ({
            resizable: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            suppressMovable: true,
            flex: 1,
            cellRenderer: DefaultCellRenderer,
            comparator: (): number => 0,
        }),
        []
    );

    return (
        <CustomAGGrid
            rowData={rowData ?? []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onModelUpdated={({ api }) => {
                if (api.getDisplayedRowCount()) {
                    api.hideOverlay();
                } else {
                    api.showNoRowsOverlay();
                }
            }}
            overlayNoRowsTemplate={overlayNoRowsTemplate}
            {...agGridProps}
        />
    );
}
