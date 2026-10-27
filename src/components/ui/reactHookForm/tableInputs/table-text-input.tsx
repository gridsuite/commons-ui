/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InputBaseComponentProps, TextField } from '@mui/material';
import { useController } from 'react-hook-form';
import { useMemo } from 'react';
import { genHelperError, getReadOnlySlotProps } from '../utils';
import { useCustomFormContext } from '../provider';

interface TableTextInputProps {
    name: string;
    hideErrorMessage?: boolean;
    inputProps?: InputBaseComponentProps;
    dataTestId?: string;
}

export function TableTextInput({
    name,
    hideErrorMessage,
    inputProps,
    dataTestId,
    ...props
}: Readonly<TableTextInputProps>) {
    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({ name });
    const { isReadOnly } = useCustomFormContext();

    const outputTransform = (str: string) => {
        return str?.trim() === '' ? '' : str;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(outputTransform(e.target.value));
    };
    const readOnlySlotProps = useMemo(() => getReadOnlySlotProps(isReadOnly, value), [isReadOnly, value]);

    return (
        <TextField
            data-testid={dataTestId}
            value={value}
            onChange={handleInputChange}
            error={!!error?.message}
            size="small"
            fullWidth
            inputRef={ref}
            slotProps={{
                input: {
                    disableInjectingGlobalStyles: true, // disable auto-fill animations and increase rendering perf
                    inputProps: {
                        style: {
                            fontSize: 'small',
                        },
                        ...inputProps,
                    },
                    ...readOnlySlotProps.input,
                },
                inputLabel: {
                    ...readOnlySlotProps.inputLabel,
                },
            }}
            {...(hideErrorMessage ? {} : genHelperError(error?.message))}
            {...props}
        />
    );
}
