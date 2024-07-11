/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import CancelButton from '../inputs/react-hook-form/utils/cancel-button';

export interface PopupConfirmationDialogProps {
    message: string;
    validateButtonLabel: string;
    openConfirmationPopup: boolean;
    setOpenConfirmationPopup: (value: boolean) => void;
    handlePopupConfirmation: () => void;
}

function PopupConfirmationDialog({
    message,
    validateButtonLabel,
    openConfirmationPopup,
    setOpenConfirmationPopup,
    handlePopupConfirmation,
}: PopupConfirmationDialogProps) {
    return (
        <Dialog
            open={openConfirmationPopup}
            aria-labelledby="dialog-title-change-equipment-type"
        >
            <DialogTitle id="dialog-title-change-equipment-type">
                Confirmation
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <FormattedMessage id={message} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={() => setOpenConfirmationPopup(false)} />
                <Button onClick={handlePopupConfirmation} variant="outlined">
                    <FormattedMessage id={validateButtonLabel ?? 'validate'} />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PopupConfirmationDialog;
