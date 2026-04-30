/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { DndColumn } from './dnd-table.type';

export function getDefaultRowData(columnsDefinition: DndColumn[]) {
    const newRowData: Record<string, any> = {};
    columnsDefinition.forEach((columnDefinition) => {
        newRowData[columnDefinition.dataKey] = columnDefinition.initialValue ?? null;
    });
    return newRowData;
}
