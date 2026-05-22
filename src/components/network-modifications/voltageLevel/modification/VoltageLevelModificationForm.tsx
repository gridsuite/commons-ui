/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, TextField } from '@mui/material';
import { useWatch } from 'react-hook-form';
import GridSection from '../../../grid/grid-section';
import { TextInput } from '../../../inputs';
import { AutocompleteInput } from '../../../inputs/reactHookForm/autocompleteInputs/AutocompleteInput';
import { FloatInput } from '../../../inputs/reactHookForm/numbers/FloatInput';
import { FieldConstants, KiloAmpereAdornment, VoltageAdornment } from '../../../../utils';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import { filledTextField } from '../../common';
import { VoltageLevelDto } from './voltageLevelModification.types';

export interface VoltageLevelModificationFormProps {
    voltageLevelToModify?: VoltageLevelDto | null;
}

export function VoltageLevelModificationForm({ voltageLevelToModify }: Readonly<VoltageLevelModificationFormProps>) {
    const equipmentId = useWatch({ name: FieldConstants.EQUIPMENT_ID });
    const watchHideSubstationField = useWatch({ name: FieldConstants.HIDE_SUBSTATION_FIELD, defaultValue: true });

    return (
        <Grid container direction="column" spacing={2}>
            <Grid item>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            size="small"
                            fullWidth
                            label="ID"
                            value={equipmentId ?? ''}
                            InputProps={{
                                readOnly: true,
                            }}
                            disabled
                            {...filledTextField}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextInput
                            name={FieldConstants.EQUIPMENT_NAME}
                            label="Name"
                            formProps={filledTextField}
                            clearable
                            previousValue={voltageLevelToModify?.name ?? undefined}
                        />
                    </Grid>
                    {!watchHideSubstationField && (
                        <Grid item xs={4}>
                            <AutocompleteInput
                                allowNewValue
                                forcePopupIcon
                                name={FieldConstants.SUBSTATION_ID}
                                label="SUBSTATION"
                                // Because of a mui/material bug, the disabled attribute does not work properly.
                                // It should be fixed after v5.12.2. For the moment, instead of fetching the
                                // substation list to display in this AutocompleteInput, we only show the current substation.
                                options={[voltageLevelToModify?.substationId ?? '']}
                                inputTransform={(value) => (value === null ? '' : value)}
                                outputTransform={(value) => value}
                                size="small"
                                formProps={filledTextField}
                                disabled // TODO: to be removed when it is possible to change the substation of a voltage level in the backend (Powsybl)
                            />
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Grid item>
                <GridSection title="VoltageText" />
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FloatInput
                            name={FieldConstants.NOMINAL_V}
                            label="NominalVoltage"
                            adornment={VoltageAdornment}
                            clearable
                            previousValue={voltageLevelToModify?.nominalV}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FloatInput
                            name={FieldConstants.LOW_VOLTAGE_LIMIT}
                            label="LowVoltageLimit"
                            adornment={VoltageAdornment}
                            clearable
                            previousValue={voltageLevelToModify?.lowVoltageLimit ?? undefined}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FloatInput
                            name={FieldConstants.HIGH_VOLTAGE_LIMIT}
                            label="HighVoltageLimit"
                            adornment={VoltageAdornment}
                            clearable
                            previousValue={voltageLevelToModify?.highVoltageLimit ?? undefined}
                        />
                    </Grid>
                </Grid>
                <GridSection title="ShortCircuit" />
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FloatInput
                            name={FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT}
                            label="LowShortCircuitCurrentLimit"
                            adornment={KiloAmpereAdornment}
                            clearable
                            previousValue={voltageLevelToModify?.identifiableShortCircuit?.ipMin ?? undefined}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FloatInput
                            name={FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT}
                            label="HighShortCircuitCurrentLimit"
                            adornment={KiloAmpereAdornment}
                            clearable
                            previousValue={voltageLevelToModify?.identifiableShortCircuit?.ipMax ?? undefined}
                        />
                    </Grid>
                </Grid>
                <PropertiesForm networkElementType="voltageLevel" isModification />
            </Grid>
        </Grid>
    );
}
