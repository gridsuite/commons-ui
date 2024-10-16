/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useState } from 'react';
import { FieldErrors, UseFormReturn } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress } from '@mui/material';
import * as yup from 'yup';
import { SubmitButton } from '../../inputs/reactHookForm/utils/SubmitButton';
import { CancelButton } from '../../inputs/reactHookForm/utils/CancelButton';
import { CustomFormProvider, MergedFormContextProps } from '../../inputs/reactHookForm/provider/CustomFormProvider';
import { PopupConfirmationDialog } from '../popupConfirmationDialog/PopupConfirmationDialog';

export interface CustomMuiDialogProps {
    open: boolean;
    formSchema: yup.AnySchema;
    formMethods: UseFormReturn<any> | MergedFormContextProps;
    onClose: (event: React.MouseEvent) => void;
    onSave: (data: any) => void;
    onValidationError?: (errors: FieldErrors) => void;
    titleId: string;
    disabledSave?: boolean;
    removeOptional?: boolean;
    onCancel?: () => void;
    children: React.ReactNode;
    isDataFetching?: boolean;
    language?: string;
    confirmationMessageKey?: string;
    unscrollableFullHeight?: boolean;
}

const styles = {
    dialogPaper: {
        '.MuiDialog-paper': {
            width: 'auto',
            minWidth: '1100px',
            margin: 'auto',
        },
    },
    dialogPaperFullHeight: {
        '.MuiDialog-paper': {
            width: 'auto',
            minWidth: '1000px',
            margin: 'auto',
            height: '95vh',
            overflowY: 'hidden',
        },
    },
    unscrollable: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'hidden',
    },
};

export function CustomMuiDialog({
    open,
    formSchema,
    formMethods,
    onClose,
    onSave,
    isDataFetching = false,
    onValidationError,
    titleId,
    disabledSave,
    removeOptional = false,
    onCancel,
    children,
    language,
    confirmationMessageKey,
    unscrollableFullHeight = false,
}: Readonly<CustomMuiDialogProps>) {
    const [openConfirmationPopup, setOpenConfirmationPopup] = useState(false);
    const [validatedData, setValidatedData] = useState(undefined);
    const { handleSubmit } = formMethods;

    const handleCancel = useCallback(
        (event: React.MouseEvent) => {
            onCancel?.();
            onClose(event);
        },
        [onCancel, onClose]
    );

    const handleClose = (event: React.MouseEvent, reason?: string) => {
        if (reason === 'backdropClick') {
            return;
        }
        onClose(event);
    };

    const validate = useCallback(
        (data: any) => {
            onSave(data);
            onClose(data);
        },
        [onClose, onSave]
    );

    const handleValidate = useCallback(
        (data: any) => {
            if (confirmationMessageKey) {
                setValidatedData(data);
                setOpenConfirmationPopup(true);
            } else {
                validate(data);
            }
        },
        [confirmationMessageKey, validate]
    );

    const handlePopupConfirmation = useCallback(() => {
        setOpenConfirmationPopup(false);
        validate(validatedData);
    }, [validate, validatedData]);

    const handleValidationError = (errors: FieldErrors) => {
        onValidationError?.(errors);
    };

    return (
        <CustomFormProvider
            {...formMethods}
            validationSchema={formSchema}
            removeOptional={removeOptional}
            language={language}
        >
            <Dialog
                sx={unscrollableFullHeight ? styles.dialogPaperFullHeight : styles.dialogPaper}
                open={open}
                onClose={handleClose}
                fullWidth
            >
                {isDataFetching && <LinearProgress />}
                <DialogTitle>
                    <Grid item xs={11}>
                        <FormattedMessage id={titleId} />
                    </Grid>
                </DialogTitle>
                <DialogContent sx={unscrollableFullHeight ? styles.unscrollable : null}>{children}</DialogContent>
                <DialogActions>
                    <CancelButton onClick={handleCancel} />
                    <SubmitButton
                        variant="outlined"
                        disabled={disabledSave}
                        onClick={handleSubmit(handleValidate, handleValidationError)}
                    />
                </DialogActions>
            </Dialog>
            {confirmationMessageKey && (
                <PopupConfirmationDialog
                    message={confirmationMessageKey}
                    openConfirmationPopup={openConfirmationPopup}
                    setOpenConfirmationPopup={setOpenConfirmationPopup}
                    handlePopupConfirmation={handlePopupConfirmation}
                />
            )}
        </CustomFormProvider>
    );
}
