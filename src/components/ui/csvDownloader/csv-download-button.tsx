/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, type ButtonProps } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useCSVDownloader } from 'react-papaparse';
import { getCsvDelimiter } from '../../../utils';
import { ExportCsvButton } from './export-csv-button';

export interface CsvDownloadButtonProps {
    labelId: string;
    data: () => unknown[];
    fileName: string;
    language?: string;
    // When true, render the shared ExportCsvButton (icon) instead of a plain text Button.
    withExportButton?: boolean;
    disabled?: boolean;
    variant?: ButtonProps['variant'];
}

// Renders a button that downloads a CSV built from `data`. When disabled, the CSVDownloader wrapper
// is dropped (a disabled button still lets the wrapper catch the click and trigger the download).
export function CsvDownloadButton({
    labelId,
    data,
    fileName,
    language,
    withExportButton = false,
    disabled,
    variant = 'outlined',
}: Readonly<CsvDownloadButtonProps>) {
    const { CSVDownloader } = useCSVDownloader();

    const button = withExportButton ? (
        <ExportCsvButton labelId={labelId} disabled={disabled} />
    ) : (
        <Button variant={variant} disabled={disabled}>
            <FormattedMessage id={labelId} />
        </Button>
    );

    if (disabled) {
        return button;
    }

    return (
        <CSVDownloader data={data} filename={fileName} config={{ delimiter: getCsvDelimiter(language) }}>
            {button}
        </CSVDownloader>
    );
}
