/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { JSX, useCallback } from 'react';
import { CsvExportProps } from './csv-export.type';
import { useCsvExport } from './use-csv-export';
import { ManagedExportCsvButton } from './managed-export-csv-button';

export function CsvExport({
    columns,
    tableNamePrefix = '',
    tableName,
    disabled,
    skipColumnHeaders = false,
    skipPinnedBottom = false,
    language,
    getData,
    resetKey,
}: CsvExportProps): JSX.Element {
    const csvExport = useCsvExport();

    const exportCsv = useCallback(async () => {
        await csvExport.getData({
            columns,
            tableName,
            tableNamePrefix,
            skipColumnHeaders,
            skipPinnedBottom,
            language,
            getData,
        });
    }, [columns, csvExport, tableName, tableNamePrefix, skipColumnHeaders, skipPinnedBottom, language, getData]);
    return <ManagedExportCsvButton disabled={disabled} exportCsv={exportCsv} resetKey={resetKey} />;
}
