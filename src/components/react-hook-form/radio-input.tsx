/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    RadioGroupProps,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useController } from 'react-hook-form';
import FieldLabel from './utils/field-label';

type Options = Array<{
    id: string;
    label: string;
}>;

interface RadioInputProps {
    name: string;
    label?: string;
    id?: string;
    options: Options;
    formProps?: Omit<RadioGroupProps, 'value'>;
}

const RadioInput = ({
    name,
    label,
    id,
    options,
    formProps,
}: RadioInputProps) => {
    const {
        field: { onChange, value },
    } = useController({ name });

    return (
        <FormControl>
            {label && (
                <FormLabel id={id ?? label}>
                    <FormattedMessage id={label} />
                </FormLabel>
            )}
            <RadioGroup
                row
                aria-labelledby={id ?? label}
                value={value}
                onChange={onChange}
                {...formProps}
            >
                {options.map((option) => (
                    <FormControlLabel
                        control={<Radio />}
                        value={option.id}
                        key={option.id}
                        label={<FieldLabel label={option.label} />}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default RadioInput;
