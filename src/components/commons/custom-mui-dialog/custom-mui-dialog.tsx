/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { FunctionComponent } from 'react';
import { FieldErrors } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
} from '@mui/material';
import SubmitButton from '../../react-hook-form/utils/submit-button';
import CancelButton from '../../react-hook-form/utils/cancel-button';
import CustomFormProvider from '../../react-hook-form/provider/custom-form-provider.tsx';

interface ICustomMuiDialog {
    open: boolean;
    formSchema: any;
    formMethods: any;
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
}

const styles = {
    dialogPaper: {
        '.MuiDialog-paper': {
            width: 'auto',
            minWidth: '800px',
            margin: 'auto',
        },
    },
};

const CustomMuiDialog: FunctionComponent<ICustomMuiDialog> = ({
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
}) => {
    const { handleSubmit } = formMethods;

    const handleCancel = (event: React.MouseEvent) => {
        onCancel && onCancel();
        onClose(event);
    };

    const handleClose = (event: React.MouseEvent, reason?: string) => {
        if (reason === 'backdropClick' && onCancel) {
            onCancel();
        }
        onClose(event);
    };

    const handleValidate = (data: any) => {
        onSave(data);
        onClose(data);
    };

    const handleValidationError = (errors: FieldErrors) => {
        onValidationError && onValidationError(errors);
    };

    return (
        <CustomFormProvider
            validationSchema={formSchema}
            {...formMethods}
            removeOptional={removeOptional}
            language={language}
        >
            <Dialog
                sx={styles.dialogPaper}
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
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    <CancelButton onClick={handleCancel} />
                    <SubmitButton
                        variant="outlined"
                        disabled={disabledSave}
                        onClick={handleSubmit(
                            handleValidate,
                            handleValidationError
                        )}
                    />
                </DialogActions>
            </Dialog>
        </CustomFormProvider>
    );
};

export default CustomMuiDialog;