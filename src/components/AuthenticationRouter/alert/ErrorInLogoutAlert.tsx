/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, AlertTitle } from '@mui/material';
import { FormattedMessage } from 'react-intl';

type ErrorInLogoutAlertProps = {
    userName?: string;
    message: string;
};
function ErrorInLogoutAlert({ userName, message }: ErrorInLogoutAlertProps) {
    return (
        <Alert severity="error">
            <AlertTitle>
                <FormattedMessage id="login/errorInLogout" />
            </AlertTitle>
            <FormattedMessage
                id="login/errorInLogoutMessage"
                values={{ userName }}
            />
            <p>{message}</p>
        </Alert>
    );
}

export default ErrorInLogoutAlert;
