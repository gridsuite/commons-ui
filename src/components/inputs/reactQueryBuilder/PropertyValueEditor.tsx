/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import { Autocomplete, createFilterOptions, FilterOptionsState, MenuItem, Select, TextField } from '@mui/material';
import { ValueEditorProps } from 'react-querybuilder';
import { useIntl } from 'react-intl';
import { useValid } from './hooks/useValid';

import { OPERATOR_OPTIONS } from '../../filter/expert/expertFilterConstants';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { usePredefinedProperties } from '../../../hooks/usePredefinedProperties';
import { EquipmentType } from '../../../utils';
import { useSelectAppearance } from '../../../hooks/useSelectAppearance';

const PROPERTY_VALUE_OPERATORS = [OPERATOR_OPTIONS.IN];

interface ExpertFilterPropertyProps {
    equipmentType: EquipmentType;
    valueEditorProps: ValueEditorProps;
}

export function PropertyValueEditor(props: ExpertFilterPropertyProps) {
    const { equipmentType, valueEditorProps } = props;
    const valid = useValid(valueEditorProps);
    const intl = useIntl();

    const { propertyName, propertyOperator, propertyValues } = valueEditorProps?.value ?? {};

    const [equipmentPredefinedProps, setEquipmentType] = usePredefinedProperties(equipmentType);

    useEffect(() => {
        setEquipmentType(equipmentType);
    }, [equipmentType, setEquipmentType]);

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

    const filterOptions = useCallback((options: string[], params: FilterOptionsState<string>) => {
        const filter = createFilterOptions<string>();
        const filteredOptions = filter(options, params);
        const { inputValue } = params;

        const isExisting = options.some((option) => inputValue === option);
        if (isExisting && options.length === 1 && options[0] === inputValue) {
            // exact match : nothing to show
            return [];
        }

        if (inputValue !== '' && !isExisting) {
            filteredOptions.push(inputValue);
        }
        return filteredOptions;
    }, []);

    return (
        <Grid container spacing={1} item>
            <Grid item xs={5}>
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
                    filterOptions={filterOptions}
                />
            </Grid>
            <Grid item xs="auto">
                <Select
                    value={propertyOperator ?? PROPERTY_VALUE_OPERATORS[0].customName}
                    size="small"
                    title={valueEditorProps?.title}
                    error={!valid}
                    onChange={(event, value) => {
                        onChange(FieldConstants.PROPERTY_OPERATOR, value);
                    }}
                    {...useSelectAppearance(PROPERTY_VALUE_OPERATORS.length)}
                >
                    {PROPERTY_VALUE_OPERATORS.map((operator) => (
                        <MenuItem key={operator.customName} value={operator.customName}>
                            {intl.formatMessage({ id: operator.label })}
                        </MenuItem>
                    ))}
                </Select>
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
                    filterOptions={filterOptions}
                />
            </Grid>
        </Grid>
    );
}
