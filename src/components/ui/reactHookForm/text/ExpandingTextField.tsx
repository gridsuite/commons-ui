/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { type TextFieldProps, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useCustomFormContext } from '../provider/useCustomFormContext';
import { TextInput, TextInputProps } from './TextInput';

export interface ExpandingTextFieldProps extends TextInputProps {
    name: string;
    maxCharactersNumber?: number;
    rows?: number;
    minRows?: number;
    sx?: any;
    label?: string;
    textFieldFormProps?: TextFieldProps;
}

export function ExpandingTextField({
    name,
    maxCharactersNumber = 500,
    rows,
    minRows = 1,
    sx,
    label,
    textFieldFormProps,
    ...otherTexFieldProps
}: ExpandingTextFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const { control } = useCustomFormContext();
    const descriptionWatch = useWatch({ name, control });
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };
    const isOverTheLimit = descriptionWatch?.length > maxCharactersNumber;
    const descriptionLength = descriptionWatch?.length ?? 0;
    const descriptionCounter = `${descriptionLength}/${maxCharactersNumber}`;

    const rowsToDisplay = isFocused ? rows : minRows;

    const formProps: TextInputProps['formProps'] = {
        size: 'medium',
        multiline: true,
        onFocus: handleFocus,
        onBlur: handleBlur,
        InputProps: {
            style: {
                textOverflow: 'ellipsis',
                overflow: 'hidden', // disable scrolling
                whiteSpace: 'pre',
                resize: 'none', // or 'horizontal' for horizontal resizing
            },
            inputProps: { 'data-testid': 'DescriptionInputField' },
        },
        helperText: <Typography variant="caption">{descriptionCounter}</Typography>,
        FormHelperTextProps: {
            sx: {
                ml: 'auto',
                color: (theme) => (isOverTheLimit ? theme.palette.error.main : theme.palette.text.secondary),
            },
        },
        ...(rowsToDisplay && { rows: rowsToDisplay }),
        ...(sx && { sx }),
        ...textFieldFormProps,
    };
    return <TextInput name={name} label={label} formProps={formProps} {...otherTexFieldProps} />;
}
