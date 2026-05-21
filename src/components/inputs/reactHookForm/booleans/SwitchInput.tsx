/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Switch, SwitchProps } from '@mui/material';
import { BooleanInput } from './BooleanInput';

export interface SwitchInputProps extends SwitchProps {
    name: string;
    label?: string;
}

export function SwitchInput({ name, label, ...props }: Readonly<SwitchInputProps>) {
    return <BooleanInput name={name} label={label} Input={Switch} {...props} />;
}
