/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, Button, Grid, IconButton, styled } from '@mui/material';
import { ArrowCircleDown, ArrowCircleUp, ControlPoint as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useCSVDownloader } from 'react-papaparse';
import { ErrorInput } from '../../ui/reactHookForm/errorManagement/ErrorInput';
import { FieldErrorAlert } from '../../ui/reactHookForm/errorManagement/FieldErrorAlert';
import { getCsvDelimiter } from '../../../utils';
import type { CsvProps } from './agGridTable-utils';

const InnerColoredButton = styled(IconButton)(({ theme }) => {
    return {
        color: theme.palette.primary.main,
    };
});

interface CsvDownloadButtonProps {
    data: () => unknown[];
    fileName: string;
    delimiter: string;
    labelId: string;
    disabled?: boolean;
}

// Renders a button that downloads a CSV. When disabled, the CSVDownloader wrapper is dropped
// (a disabled MUI Button still lets the wrapper catch the click and trigger the download).
function CsvDownloadButton({ data, fileName, delimiter, labelId, disabled }: CsvDownloadButtonProps) {
    const { CSVDownloader } = useCSVDownloader();

    if (disabled) {
        return (
            <Button variant="outlined" disabled>
                <FormattedMessage id={labelId} />
            </Button>
        );
    }

    return (
        <CSVDownloader data={data} filename={fileName} config={{ delimiter }}>
            <Button variant="outlined">
                <FormattedMessage id={labelId} />
            </Button>
        </CSVDownloader>
    );
}

export interface BottomTableButtonsProps {
    name: string;
    disableUp: boolean;
    disableDown: boolean;
    disableDelete: boolean;
    handleAddRow: () => void;
    handleDeleteRows: () => void;
    handleMoveRowUp: () => void;
    handleMoveRowDown: () => void;
    csvProps?: CsvProps;
}

export function BottomTableButtons({
    name,
    disableUp,
    disableDown,
    disableDelete,
    handleAddRow,
    handleDeleteRows,
    handleMoveRowUp,
    handleMoveRowDown,
    csvProps,
}: BottomTableButtonsProps) {
    return (
        <>
            <Grid container paddingTop={1} alignItems="center" spacing={1}>
                {csvProps?.getTemplateData && (
                    <Grid>
                        <CsvDownloadButton
                            data={csvProps.getTemplateData}
                            fileName={csvProps.fileName}
                            delimiter={getCsvDelimiter(csvProps.language)}
                            labelId="GenerateCSV"
                        />
                    </Grid>
                )}
                {csvProps?.getTableData && (
                    <Grid>
                        <CsvDownloadButton
                            data={csvProps.getTableData}
                            fileName={csvProps.fileName}
                            delimiter={getCsvDelimiter(csvProps.language)}
                            labelId="DownloadCSV"
                            disabled={!csvProps.hasTableData}
                        />
                    </Grid>
                )}
                {csvProps?.extraButtons && <Grid>{csvProps.extraButtons}</Grid>}
                <Grid sx={{ marginLeft: 'auto' }}>
                    <InnerColoredButton onClick={handleAddRow} aria-label="Add row">
                        <AddIcon />
                    </InnerColoredButton>
                    <InnerColoredButton
                        onClick={handleDeleteRows}
                        disabled={disableDelete}
                        aria-label="Delete selected rows"
                    >
                        <DeleteIcon />
                    </InnerColoredButton>
                    <InnerColoredButton
                        disabled={disableUp}
                        onClick={handleMoveRowUp}
                        aria-label="Move selected rows up"
                    >
                        <ArrowCircleUp />
                    </InnerColoredButton>
                    <InnerColoredButton
                        disabled={disableDown}
                        onClick={handleMoveRowDown}
                        aria-label="Move selected rows down"
                    >
                        <ArrowCircleDown />
                    </InnerColoredButton>
                </Grid>
            </Grid>
            <Box>
                <ErrorInput name={name} InputField={FieldErrorAlert} />
            </Box>
        </>
    );
}
