/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { CreateRuleFormInput } from './regulationRule.types';
import { FieldConstants } from '../../../../../utils';

interface CreateRuleDialogSubmitButtonProps {
    handleSave: (data: CreateRuleFormInput) => void;
    allowNegativeValues: boolean;
}

export function CreateRuleDialogSubmitButton({
    handleSave,
    allowNegativeValues,
}: Readonly<CreateRuleDialogSubmitButtonProps>) {
    const { handleSubmit } = useFormContext<CreateRuleFormInput>();

    const [lowTapPosition, highTapPosition] = useWatch({
        name: [FieldConstants.LOW_TAP_POSITION, FieldConstants.HIGH_TAP_POSITION],
    });

    const isTapValuesInvalid =
        highTapPosition == null ||
        lowTapPosition == null ||
        (!allowNegativeValues && highTapPosition <= 0) ||
        (!allowNegativeValues && lowTapPosition <= 0) ||
        highTapPosition === lowTapPosition;

    return (
        <Button onClick={handleSubmit(handleSave)} variant="outlined" disabled={isTapValuesInvalid}>
            <FormattedMessage id="validate" />
        </Button>
    );
}
