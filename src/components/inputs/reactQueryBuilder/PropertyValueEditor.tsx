/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import { Autocomplete, TextField } from '@mui/material';
import { ValueEditorProps } from 'react-querybuilder';
import { useIntl } from 'react-intl';
import { useValid } from './hooks/useValid';

import { OPERATOR_OPTIONS } from '../../filter/expert/expertFilterConstants';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { usePredefinedProperties } from '../../../hooks/usePredefinedProperties';
import { EquipmentType } from '../../../utils';
import { useCustomFilterOptions } from '../../../hooks/useCustomFilterOptions';

const PROPERTY_VALUE_OPERATORS = [OPERATOR_OPTIONS.IS_IN, OPERATOR_OPTIONS.IS_NOT_IN];

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
            if (field === FieldConstants.PROPERTY_OPERATOR) {
              value = value?.customName;
            }
            let updatedValue = {
                ...valueEditorProps?.value,
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
            <Grid item xs={4}>
                <Autocomplete
                    defaultValue={PROPERTY_VALUE_OPERATORS[0]}
                    size="small"
                    formProps={{ variant: 'filled' }}
                    getOptionLabel={(option) => intl.formatMessage({ id: option.label }) }
                    onChange={(event, value) => {
                        onChange(FieldConstants.PROPERTY_OPERATOR, value);
                    }}
                    options={PROPERTY_VALUE_OPERATORS}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={propertyValues?.length > 0 ? '' : intl.formatMessage({ id: 'operatorList' })}
                        />
                    )}
                    disableClearable
                />
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
