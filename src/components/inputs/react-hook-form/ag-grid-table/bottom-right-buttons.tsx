/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { ArrowCircleDown, ArrowCircleUp, Upload } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import { FieldValues, UseFieldArrayReturn } from 'react-hook-form';
import ErrorInput from '../error-management/error-input';
import FieldErrorAlert from '../error-management/field-error-alert';
import CsvUploader from './csv-uploader/csv-uploader';

const InnerColoredButton = styled(IconButton)(({ theme }) => {
    return {
        color: theme.palette.primary.main,
    };
});

export interface BottomRightButtonsProps {
    name: string;
    disableUp: boolean;
    disableDown: boolean;
    disableDelete: boolean;
    handleAddRow: () => void;
    handleDeleteRows: () => void;
    handleMoveRowUp: () => void;
    handleMoveRowDown: () => void;
    useFieldArrayOutput: UseFieldArrayReturn<FieldValues, string, 'id'>;
    csvProps: any;
}

function BottomRightButtons({
    name,
    disableUp,
    disableDown,
    disableDelete,
    handleAddRow,
    handleDeleteRows,
    handleMoveRowUp,
    handleMoveRowDown,
    useFieldArrayOutput,
    csvProps,
}: BottomRightButtonsProps) {
    const [uploaderOpen, setUploaderOpen] = useState(false);
    const intl = useIntl();

    return (
        <>
            <Grid container paddingTop={1} paddingLeft={2}>
                <Grid item xs={1}>
                    {csvProps && (
                        <InnerColoredButton
                            onClick={() => setUploaderOpen(true)}
                        >
                            <Tooltip
                                title={intl.formatMessage({
                                    id: 'ImportCSV',
                                })}
                                placement="bottom"
                            >
                                <Upload />
                            </Tooltip>
                        </InnerColoredButton>
                    )}
                </Grid>
                <Grid
                    item
                    xs={11}
                    sx={{ display: 'flex', justifyContent: 'right' }}
                >
                    <InnerColoredButton key="addButton" onClick={handleAddRow}>
                        <AddIcon />
                    </InnerColoredButton>
                    <InnerColoredButton
                        key="DeleteButton"
                        onClick={handleDeleteRows}
                        disabled={disableDelete}
                    >
                        <DeleteIcon />
                    </InnerColoredButton>
                    <InnerColoredButton
                        key="upButton"
                        disabled={disableUp}
                        onClick={handleMoveRowUp}
                    >
                        <ArrowCircleUp />
                    </InnerColoredButton>
                    <InnerColoredButton
                        key="downButton"
                        disabled={disableDown}
                        onClick={handleMoveRowDown}
                    >
                        <ArrowCircleDown />
                    </InnerColoredButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <ErrorInput name={name} InputField={FieldErrorAlert} />
            </Grid>
            <CsvUploader
                open={uploaderOpen}
                onClose={() => setUploaderOpen(false)}
                name={name}
                useFieldArrayOutput={useFieldArrayOutput}
                {...csvProps}
            />
        </>
    );
}

export default BottomRightButtons;
