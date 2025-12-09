/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type MouseEvent, type ReactNode, useCallback, useState } from 'react';
import { FieldErrors, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { DialogActions, DialogContent, DialogProps, DialogTitle, LinearProgress } from '@mui/material';
import { type ObjectSchema } from 'yup';
import { CancelButton } from '../../inputs/reactHookForm/utils/CancelButton';
import { CustomFormProvider } from '../../inputs/reactHookForm/provider/CustomFormProvider';
import { PopupConfirmationDialog } from '../popupConfirmationDialog/PopupConfirmationDialog';
import { GsLang } from '../../../utils';
import type { MuiStyles } from '../../../utils/styles';
import { ValidateButton } from '../../inputs';
import { Modal } from '@design-system-rte/react';

export type CustomMuiDialogProps<T extends FieldValues = FieldValues> = DialogProps & {
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
    language?: GsLang;
    confirmationMessageKey?: string;
    unscrollableFullHeight?: boolean;
};

const styles = {
    dialogPaper: {
        '.MuiDialog-paper': {
            width: 'auto',
            minWidth: '60vw',
            margin: 'auto',
        },
    },
} as const satisfies MuiStyles;

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
} as const satisfies MuiStyles;

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
    ...dialogProps
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
    const intl = useIntl();

    return (
        <CustomFormProvider<T>
            {...formMethods}
            validationSchema={formSchema}
            removeOptional={removeOptional}
            language={language}
        >
            <Modal
                id="DialogTitle"
                data-testid="DialogTitle"
                title={intl.formatMessage({ id: titleId })}
                isOpen={open}
                onClose={onClose}
                primaryButton={
                    <ValidateButton
                        disabled={!formMethods.formState.isDirty || disabledSave}
                        onClick={handleSubmit(handleValidate, handleValidationError)}
                    />
                }
                secondaryButton={<CancelButton onClick={handleCancel} />}
                size="l"
                closeOnOverlayClick={false}
            >
                {children}
            </Modal>
            {confirmationMessageKey && (
                <PopupConfirmationDialog
                    descriptionKey={confirmationMessageKey}
                    openConfirmationPopup={openConfirmationPopup}
                    setOpenConfirmationPopup={setOpenConfirmationPopup}
                    handlePopupConfirmation={handlePopupConfirmation}
                />
            )}
        </CustomFormProvider>
    );
}
