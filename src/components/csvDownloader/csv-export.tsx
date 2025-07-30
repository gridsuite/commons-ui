/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { CsvExportProps } from './csv-export.type';
import { useCsvExport } from './use-csv-export';
import { ExportCsvButton } from './export-csv-button';

export function CsvExport({
    columns,
    tableNamePrefix = '',
    tableName,
    disabled,
    skipColumnHeaders = false,
    language,
    exportDataAsCsv,
}: CsvExportProps): JSX.Element {
    const { downloadCSVData } = useCsvExport();
    const download = useCallback(() => {
        downloadCSVData({ columns, tableName, tableNamePrefix, skipColumnHeaders, language, exportDataAsCsv });
    }, [downloadCSVData, columns, tableName, tableNamePrefix, skipColumnHeaders, language, exportDataAsCsv]);

    return <ExportCsvButton disabled={disabled} onClick={download} />;
}
