/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, Grid2 as Grid, IconButton, styled } from '@mui/material';
import { ArrowCircleDown, ArrowCircleUp, ControlPoint as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ErrorInput } from '../../ui/reactHookForm/errorManagement/ErrorInput';
import { FieldErrorAlert } from '../../ui/reactHookForm/errorManagement/FieldErrorAlert';
import { CsvDownloadButton } from '../../ui/csvDownloader';
import type { CsvProps } from './agGridTable-utils';

const InnerColoredButton = styled(IconButton)(({ theme }) => {
    return {
        color: theme.palette.primary.main,
    };
});

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
            <Grid container paddingTop={1} paddingLeft={1} alignItems="center" spacing={1}>
                {csvProps?.getTableData && (
                    <Grid>
                        <CsvDownloadButton
                            data={csvProps.getTableData}
                            fileName={csvProps.fileName}
                            language={csvProps.language}
                            labelId="DownloadCSV"
                            disabled={!csvProps.hasTableData}
                            withExportButton
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
