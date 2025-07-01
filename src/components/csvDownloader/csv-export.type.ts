/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RefObject } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, CsvExportParams } from 'ag-grid-community';
import { GsLang } from '../../utils';

export type CsvDownloadProps = {
    gridRef: RefObject<AgGridReact>;
    columns: ColDef[];
    tableName: string;
    tableNamePrefix?: string;
    skipColumnHeaders?: boolean;
    language: GsLang;
    exportDataAsCsv: (params?: CsvExportParams) => void;
};

export type CsvExportProps = CsvDownloadProps & {
    disabled: boolean;
};
