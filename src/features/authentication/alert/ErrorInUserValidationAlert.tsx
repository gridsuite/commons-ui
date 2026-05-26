/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, AlertTitle } from '@mui/material';
import { FormattedMessage } from 'react-intl';

type ErrorInUserValidationAlertProps = {
    userName?: string;
    message: string;
};
export function ErrorInUserValidationAlert({ userName, message }: ErrorInUserValidationAlertProps) {
    return (
        <Alert severity="error">
            <AlertTitle>
                <FormattedMessage id="login/errorInUserValidation" />
            </AlertTitle>
            <FormattedMessage id="login/errorInUserValidationMessage" values={{ userName }} />
            <p>{message}</p>
        </Alert>
    );
}
export default ErrorInUserValidationAlert;
