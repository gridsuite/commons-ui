/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@mui/material';
import { useCSVReader } from 'react-papaparse';
import type { ParseConfig, ParseResult } from 'papaparse';
import { equalsArrayAnyOrder, LANG_FRENCH } from '../../../utils';
import { CsvPickerConfirmationDialog } from './csv-picker-confirmation-dialog';

export interface CsvPickerProps<TData = unknown> {
    label: string;
    header: string[];
    maxLineNumber?: number;
    disabled?: boolean;
    language: string;
    parseConfig?: Partial<ParseConfig<TData>>;
    selectedFile?: File;
    onFileChange: (file: File | undefined) => void;
    onFileError: (error: string | undefined) => void;
    onComplete?: (results: ParseResult<TData>, file: File) => void;
    onAppend?: (results: ParseResult<TData>, file: File) => void;
    onReplace?: (results: ParseResult<TData>, file: File) => void;
    hasExistingData?: () => boolean;
}

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
    hasExistingData,
}: CsvPickerProps<TData>) {
    const intl = useIntl();
    const { CSVReader } = useCSVReader();
    const [pendingImport, setPendingImport] = useState<{
        results: ParseResult<TData>;
        file: File;
    } | null>(null);

    const handleUploadAccepted = useCallback(
        (results: ParseResult<TData>, acceptedFile: File) => {
            onFileChange(acceptedFile);
            if (results.data.length === 0) {
                onFileError(intl.formatMessage({ id: 'noDataInCsvFile' }));
            } else if (!equalsArrayAnyOrder(header, Object.keys(results.data[0] as Record<string, unknown>))) {
                console.warn('Wrong CSV headers');
                console.warn('Expected:', header);
                console.warn('Actual:', Object.keys(results.data[0] as Record<string, unknown>));
                onFileError(intl.formatMessage({ id: 'wrongCsvHeadersError' }));
            } else if (maxLineNumber && results.data.length > maxLineNumber) {
                onFileError(intl.formatMessage({ id: 'tooManyLinesInCsvFile' }, { value: maxLineNumber }));
            } else {
                onFileError(undefined);
                if (onAppend && onReplace) {
                    if (hasExistingData?.()) {
                        setPendingImport({ results, file: acceptedFile });
                    } else {
                        onReplace(results, acceptedFile);
                    }
                } else {
                    onComplete?.(results, acceptedFile);
                }
            }
        },
        [header, intl, maxLineNumber, onAppend, onComplete, onFileChange, onFileError, onReplace, hasExistingData]
    );

    return (
        <>
            <CSVReader
                config={{
                    header: true,
                    skipEmptyLines: true,
                    comments: '#',
                    delimiter: language === LANG_FRENCH ? ';' : ',',
                    ...parseConfig,
                }}
                onUploadAccepted={handleUploadAccepted}
            >
                {({ getRootProps, ProgressBar }: any) => (
                    <>
                        <span
                            style={{
                                marginRight: '10px',
                                fontWeight: 'bold',
                            }}
                        >
                            {selectedFile ? selectedFile.name : intl.formatMessage({ id: 'uploadMessage' })}
                        </span>
                        <Button {...getRootProps()} variant="outlined" disabled={disabled}>
                            <FormattedMessage id={label} />
                            <ProgressBar
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </Button>
                    </>
                )}
            </CSVReader>
            {onAppend && onReplace && (
                <CsvPickerConfirmationDialog
                    pendingImport={pendingImport}
                    onReplace={onReplace}
                    onAppend={onAppend}
                    onClose={() => setPendingImport(null)}
                />
            )}
        </>
    );
}
