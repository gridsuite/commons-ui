/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { Autocomplete, FormControl, Grid, MenuItem, Select, type SelectChangeEvent, TextField } from '@mui/material';
import { ValueEditorProps } from 'react-querybuilder';
import { useIntl } from 'react-intl';
import { useValid } from './hooks/useValid';
import { OPERATOR_OPTIONS } from '../../filter/expert/expertFilterConstants';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { usePredefinedProperties } from '../../../hooks/usePredefinedProperties';
import { EquipmentType } from '../../../utils';
import { useCustomFilterOptions } from '../../../hooks/useCustomFilterOptions';

const PROPERTY_VALUE_OPERATORS = [OPERATOR_OPTIONS.IN, OPERATOR_OPTIONS.NOT_IN];

interface ExpertFilterPropertyProps {
    equipmentType: EquipmentType;
    valueEditorProps: ValueEditorProps;
}

export function PropertyValueEditor(props: ExpertFilterPropertyProps) {
    const { equipmentType, valueEditorProps } = props;
    const valid = useValid(valueEditorProps);
    const intl = useIntl();

    const { propertyName, propertyOperator, propertyValues } = valueEditorProps?.value ?? {};

    const [equipmentPredefinedProps] = usePredefinedProperties(equipmentType);

    const predefinedNames = useMemo(() => {
        return Object.keys(equipmentPredefinedProps ?? {}).sort();
    }, [equipmentPredefinedProps]);

    const predefinedValues = useMemo(() => {
        const predefinedForName: string[] = equipmentPredefinedProps?.[propertyName];

        if (!predefinedForName) {
            return [];
        }
        return [...new Set(predefinedForName)].sort();
    }, [equipmentPredefinedProps, propertyName]);

    const onChange = useCallback(
        (field: string, value: any) => {
            let updatedValue = {
                ...valueEditorProps?.value,
                [FieldConstants.PROPERTY_OPERATOR]:
                    valueEditorProps?.value?.propertyOperator ?? PROPERTY_VALUE_OPERATORS[0].customName,
                [field]: value,
            };
            // Reset the property values when the property name changes
            if (field === FieldConstants.PROPERTY_NAME) {
                updatedValue = {
                    ...updatedValue,
                    [FieldConstants.PROPERTY_VALUES]: [],
                };
            }
            valueEditorProps?.handleOnChange?.(updatedValue);
        },
        [valueEditorProps]
    );

    return (
        <Grid container spacing={1} item>
            <Grid item xs={4}>
                <Autocomplete
                    value={propertyName ?? ''}
                    options={predefinedNames}
                    freeSolo
                    autoSelect
                    forcePopupIcon
                    renderInput={(params) => <TextField {...params} error={!valid} />}
                    onChange={(event, value) => {
                        onChange(FieldConstants.PROPERTY_NAME, value);
                    }}
                    size="small"
                    filterOptions={useCustomFilterOptions()}
                />
            </Grid>
            <Grid item xs="auto">
                <FormControl variant="standard" sx={{ mt: 1, minWidth: 160 }}>
                    <Select
                        value={propertyOperator ?? PROPERTY_VALUE_OPERATORS[0].customName}
                        size="small"
                        title={valueEditorProps?.title}
                        error={!valid}
                        onChange={(event: SelectChangeEvent) => {
                            onChange(FieldConstants.PROPERTY_OPERATOR, event.target.value);
                        }}
                    >
                        {PROPERTY_VALUE_OPERATORS.map((operator) => (
                            <MenuItem key={operator.customName} value={operator.customName}>
                                {intl.formatMessage({ id: operator.label })}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs>
                <Autocomplete
                    value={propertyValues ?? []}
                    options={predefinedValues ?? []}
                    title={valueEditorProps?.title}
                    multiple
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={!valid}
                            placeholder={propertyValues?.length > 0 ? '' : intl.formatMessage({ id: 'valuesList' })}
                        />
                    )}
                    freeSolo
                    autoSelect
                    onChange={(event, value) => {
                        onChange(FieldConstants.PROPERTY_VALUES, value);
                    }}
                    size="small"
                    filterOptions={useCustomFilterOptions()}
                />
            </Grid>
        </Grid>
    );
}
