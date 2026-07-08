/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Grid2 as Grid, Tooltip, Typography } from '@mui/material';
import { useCSVReader } from 'react-papaparse';
import type { ParseConfig, ParseResult } from 'papaparse';
import { equalsArrayAnyOrder, getCsvDelimiter, hasNonEmptyRows } from '../../../utils';
import { CsvPickerConfirmationDialog } from './csv-picker-confirmation-dialog';

type CsvPickerCallbacks<TData> =
    | {
          onComplete: (results: ParseResult<TData>, file: File) => void;
          onAppend?: never;
          onReplace?: never;
      }
    | {
          onComplete?: never;
          onAppend: (results: ParseResult<TData>, file: File) => void;
          onReplace: (results: ParseResult<TData>, file: File) => void;
      };

export type CsvPickerProps<TData = unknown> = {
    label: string;
    header: string[];
    maxLineNumber?: number;
    disabled?: boolean;
    language: string;
    parseConfig?: Partial<ParseConfig<TData>>;
    selectedFile?: File;
    onFileChange: (file: File | undefined) => void;
    onFileError: (error: string | undefined) => void;
    getTableData?: () => unknown[];
} & CsvPickerCallbacks<TData>;

export function CsvPicker<TData = unknown>({
    label,
    header,
    maxLineNumber,
    disabled = false,
    language,
    parseConfig,
    selectedFile,
    onFileChange,
    onFileError,
    onComplete,
    onAppend,
    onReplace,
    getTableData,
}: CsvPickerProps<TData>) {
    const intl = useIntl();
    const { CSVReader } = useCSVReader();
    const [pendingImport, setPendingImport] = useState<{
        results: ParseResult<TData>;
        file: File;
    } | null>(null);

    const handleUploadAccepted = useCallback(
        (results: ParseResult<TData>, acceptedFile: File) => {
            if (results.data.length === 0) {
                onFileError(intl.formatMessage({ id: 'noDataInCsvFile' }, { filename: acceptedFile.name }));
            } else if (!equalsArrayAnyOrder(header, Object.keys(results.data[0] as Record<string, unknown>))) {
                console.warn('Wrong CSV headers');
                console.warn('Expected:', header);
                console.warn('Actual:', Object.keys(results.data[0] as Record<string, unknown>));
                onFileError(intl.formatMessage({ id: 'wrongCsvHeadersError' }, { filename: acceptedFile.name }));
            } else if (maxLineNumber && results.data.length > maxLineNumber) {
                onFileError(
                    intl.formatMessage(
                        { id: 'tooManyLinesInCsvFile' },
                        { value: maxLineNumber, filename: acceptedFile.name }
                    )
                );
            } else {
                onFileError(undefined);
                if (onAppend && onReplace) {
                    if (hasNonEmptyRows(getTableData?.())) {
                        setPendingImport({ results, file: acceptedFile });
                    } else {
                        onReplace(results, acceptedFile);
                        onFileChange(acceptedFile);
                    }
                } else {
                    onComplete?.(results, acceptedFile);
                    onFileChange(acceptedFile);
                }
            }
        },
        [header, intl, maxLineNumber, onAppend, onComplete, onFileChange, onFileError, onReplace, getTableData]
    );

    return (
        <>
            <CSVReader
                config={{
                    header: true,
                    skipEmptyLines: true,
                    comments: '#',
                    delimiter: getCsvDelimiter(language),
                    ...parseConfig,
                }}
                onUploadAccepted={handleUploadAccepted}
            >
                {({ getRootProps }: any) => (
                    <Grid container spacing={1} alignItems="center" justifyContent="right">
                        <Grid>
                            <Tooltip title={selectedFile?.name}>
                                <Typography noWrap sx={{ fontWeight: 'bold' }}>
                                    {selectedFile ? selectedFile.name : <FormattedMessage id="uploadMessage" />}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid size="auto">
                            <Button
                                {...getRootProps()}
                                variant={selectedFile ? 'contained' : 'text'}
                                disabled={disabled}
                            >
                                <FormattedMessage id={label} />
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </CSVReader>
            {onAppend && onReplace && (
                <CsvPickerConfirmationDialog
                    pendingImport={pendingImport}
                    onReplace={(r, f) => {
                        onReplace(r, f);
                        onFileChange(f);
                    }}
                    onAppend={(r, f) => {
                        onAppend(r, f);
                        onFileChange(f);
                    }}
                    onClose={() => setPendingImport(null)}
                />
            )}
        </>
    );
}
