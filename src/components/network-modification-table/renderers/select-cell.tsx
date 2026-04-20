/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback } from 'react';
import { Checkbox } from '@mui/material';
import { Row, Table } from '@tanstack/react-table';
import { networkModificationTableStyles } from '../network-modification-table-styles';
import { ComposedModificationMetadata } from '../../../utils';

interface SelectCellRendererProps {
    row: Row<ComposedModificationMetadata>;
    table: Table<ComposedModificationMetadata>;
}

function toggleRange(rows: Row<ComposedModificationMetadata>[], from: number, to: number, targetSelected: boolean) {
    const [start, end] = from <= to ? [from, to] : [to, from];
    rows.slice(start, end + 1).forEach((r) => {
        if (r.getCanSelect()) {
            r.toggleSelected(targetSelected);
        }
    });
}

export function SelectCell({ row, table }: Readonly<SelectCellRendererProps>) {
    const { meta } = table.options;

    const isSelected = row.getIsSelected();
    const isIndeterminate = !isSelected && row.getIsSomeSelected();

    const handleChange = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            const rows = table.getRowModel().flatRows;
            const currentIndex = rows.indexOf(row);
            const anchorIndex = meta?.lastClickedIndex.current;
            const targetSelected = !isSelected;

            // When shift is held and a previous click exists, select or deselect the contiguous range between
            // the two clicks instead of toggling a single row.
            if (event.shiftKey && anchorIndex != null) {
                toggleRange(rows, anchorIndex, currentIndex, targetSelected);
            } else {
                row.toggleSelected(targetSelected);
            }

            if (meta) {
                meta.lastClickedIndex.current = currentIndex;
            }
        },
        [table, row, meta, isSelected]
    );

    return (
        <Checkbox
            size="small"
            checked={isSelected}
            indeterminate={isIndeterminate}
            disabled={!row.getCanSelect()}
            onClick={handleChange}
            sx={networkModificationTableStyles.selectCheckBox}
        />
    );
}
