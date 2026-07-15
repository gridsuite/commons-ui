/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Chip, Grid, SxProps, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { CustomTooltip } from '../../../components/ui/tooltip/CustomTooltip';
import { parametersStyles } from '../parameters-style';
import { ParameterType } from '../../../utils/types/parameters.type';
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
import { LineSeparator } from './index';

interface ParameterFieldProps {
    id: string;
    name: string;
    type: string;
    label?: string;
    description?: string;
    possibleValues?: { id: string; label: string }[] | string[];
    sx?: SxProps;
}

function ParameterField({ id, name, type, label, description, possibleValues, sx }: Readonly<ParameterFieldProps>) {
    const renderField = () => {
        switch (type) {
            case ParameterType.STRING:
                return possibleValues ? (
                    <MuiSelectInput
                        name={`${id}.${name}`}
                        options={possibleValues}
                        size="small"
                        data-testid={`${id}.${name}`}
                        sx={sx}
                    />
                ) : (
                    <TextInput name={`${id}.${name}`} dataTestId={`${id}.${name}`} />
                );
            case ParameterType.BOOLEAN:
                return <SwitchInput name={`${id}.${name}`} data-testid={`${id}.${name}`} />;
            case ParameterType.COUNTRIES:
                return <CountriesInput name={`${id}.${name}`} label="descLfCountries" dataTestId={`${id}.${name}`} />;
            case ParameterType.DOUBLE:
                return <FloatInput name={`${id}.${name}`} dataTestId={`${id}.${name}`} />;
            case ParameterType.STRING_LIST:
                return possibleValues ? (
                    <AutocompleteInput
                        data-testid={`${id}.${name}`}
                        name={`${id}.${name}`}
                        label={label}
                        options={possibleValues}
                        fullWidth
                        multiple
                        size="small"
                        renderTags={(val: any[], getTagsProps: any) =>
                            val.map((code: string, index: number) => (
                                <Chip
                                    data-testid={`${id}.${name}.${code}`}
                                    key={code}
                                    size="small"
                                    label={code}
                                    {...getTagsProps({ index })}
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

    return (
        <Grid container spacing={1} paddingTop={1} key={name} justifyContent="space-between" sx={{ width: '100%' }}>
            <Grid size={8}>
                <CustomTooltip title={description} key={name}>
                    <Typography sx={parametersStyles.parameterName}>
                        {label ? <FormattedMessage id={label} /> : name}
                    </Typography>
                </CustomTooltip>
            </Grid>
            <Grid container size={4} sx={parametersStyles.controlItem}>
                {renderField()}
            </Grid>
            <LineSeparator />
        </Grid>
    );
}

export default ParameterField;
