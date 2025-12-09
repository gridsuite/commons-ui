/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type ChangeEvent, useCallback } from 'react';
import { Switch } from '@design-system-rte/react';
import { useController } from 'react-hook-form';

export interface SwitchInputProps {
    name: string;
    label?: string;
}

export function SwitchInput({ name }: Readonly<SwitchInputProps>) {
    const {
        field: { onChange, value },
    } = useController<Record<string, boolean>>({ name });

    const handleChangeValue = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.checked);
        },
        [onChange]
    );

    return (
        <Switch
            checked={value}
            onChange={handleChangeValue}
        />
    );
}
