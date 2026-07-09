/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { Clear as ClearIcon } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';

import { Input } from '../../../../utils/types/types';

export type TextFieldWithAdornmentProps = TextFieldProps & {
    // variant already included in TextFieldProps
    value: Input; // we override the default type of TextFieldProps which is unknown
    adornmentPosition?: string;
    adornmentText?: string;
    handleClearValue?: () => void;
};

export function TextFieldWithAdornment(props: TextFieldWithAdornmentProps) {
    const { adornmentPosition, adornmentText, value, variant, handleClearValue, ...otherProps } = props;

    const [isFocused, setIsFocused] = useState(false);

    const getAdornmentStyle = useCallback((innerVariant: 'standard' | 'filled' | 'outlined') => {
        if (innerVariant === 'filled') {
            return {
                alignItems: 'start',
                marginBottom: '0.4em',
            };
        }
        if (innerVariant === 'standard') {
            return {
                marginBottom: '0.3em',
            };
        }
        return undefined;
    }, []);

    const getClearAdornment = useCallback(
        (position: 'start' | 'end') => {
            return (
                <InputAdornment position={position}>
                    <IconButton onClick={handleClearValue} size="small">
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </InputAdornment>
            );
        },
        [handleClearValue]
    );

    const getTextAdornment = useCallback(
        (position: 'start' | 'end') => {
            return (
                <InputAdornment position={position} sx={variant && getAdornmentStyle(variant)}>
                    {adornmentText}
                </InputAdornment>
            );
        },
        [adornmentText, getAdornmentStyle, variant]
    );

    const withEndAdornmentText = useCallback(() => {
        return value !== '' || isFocused
            ? {
                  startAdornment: value && handleClearValue ? getClearAdornment('start') : undefined,
                  endAdornment: getTextAdornment('end'),
                  sx: { textAlign: 'end' },
              }
            : undefined;
    }, [value, handleClearValue, getClearAdornment, isFocused, getTextAdornment]);

    const withStartAdornmentText = useCallback(() => {
        return value !== '' || isFocused
            ? {
                  startAdornment: getTextAdornment('start'),
                  endAdornment: value && handleClearValue && getClearAdornment('end'),
                  sx: { textAlign: 'start' },
              }
            : undefined;
    }, [value, handleClearValue, getClearAdornment, isFocused, getTextAdornment]);

    return (
        <TextField
            {...otherProps} // TODO move at the end like other inputs ?
            variant={variant}
            value={value}
            InputProps={adornmentPosition === 'start' ? withStartAdornmentText() : withEndAdornmentText()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
    );
}
