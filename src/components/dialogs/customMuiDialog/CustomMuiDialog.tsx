/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type MouseEvent, type ReactNode, useCallback, useState } from 'react';
import { FieldErrors, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress } from '@mui/material';
import type { ObjectSchema } from 'yup';
import { SubmitButton } from '../../inputs/reactHookForm/utils/SubmitButton';
import { CancelButton } from '../../inputs/reactHookForm/utils/CancelButton';
import { CustomFormProvider } from '../../inputs/reactHookForm/provider/CustomFormProvider';
import { PopupConfirmationDialog } from '../popupConfirmationDialog/PopupConfirmationDialog';

export interface CustomMuiDialogProps<T extends FieldValues = FieldValues> {
    open: boolean;
    formSchema: ObjectSchema<T>;
    formMethods: UseFormReturn<T>;
    onClose: (event?: MouseEvent) => void;
    onSave: SubmitHandler<T>;
    onValidationError?: (errors: FieldErrors) => void;
    titleId: string;
    disabledSave?: boolean;
    removeOptional?: boolean;
    onCancel?: () => void;
    children: ReactNode;
    isDataFetching?: boolean;
    language?: string;
    confirmationMessageKey?: string;
    unscrollableFullHeight?: boolean;
}

const styles = {
    dialogPaper: {
        '.MuiDialog-paper': {
            width: 'auto',
            minWidth: '60vw',
            margin: 'auto',
        },
    },
};

/**
 * all those styles are made to work with each other in order to control the scroll behavior:
 * <fullHeightDialog>
 *   <unscrollableContainer>
 *     <unscrollableHeader/> => there may be several unscrollableHeader one after another
 *     <scrollableContent/>
 *   </unscrollableContainer>
 * </fullHeightDialog>
 */
export const unscrollableDialogStyles = {
    fullHeightDialog: {
        '.MuiDialog-paper': {
            minWidth: '90vw',
            margin: 'auto',
            height: '95vh',
        },
    },
    unscrollableContainer: {
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
    },
    unscrollableHeader: {
        flex: 'none',
        padding: 1,
    },
    scrollableContent: {
        flex: 'auto',
        overflowY: 'auto',
        padding: 1,
    },
};

export function CustomMuiDialog<T extends FieldValues = FieldValues>({
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
}: Readonly<CustomMuiDialogProps<T>>) {
    const [openConfirmationPopup, setOpenConfirmationPopup] = useState(false);
    const [validatedData, setValidatedData] = useState<T>();
    const { handleSubmit } = formMethods;

    const handleCancel = useCallback(
        (event: MouseEvent) => {
            onCancel?.();
            onClose(event);
        },
        [onCancel, onClose]
    );

    const handleClose = (event: MouseEvent, reason?: string) => {
        if (reason === 'backdropClick') {
            return;
        }
        onClose(event);
    };

    const validate = useCallback(
        (data: T) => {
            onSave(data);
            onClose();
        },
        [onClose, onSave]
    );

    const handleValidate = useCallback(
        (data: T) => {
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
        if (validatedData) {
            validate(validatedData);
        }
    }, [validate, validatedData]);

    const handleValidationError = useCallback(
        (errors: FieldErrors) => {
            onValidationError?.(errors);
        },
        [onValidationError]
    );

    return (
        <CustomFormProvider<T>
            {...formMethods}
            validationSchema={formSchema}
            removeOptional={removeOptional}
            language={language}
        >
            <Dialog
                sx={unscrollableFullHeight ? unscrollableDialogStyles.fullHeightDialog : styles.dialogPaper}
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
                <DialogContent sx={unscrollableFullHeight ? unscrollableDialogStyles.unscrollableContainer : null}>
                    {children}
                </DialogContent>
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
