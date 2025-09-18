/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useMemo } from 'react';
import { type ObjectSchema } from 'yup';
import { FormControl, Grid, InputLabel } from '@mui/material';
import { FloatInput } from './FloatInput';
import yup from '../../../../utils/yupConfig';
import { MuiSelectInput } from '../selectInputs/MuiSelectInput';
import { FieldConstants } from '../../../../utils/constants/fieldConstants';
import type { MuiStyles } from '../../../../utils/styles';

const style = {
    inputLegend: (theme) => ({
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))',
        backgroundColor: theme.palette.background.paper,
        padding: '0 8px 0 8px',
    }),
} as const satisfies MuiStyles;

export const RangeType = {
    EQUALITY: { id: 'EQUALITY', label: 'equality' },
    GREATER_THAN: { id: 'GREATER_THAN', label: 'greaterThan' },
    GREATER_OR_EQUAL: { id: 'GREATER_OR_EQUAL', label: 'greaterOrEqual' },
    LESS_THAN: { id: 'LESS_THAN', label: 'lessThan' },
    LESS_OR_EQUAL: { id: 'LESS_OR_EQUAL', label: 'lessOrEqual' },
    RANGE: { id: 'RANGE', label: 'range' },
} as const;

export type RangeInputData = {
    [FieldConstants.OPERATION_TYPE]: string;
    [FieldConstants.VALUE_1]: number | null;
    [FieldConstants.VALUE_2]: number | null;
};

export const DEFAULT_RANGE_VALUE: RangeInputData = {
    [FieldConstants.OPERATION_TYPE]: RangeType.EQUALITY.id,
    [FieldConstants.VALUE_1]: null,
    [FieldConstants.VALUE_2]: null,
};

export function getRangeInputSchema<TName extends string>(name: TName) {
    const result = yup.object().shape(
        {
            [FieldConstants.OPERATION_TYPE]: yup.string(),
            [FieldConstants.VALUE_1]: yup.number().when([FieldConstants.OPERATION_TYPE, FieldConstants.VALUE_2], {
                is: (operationType: string, value2: unknown) => operationType === RangeType.RANGE.id && value2 !== null,
                then: (schema) => schema.required(),
                otherwise: (schema) => schema.nullable(),
            }),
            [FieldConstants.VALUE_2]: yup.number().when([FieldConstants.OPERATION_TYPE, FieldConstants.VALUE_1], {
                is: (operationType: string, value1: unknown) => operationType === RangeType.RANGE.id && value1 !== null,
                then: (schema) => schema.required(),
                otherwise: (schema) => schema.nullable(),
            }),
        },
        [[FieldConstants.VALUE_1, FieldConstants.VALUE_2]]
    );
    return { [name]: result } as Record<TName, ObjectSchema<RangeInputData>>;
}

interface RangeInputProps {
    name: string;
    label: string;
}

export function RangeInput({ name, label }: RangeInputProps) {
    const watchOperationType = useWatch({ name: `${name}.${FieldConstants.OPERATION_TYPE}` });

    const isOperationTypeRange = useMemo(() => watchOperationType === RangeType.RANGE.id, [watchOperationType]);

    return (
        <FormControl fullWidth>
            <InputLabel sx={style.inputLegend} shrink>
                <FormattedMessage id={label} />
            </InputLabel>
            <Grid container spacing={0}>
                <Grid item style={isOperationTypeRange ? { flex: 'min-content' } : {}}>
                    <MuiSelectInput
                        name={`${name}.${FieldConstants.OPERATION_TYPE}`}
                        options={Object.values(RangeType)}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <FloatInput
                        label=""
                        name={`${name}.${FieldConstants.VALUE_1}`}
                        clearable={false}
                        formProps={{
                            size: 'medium',
                            placeholder: isOperationTypeRange ? 'Min' : '',
                        }}
                    />
                </Grid>
                {isOperationTypeRange && (
                    <Grid item>
                        <FloatInput
                            name={`${name}.${FieldConstants.VALUE_2}`}
                            clearable={false}
                            label=""
                            formProps={{
                                size: 'medium',
                                placeholder: 'Max',
                            }}
                        />
                    </Grid>
                )}
            </Grid>
        </FormControl>
    );
}
