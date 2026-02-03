/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Grid } from '@mui/material';
import { useCSVReader } from 'react-papaparse';
import { LANG_FRENCH } from '../utils';

interface UseCSVPickerProps {
    label: string;
    header: string[];
    resetTrigger: boolean;
    maxTapNumber?: number;
    disabled?: boolean;
    language: string;
}

export const useCSVPicker = ({
    label,
    header,
    resetTrigger,
    maxTapNumber,
    disabled = false,
    language,
}: UseCSVPickerProps) => {
    const intl = useIntl();

    const { CSVReader } = useCSVReader();
    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [fileError, setFileError] = useState<string | undefined>();

    const equals = (a: string[], b: string[]) => b.every((item) => a.includes(item));

    useEffect(() => {
        setSelectedFile(undefined);
        setFileError(undefined);
    }, [resetTrigger]);

    // Expose a reset function to allow clearing the file manually
    const resetFile = useCallback(() => {
        setSelectedFile(undefined);
        setFileError(undefined);
    }, []);

    const field = useMemo(() => {
        return (
            <CSVReader
                config={{
                    delimiter: language === LANG_FRENCH ? ';' : ',',
                }}
                onUploadAccepted={(results: { data: string[][] }, acceptedFile: File) => {
                    setSelectedFile(acceptedFile);
                    if (results?.data.length > 0 && equals(header, results.data[0])) {
                        setFileError(undefined);
                    } else {
                        setFileError(
                            intl.formatMessage({
                                id: 'InvalidRuleHeader',
                            })
                        );
                    }

                    if (maxTapNumber && results.data.length > maxTapNumber) {
                        setFileError(intl.formatMessage({ id: 'TapPositionValueError' }, { value: maxTapNumber }));
                    }
                }}
            >
                {({ getRootProps }: { getRootProps: () => any }) => (
                    <Grid item>
                        <Button {...getRootProps()} variant="contained" disabled={disabled}>
                            <FormattedMessage id={label} />
                        </Button>
                        <span
                            style={{
                                marginLeft: '10px',
                                fontWeight: 'bold',
                            }}
                        >
                            {selectedFile
                                ? selectedFile.name
                                : intl.formatMessage({
                                      id: 'uploadMessage',
                                  })}
                        </span>
                    </Grid>
                )}
            </CSVReader>
        );
    }, [selectedFile, disabled, header, intl, label, maxTapNumber, CSVReader, language]);

    return [selectedFile, field, fileError, setSelectedFile, resetFile] as const;
};
