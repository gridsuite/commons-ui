/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, type ButtonProps, useThemeProps } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export function CancelButton(inProps: Readonly<Omit<ButtonProps, 'children'>>) {
    const props = useThemeProps({ props: inProps, name: 'CancelButton' });
    return (
        <Button data-testid="CancelButton" {...props}>
            <FormattedMessage id="cancel" />
        </Button>
    );
}
