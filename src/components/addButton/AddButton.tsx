/*
 * Copyright © 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Button, type ButtonProps } from '@mui/material';
import { ControlPoint, Edit } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

export enum AddButtonMode {
    ADD = 'add',
    EDIT = 'edit',
}

export interface AddButtonProps extends ButtonProps {
    label: string;
    mode?: AddButtonMode;
}

export function AddButton({ label, mode = AddButtonMode.ADD, ...buttonProps }: Readonly<AddButtonProps>) {
    return (
        <Button startIcon={mode === AddButtonMode.ADD ? <ControlPoint /> : <Edit />} {...buttonProps}>
            <FormattedMessage id={label} />
        </Button>
    );
}
