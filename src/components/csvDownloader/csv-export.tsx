/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { CsvExportProps } from './csv-export.type';
import { useCsvExport } from './use-csv-export';
import { ExportCsvButton } from './export-csv-button';

export function CsvExport({
    studyUuid,
    nodeUuid,
    rootNetworkUuid,
    columns,
    tableNamePrefix = '',
    tableName,
    disabled,
    skipColumnHeaders = false,
    language,
    exportDataAsCsv,
}: CsvExportProps): JSX.Element {
    const { downloadCSVData } = useCsvExport();
    const [isCsvExportLoading, setIsCsvExportLoading] = useState(false);
    const [isCsvExportSuccessful, setIsCsvExportSuccessful] = useState(false);

    useEffect(() => {
        setIsCsvExportSuccessful(false);
    }, [studyUuid, nodeUuid, rootNetworkUuid]);

    useEffect(() => {
        if (disabled) {
            // reinit the success state when the button is disabled,
            // for example when the calcul status change or results change
            setIsCsvExportSuccessful(false);
        }
    }, [disabled]);

    const download = useCallback(() => {
        setIsCsvExportLoading(true);
        downloadCSVData({ columns, tableName, tableNamePrefix, skipColumnHeaders, language, exportDataAsCsv });
        setIsCsvExportLoading(false);
        setIsCsvExportSuccessful(true);
    }, [downloadCSVData, columns, tableName, tableNamePrefix, skipColumnHeaders, language, exportDataAsCsv]);

    return (
        <ExportCsvButton
            disabled={disabled}
            onClick={download}
            isDownloadLoading={isCsvExportLoading}
            isDownloadSuccessful={isCsvExportSuccessful}
        />
    );
}
