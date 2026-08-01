/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 as Grid, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCSVDownloader } from 'react-papaparse';
import type Papa from 'papaparse';
import { FieldConstants, getCsvDelimiter, GsLang, transformIfFrenchNumber } from '../../../../../utils';
import { CancelButton, CsvPicker, MAX_ROWS_NUMBER } from '../../../../../components';

// Tap-changer rule imports treat every column as optional: no column is required.
const NO_REQUIRED_COLUMNS: string[] = [];

export interface ImportRuleDialogProps {
    tapChanger: FieldConstants.PHASE_TAP_CHANGER | FieldConstants.RATIO_TAP_CHANGER;
    openImportRuleDialog: boolean;
    setOpenImportRuleDialog: (open: boolean) => void;
    csvColumns: string[];
    handleImportTapRule: (results: Papa.ParseResult<Record<string, string>>) => void;
}

export const ImportRuleDialog = ({
    tapChanger,
    openImportRuleDialog,
    setOpenImportRuleDialog,
    csvColumns,
    handleImportTapRule,
}: ImportRuleDialogProps) => {
    const { locale } = useIntl();
    const { CSVDownloader } = useCSVDownloader();

    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [fileErrorMessage, setFileErrorMessage] = useState<string | undefined>();
    const [parsedResults, setParsedResults] = useState<Papa.ParseResult<Record<string, string>> | undefined>();

    const language = locale as GsLang;

    useEffect(() => {
        setSelectedFile(undefined);
        setFileErrorMessage(undefined);
        setParsedResults(undefined);
    }, [openImportRuleDialog]);

    const parseConfig = useMemo<Partial<Papa.ParseConfig<Record<string, string>>>>(
        () => ({ transform: (value: string) => transformIfFrenchNumber(value, language) }),
        [language]
    );

    const handleCloseDialog = () => {
        setOpenImportRuleDialog(false);
    };

    const handleSave = () => {
        if (!fileErrorMessage && parsedResults) {
            handleImportTapRule(parsedResults);
            handleCloseDialog();
        }
    };

    const isInvalid = useMemo(() => {
        return typeof parsedResults === 'undefined' || typeof fileErrorMessage !== 'undefined';
    }, [parsedResults, fileErrorMessage]);

    return (
        <Dialog open={openImportRuleDialog} fullWidth={true}>
            <DialogTitle>
                <FormattedMessage
                    id={
                        tapChanger === FieldConstants.PHASE_TAP_CHANGER ? 'ImportDephasingRule' : 'ImportRegulationRule'
                    }
                />
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Grid>
                        <CSVDownloader
                            data={[csvColumns]}
                            filename={
                                tapChanger === FieldConstants.PHASE_TAP_CHANGER
                                    ? 'tap-dephasing-rule'
                                    : 'tap-regulating-rule'
                            }
                            config={{ delimiter: getCsvDelimiter(language) }}
                        >
                            <Button variant="contained">
                                <FormattedMessage id="GenerateSkeleton" />
                            </Button>
                        </CSVDownloader>
                    </Grid>
                    <Grid>
                        <CsvPicker<Record<string, string>>
                            label={
                                tapChanger === FieldConstants.PHASE_TAP_CHANGER
                                    ? 'ImportDephasingRule'
                                    : 'ImportRegulationRule'
                            }
                            requiredColumns={NO_REQUIRED_COLUMNS}
                            maxLineNumber={MAX_ROWS_NUMBER}
                            language={language}
                            parseConfig={parseConfig}
                            selectedFile={selectedFile}
                            onFileChange={setSelectedFile}
                            onFileError={setFileErrorMessage}
                            onComplete={setParsedResults}
                        />
                    </Grid>
                    {fileErrorMessage && (
                        <Grid>
                            <Alert severity="error">{fileErrorMessage}</Alert>
                        </Grid>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={handleCloseDialog} />
                <Button onClick={handleSave} variant="outlined" disabled={isInvalid}>
                    <FormattedMessage id="validate" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
