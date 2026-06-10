/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { ReactNode } from 'react';
import { FieldConstants } from '../../../utils';

export interface CsvProps {
    fileName: string;
    language?: string;
    getTemplateData?: () => unknown[];
    getTableData?: () => unknown[];
    extraButtons?: ReactNode;
    hasTableData?: boolean;
}

/**
 * Returns true when the given form rows contain at least one cell with a
 * non-empty value (excluding the AG_GRID_ROW_UUID identifier column).
 */
export const hasNonEmptyRows = (rows: unknown): boolean =>
    Array.isArray(rows) &&
    rows.some(
        (row: any) =>
            row &&
            Object.keys(row)
                .filter((key) => key !== FieldConstants.AG_GRID_ROW_UUID)
                .some((key) => row[key] !== undefined && row[key] !== null && String(row[key]).trim().length > 0)
    );
