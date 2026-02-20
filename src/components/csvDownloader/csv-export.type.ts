/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ColDef, CsvExportParams } from 'ag-grid-community';
import { GsLangUser } from '../../utils';

export type CsvDownloadProps = {
    columns: ColDef[];
    tableName: string;
    tableNamePrefix?: string;
    skipColumnHeaders?: boolean;
    skipPinnedBottom?: boolean;
    language: GsLangUser;
    getData: (params?: CsvExportParams) => string | undefined | void;
    isCopyCsv?: boolean;
};

export type CsvExportProps = CsvDownloadProps & {
    disabled: boolean;
};
