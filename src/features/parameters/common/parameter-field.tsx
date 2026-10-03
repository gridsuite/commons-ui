/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Chip, Grid, SxProps, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { CustomTooltip } from '../../../components/ui/tooltip/CustomTooltip';
import { parametersStyles } from '../parameters-style';
import { ParameterDifference, ParameterType, ParameterValue } from '../../../utils/types/parameters.type';
import {
    AutocompleteInput,
    CountriesInput,
    FloatInput,
    IntegerInput,
    MuiSelectInput,
    MultipleAutocompleteInput,
    SwitchInput,
    TextInput,
} from '../../../components/ui';
import { mergeSx } from '../../../utils';

interface ParameterFieldProps {
    id: string;
    name: string;
    type: string;
    label?: string;
    inputLabel?: string;
    description?: string;
    possibleValues?: { id: string; label: string }[] | string[];
    parameterDifference?: ParameterDifference;
    sx?: SxProps;
}

function formatDefaultValue(value: ParameterValue): string {
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    return value.toString();
}

export function ParameterField({
    id,
    name,
    type,
    label,
    inputLabel,
    description,
    possibleValues,
    parameterDifference,
    sx,
}: Readonly<ParameterFieldProps>) {
    const renderField = () => {
        switch (type) {
            case ParameterType.STRING:
                return possibleValues ? (
                    <MuiSelectInput
                        name={`${id}.${name}`}
                        options={possibleValues}
                        size="small"
                        data-testid={`${id}.${name}`}
                        sx={mergeSx(sx, { overflow: 'hidden' })}
                    />
                ) : (
                    <TextInput name={`${id}.${name}`} dataTestId={`${id}.${name}`} />
                );
            case ParameterType.BOOLEAN:
                return <SwitchInput name={`${id}.${name}`} data-testid={`${id}.${name}`} />;
            case ParameterType.COUNTRIES:
                return (
                    <CountriesInput
                        name={`${id}.${name}`}
                        label={inputLabel ?? 'descLfCountries'}
                        dataTestId={`${id}.${name}`}
                    />
                );
            case ParameterType.DOUBLE:
                return <FloatInput name={`${id}.${name}`} dataTestId={`${id}.${name}`} />;
            case ParameterType.STRING_LIST:
                return possibleValues ? (
                    <AutocompleteInput
                        data-testid={`${id}.${name}`}
                        name={`${id}.${name}`}
                        label={inputLabel}
                        options={possibleValues}
                        fullWidth
                        multiple
                        size="small"
                        renderValue={(val: any, getItemProps) =>
                            val.map((code: string, index: number) => (
                                <Chip
                                    data-testid={`${id}.${name}.${code}`}
                                    key={code}
                                    size="small"
                                    label={code}
                                    {...getItemProps({ index })}
                                />
                            ))
                        }
                    />
                ) : (
                    <MultipleAutocompleteInput name={`${id}.${name}`} size="small" data-testid={`${id}.${name}`} />
                );
            case ParameterType.INTEGER:
                return <IntegerInput name={`${id}.${name}`} dataTestId={`${id}.${name}`} />;
            default:
                return null;
        }
    };

    const LABEL_GRID_SIZE = type !== ParameterType.COUNTRIES ? 8 : 3;
    const INPUT_GRID_SIZE = 12 - LABEL_GRID_SIZE;

    return (
        <Grid
            container
            spacing={1}
            key={name}
            sx={{
                paddingTop: 1,
                justifyContent: 'space-between',
                width: '100%',
            }}
        >
            <Grid size={LABEL_GRID_SIZE}>
                <Typography
                    component="div"
                    sx={{
                        ...parametersStyles.parameterName,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <CustomTooltip title={description} key={name}>
                        <span>{label ? <FormattedMessage id={label} /> : name}</span>
                    </CustomTooltip>
                    {parameterDifference && (
                        <CustomTooltip
                            title={
                                <FormattedMessage
                                    id="defaultValue"
                                    values={{
                                        value: formatDefaultValue(parameterDifference.defaultValue),
                                    }}
                                />
                            }
                        >
                            <Info
                                fontSize="small"
                                color="info"
                                sx={{
                                    ml: 0.5,
                                }}
                                data-testid={`${id}.${name}.default-value-info`}
                            />
                        </CustomTooltip>
                    )}
                </Typography>
            </Grid>
            <Grid container size={INPUT_GRID_SIZE} sx={parametersStyles.controlItem}>
                {renderField()}
            </Grid>
        </Grid>
    );
}
