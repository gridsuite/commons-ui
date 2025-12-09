/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Checkbox } from '@design-system-rte/react';
import { type ChangeEvent, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { useIntl } from 'react-intl';

export interface CheckboxInputProps {
    name: string;
    label?: string;
    disabled?: boolean
}

export function CheckboxInput({ name, label, disabled = false }: Readonly<CheckboxInputProps>) {
    const {
        field: { onChange, value },
    } = useController<Record<string, boolean>>({ name });

    const intl = useIntl();

    const handleChangeValue = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.checked);
        },
        [onChange]
    );

    return (
        <Checkbox
            id={name}
            label={intl.formatMessage({ id: label ?? ''})}
            checked={value}
            onChange={handleChangeValue}
            disabled={disabled}
            showLabel
        />
    );
}
