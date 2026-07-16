/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, type ButtonProps } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export function CloseButton(buttonProps: Readonly<Omit<ButtonProps, 'children'>>) {
    return (
        <Button data-testid="CloseButton" {...buttonProps}>
            <FormattedMessage id="close" />
        </Button>
    );
}
