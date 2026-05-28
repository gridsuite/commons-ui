/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, createFilterOptions, Grid2 as Grid, GridDirection, Popper, PopperProps } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { AutocompleteInput } from '../../../../components/ui';
import { EquipmentType, FieldConstants, Identifiable, Option } from '../../../../utils';

// Factory used to create a filter method that is used to change the default
// option filter behaviour of the Autocomplete component
const filter = createFilterOptions<Option>();

// Specific Popper component to be used with Autocomplete: it makes the popper fit its content
// rather than inheriting the input field's width.
function FittingPopper({ style: _ignoredStyle, ...otherProps }: Readonly<PopperProps>) {
    return <Popper {...otherProps} placement="bottom-start" />;
}

export interface RegulatingTerminalFormProps {
    /** Parent path within the react-hook-form tree (e.g. 'setpointsLimits' or '') */
    id: string;
    direction?: GridDirection;
    disabled?: boolean;
    voltageLevelOptions: Identifiable[];
    equipmentSectionTypeDefaultValue?: string;
    regulatingTerminalVlId?: string;
    equipmentSectionType?: string;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function RegulatingTerminalForm({
    id,
    direction,
    disabled = false,
    voltageLevelOptions = [],
    equipmentSectionTypeDefaultValue,
    regulatingTerminalVlId,
    equipmentSectionType,
    fetchVoltageLevelEquipments,
}: Readonly<RegulatingTerminalFormProps>) {
    const [equipmentsOptions, setEquipmentsOptions] = useState<Option[]>([]);
    const { setValue } = useFormContext();

    const watchVoltageLevelId = useWatch({
        name: `${id}.${FieldConstants.VOLTAGE_LEVEL}.${FieldConstants.ID}`,
    });

    const vlOptions = useMemo<Option[]>(
        () =>
            voltageLevelOptions.map((item) => ({
                id: item.id,
                label: item.name ?? '',
            })),
        [voltageLevelOptions]
    );

    const isColumnDirection = direction === 'column' || direction === 'column-reverse';
    const itemSize = isColumnDirection ? 12 : 6;

    useEffect(() => {
        if (!watchVoltageLevelId || !voltageLevelOptions.some((vlOption) => vlOption.id === watchVoltageLevelId)) {
            setEquipmentsOptions([]);
        } else {
            fetchVoltageLevelEquipments(watchVoltageLevelId).then((equipments) => {
                setEquipmentsOptions(
                    equipments.map((equipment) => ({
                        id: equipment.id,
                        label: equipment.type,
                        type: equipment.type,
                    }))
                );
            });
        }
    }, [watchVoltageLevelId, voltageLevelOptions, fetchVoltageLevelEquipments]);

    const resetEquipment = useCallback(() => {
        setValue(`${id}.${FieldConstants.EQUIPMENT}`, null);
    }, [id, setValue]);

    return (
        <Grid container direction={direction ?? 'row'} spacing={1}>
            <Grid size={itemSize} sx={{ align: 'start' }}>
                <AutocompleteInput
                    name={`${id}.${FieldConstants.VOLTAGE_LEVEL}`}
                    label="VOLTAGE_LEVEL"
                    size="small"
                    // particular outputTransform case for string type when a user clicks outside after editing whatever input
                    outputTransform={(value) => (typeof value === 'string' ? { id: value, label: value } : value)}
                    forcePopupIcon
                    autoHighlight
                    selectOnFocus
                    disabled={disabled}
                    id="voltage-level"
                    options={vlOptions}
                    getOptionLabel={(vl) => (typeof vl === 'string' ? '' : (vl?.id ?? ''))}
                    onChangeCallback={resetEquipment}
                    previousValue={regulatingTerminalVlId ?? undefined}
                    /* When a value is directly entered in the text field, a new option is created in the
                       options list with a value equal to the input value */
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        if (
                            params.inputValue !== '' &&
                            !options.some((opt) => typeof opt !== 'string' && opt.id === params.inputValue)
                        ) {
                            filtered.push({
                                id: params.inputValue,
                                label: params.inputValue,
                            });
                        }
                        return filtered;
                    }}
                    slots={{
                        popper: FittingPopper,
                    }}
                    allowNewValue
                />
            </Grid>
            <Grid size={itemSize} sx={{ align: 'start' }}>
                <AutocompleteInput
                    name={`${id}.${FieldConstants.EQUIPMENT}`}
                    // setting null programmatically when allowNewValue is enabled (i.e. freeSolo) does not
                    // empty the field => need to convert null to empty and vice versa
                    inputTransform={(value) => value ?? ''}
                    outputTransform={(value) => {
                        if (typeof value === 'string') {
                            return value === ''
                                ? null
                                : { id: value, label: value, type: equipmentSectionTypeDefaultValue };
                        }
                        return value;
                    }}
                    label="Equipment"
                    size="small"
                    forcePopupIcon
                    autoHighlight
                    selectOnFocus
                    id="equipment"
                    disabled={!watchVoltageLevelId || disabled}
                    previousValue={equipmentSectionType}
                    options={equipmentsOptions}
                    getOptionLabel={(equipment) => (typeof equipment === 'string' ? '' : (equipment?.id ?? ''))}
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        let displayText = '';
                        if (typeof option !== 'string') {
                            displayText = option.label ? `${option.label} : ${option.id}` : (option.id ?? '');
                        }
                        return (
                            <Box key={key} component="li" {...optionProps}>
                                {displayText}
                            </Box>
                        );
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        if (
                            params.inputValue !== '' &&
                            !options.some((opt) => typeof opt !== 'string' && opt?.id === params.inputValue)
                        ) {
                            filtered.push({
                                label: equipmentSectionTypeDefaultValue ?? '',
                                id: params.inputValue,
                            });
                        }
                        return filtered;
                    }}
                    allowNewValue
                    slots={{
                        popper: FittingPopper,
                    }}
                />
            </Grid>
        </Grid>
    );
}
