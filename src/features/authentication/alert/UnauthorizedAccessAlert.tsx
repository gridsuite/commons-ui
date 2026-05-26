/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, AlertTitle } from '@mui/material';
import { FormattedMessage } from 'react-intl';

type UnauthorizedAccessAlertProps = { userName?: string };
export function UnauthorizedAccessAlert({ userName }: UnauthorizedAccessAlertProps) {
    return (
        <Alert severity="info">
            <AlertTitle>
                <FormattedMessage id="login/unauthorizedAccess" />
            </AlertTitle>
            <FormattedMessage id="login/unauthorizedAccessMessage" values={{ userName }} />
        </Alert>
    );
}
export default UnauthorizedAccessAlert;
