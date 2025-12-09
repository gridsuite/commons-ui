/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Modal } from '@design-system-rte/react';
import { CancelButton } from '../../inputs/reactHookForm/utils/CancelButton';
import { ValidateButton } from '../../inputs';
import { useIntl } from 'react-intl';

export interface PopupConfirmationDialogProps {
    descriptionMessage?: string;
    descriptionKey?: string;
    validateButtonLabel?: string;
    openConfirmationPopup: boolean;
    setOpenConfirmationPopup: (value: boolean) => void;
    handlePopupConfirmation: () => void;
}

export function PopupConfirmationDialog({
    descriptionMessage,
    descriptionKey,
    validateButtonLabel,
    openConfirmationPopup,
    setOpenConfirmationPopup,
    handlePopupConfirmation,
}: Readonly<PopupConfirmationDialogProps>) {
    const intl = useIntl();
    return (
        <Modal
            size="xs"
            id="dialog-title-change-equipment-type"
            title="Confirmation"
            isOpen={openConfirmationPopup}
            aria-labelledby="dialog-title-change-equipment-type"
            primaryButton={<ValidateButton label={validateButtonLabel} onClick={handlePopupConfirmation} />}
            secondaryButton={<CancelButton onClick={() => setOpenConfirmationPopup(false)} />}
            description={descriptionMessage ?? intl.formatMessage({id: descriptionKey})}
            onClose={() => setOpenConfirmationPopup(false)}
        />
    );
}
