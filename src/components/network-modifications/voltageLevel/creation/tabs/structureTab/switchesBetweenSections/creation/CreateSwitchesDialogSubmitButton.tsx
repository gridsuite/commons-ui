/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button } from '@mui/material';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { CreateSwitchesFormData } from '../../../../voltageLevelCreation.types';

interface CreateSwitchesDialogSubmitButtonProps {
    handleSave: (data: CreateSwitchesFormData) => void | Promise<void>;
}

export function CreateSwitchesDialogSubmitButton({ handleSave }: Readonly<CreateSwitchesDialogSubmitButtonProps>) {
    const { handleSubmit } = useFormContext();

    return (
        <Button onClick={handleSubmit(handleSave as SubmitHandler<FieldValues>)} variant="outlined">
            <FormattedMessage id="validate" />
        </Button>
    );
}
