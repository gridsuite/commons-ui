/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import GridItem from '../../../grid/grid-item';
import GridSection from '../../../grid/grid-section';
import { TextInput } from '../../../inputs';
import { AutocompleteInput } from '../../../inputs/reactHookForm/autocompleteInputs/AutocompleteInput';
import { FloatInput } from '../../../inputs/reactHookForm/numbers/FloatInput';
import { IntegerInput } from '../../../inputs/reactHookForm/numbers/IntegerInput';
import { FieldConstants, KiloAmpereAdornment, VoltageAdornment } from '../../../../utils';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import { filledTextField } from '../../common';
import { SwitchesBetweenSections } from './switches-between-sections';
import { CouplingOmnibusForm } from './coupling-omnibus';
import { SubstationCreationSection } from './SubstationCreationSection';

export interface VoltageLevelCreationFormProps {
    substationOptions?: string[];
    substationFieldAdditionalProps?: Record<string, unknown>;
}

export function VoltageLevelCreationForm({
    substationOptions,
    substationFieldAdditionalProps,
}: VoltageLevelCreationFormProps = {}) {
    const { setValue } = useFormContext();
    const watchAddSubstationCreation = useWatch({ name: FieldConstants.ADD_SUBSTATION_CREATION });
    const watchHideNominalVoltage = useWatch({ name: FieldConstants.HIDE_NOMINAL_VOLTAGE });
    const watchHideBusBarSection = useWatch({ name: FieldConstants.HIDE_BUS_BAR_SECTION });
    const watchBusBarCount = useWatch({ name: FieldConstants.BUS_BAR_COUNT });
    const watchSectionCount = useWatch({ name: FieldConstants.SECTION_COUNT });

    const displayOmnibus = watchBusBarCount > 1 || watchSectionCount > 1;
    const showDeleteSubstationButton = !(watchHideNominalVoltage && watchHideBusBarSection);

    const handleDeleteSubstationCreation = useCallback(() => {
        setValue(FieldConstants.ADD_SUBSTATION_CREATION, false);
        setValue(FieldConstants.SUBSTATION_CREATION_ID, null);
        setValue(FieldConstants.SUBSTATION_NAME, null);
        setValue(FieldConstants.COUNTRY, null);
    }, [setValue]);

    const substationField = substationOptions ? (
        <AutocompleteInput
            openOnFocus
            forcePopupIcon
            name={FieldConstants.SUBSTATION_ID}
            label="SUBSTATION"
            options={substationOptions}
            size="small"
            formProps={filledTextField}
            allowNewValue
            {...substationFieldAdditionalProps}
        />
    ) : (
        <TextInput name={FieldConstants.SUBSTATION_ID} label="SUBSTATION" formProps={filledTextField} />
    );

    return (
        <>
            <Grid container spacing={2}>
                <GridItem>
                    <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={filledTextField} />
                </GridItem>
                <GridItem>
                    <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={filledTextField} />
                </GridItem>
            </Grid>

            {watchAddSubstationCreation ? (
                <SubstationCreationSection
                    showDeleteButton={showDeleteSubstationButton}
                    onDelete={handleDeleteSubstationCreation}
                />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        {substationField}
                    </Grid>
                </Grid>
            )}

            <GridSection title="VoltageText" />
            <Grid container spacing={2}>
                {!watchHideNominalVoltage && (
                    <GridItem size={4}>
                        <FloatInput
                            name={FieldConstants.NOMINAL_V}
                            label="NominalVoltage"
                            adornment={VoltageAdornment}
                        />
                    </GridItem>
                )}
                <GridItem size={4}>
                    <FloatInput
                        name={FieldConstants.LOW_VOLTAGE_LIMIT}
                        label="LowVoltageLimit"
                        adornment={VoltageAdornment}
                    />
                </GridItem>
                <GridItem size={4}>
                    <FloatInput
                        name={FieldConstants.HIGH_VOLTAGE_LIMIT}
                        label="HighVoltageLimit"
                        adornment={VoltageAdornment}
                    />
                </GridItem>
            </Grid>

            <GridSection title="ShortCircuit" />
            <Grid container spacing={2}>
                <GridItem size={4}>
                    <FloatInput
                        name={FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT}
                        label="LowShortCircuitCurrentLimit"
                        adornment={KiloAmpereAdornment}
                    />
                </GridItem>
                <GridItem size={4}>
                    <FloatInput
                        name={FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT}
                        label="HighShortCircuitCurrentLimit"
                        adornment={KiloAmpereAdornment}
                    />
                </GridItem>
                <Box sx={{ width: '100%' }} />
            </Grid>

            {!watchHideBusBarSection && (
                <>
                    <GridSection title="BusBarSections" />
                    <Grid container spacing={2}>
                        <GridItem size={4}>
                            <IntegerInput name={FieldConstants.BUS_BAR_COUNT} label="BusBarCount" />
                        </GridItem>
                        <GridItem size={4}>
                            <IntegerInput name={FieldConstants.SECTION_COUNT} label="numberOfSections" />
                        </GridItem>
                        <SwitchesBetweenSections />
                    </Grid>
                    {displayOmnibus && (
                        <>
                            <GridSection title="Coupling_Omnibus" />
                            <Grid container>
                                <GridItem size={12}>
                                    <CouplingOmnibusForm />
                                </GridItem>
                            </Grid>
                        </>
                    )}
                </>
            )}

            <PropertiesForm networkElementType="voltageLevel" />
        </>
    );
}
