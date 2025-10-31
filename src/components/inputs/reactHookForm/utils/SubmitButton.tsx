/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, ButtonProps } from '@mui/material';
import { useFormState } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

export function SubmitButton(buttonProps: Readonly<ButtonProps>) {
    const { isDirty, errors } = useFormState();
    const hasErrors = Object.keys(errors ?? {}).length > 0;

    return (
        <Button {...buttonProps} disabled={!isDirty || hasErrors || (buttonProps?.disabled ?? false)}>
            <FormattedMessage id="validate" />
        </Button>
    );
}
