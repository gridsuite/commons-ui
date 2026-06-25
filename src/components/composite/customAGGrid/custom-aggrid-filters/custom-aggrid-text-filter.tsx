/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useMemo } from 'react';
import { Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { FilterDataTypes, mergeSx, MuiStyles } from '../../../../utils';
import { DisplayRounding } from '../display-rounding';

const styles = {
    input: {
        minWidth: '250px',
        maxWidth: '40%',
    },
    noArrows: {
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            display: 'none',
        },
        '& input[type=number]': {
            MozAppearance: 'textfield',
        },
    },
} as const satisfies MuiStyles;

interface CustomAggridTextFilterProps {
    value: unknown;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    isNumberInput: boolean;
    decimalAfterDot: number;
}

export function CustomAggridTextFilter({
    value,
    onChange,
    onClear,
    isNumberInput,
    decimalAfterDot = 0,
}: CustomAggridTextFilterProps) {
    const intl = useIntl();

    const isRoundingDisplayed = useMemo(() => !!(isNumberInput && value), [isNumberInput, value]);

    return (
        <Grid container direction="column" gap={0.2}>
            <Grid item>
                <TextField
                    size="small"
                    fullWidth
                    value={value || ''}
                    onChange={onChange}
                    placeholder={intl.formatMessage({
                        id: 'filter.filterOoo',
                    })}
                    inputProps={{
                        type: isNumberInput ? FilterDataTypes.NUMBER : FilterDataTypes.TEXT,
                    }}
                    sx={mergeSx(styles.input, isNumberInput ? styles.noArrows : undefined)}
                    /* eslint-disable-next-line react/jsx-no-duplicate-props */
                    InputProps={{
                        endAdornment: value ? (
                            <InputAdornment position="end">
                                <IconButton aria-label="clear filter" onClick={onClear} edge="end" size="small">
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                />
            </Grid>
            {isRoundingDisplayed && (
                <Grid item>
                    <DisplayRounding decimalAfterDot={decimalAfterDot} />
                </Grid>
            )}
        </Grid>
    );
}
