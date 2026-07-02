/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid2 as Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useWatch } from 'react-hook-form';
import {
    ActivePowerControlForm,
    ConnectivityForm,
    ConnectivityNetworkProps,
    filledTextField,
    italicFontTextField,
    PropertiesForm,
    ReactiveLimitsForm,
    SetPointsForm,
    ShortCircuitForm,
    VoltageRegulationForm,
} from '../../common';
import {
    ActivePowerAdornment,
    ENERGY_SOURCES,
    EquipmentType,
    FieldConstants,
    Identifiable,
    MVAPowerAdornment,
} from '../../../../utils';
import { FloatInput, SelectInput, SwitchInput, TextInput } from '../../../../components';
import { GridItem } from '../../../../components/composite/grid/grid-item';
import { GridSection } from '../../../../components/composite/grid/grid-section';

export interface GeneratorCreationFormProps extends ConnectivityNetworkProps {
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function GeneratorCreationForm({
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    fetchVoltageLevelEquipments,
}: Readonly<GeneratorCreationFormProps>) {
    const watchVoltageRegulation = useWatch({
        name: FieldConstants.VOLTAGE_REGULATION,
    });

    const generatorIdField = (
        <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={{ autoFocus: true, ...filledTextField }} />
    );

    const generatorNameField = (
        <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={filledTextField} />
    );

    const energySourceField = (
        <SelectInput
            name={FieldConstants.ENERGY_SOURCE}
            label="energySource"
            options={[...ENERGY_SOURCES]}
            fullWidth
            size="small"
            disableClearable
            formProps={{ ...italicFontTextField, ...filledTextField }}
        />
    );

    const connectivityForm = (
        <ConnectivityForm
            voltageLevelOptions={voltageLevelOptions}
            PositionDiagramPane={PositionDiagramPane}
            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
        />
    );

    const maximumActivePowerField = (
        <FloatInput
            name={FieldConstants.MAXIMUM_ACTIVE_POWER}
            label="MaximumActivePowerText"
            adornment={ActivePowerAdornment}
        />
    );

    const minimumActivePowerField = (
        <FloatInput
            name={FieldConstants.MINIMUM_ACTIVE_POWER}
            label="MinimumActivePowerText"
            adornment={ActivePowerAdornment}
        />
    );

    const ratedNominalPowerField = (
        <FloatInput
            name={FieldConstants.RATED_NOMINAL_POWER}
            label="RatedNominalPowerText"
            adornment={MVAPowerAdornment}
        />
    );

    const plannedActivePowerSetPointField = (
        <FloatInput
            name={FieldConstants.PLANNED_ACTIVE_POWER_SET_POINT}
            label="PlannedActivePowerSetPointForm"
            adornment={ActivePowerAdornment}
        />
    );

    const marginalCostField = <FloatInput name={FieldConstants.MARGINAL_COST} label="MarginalCost" />;

    const plannedOutageRateField = <FloatInput name={FieldConstants.PLANNED_OUTAGE_RATE} label="plannedOutageRate" />;

    const forcedOutageRateField = <FloatInput name={FieldConstants.FORCED_OUTAGE_RATE} label="forcedOutageRate" />;

    const voltageRegulationField = (
        <Box>
            <SwitchInput name={FieldConstants.VOLTAGE_REGULATION} label="VoltageRegulationText" />
        </Box>
    );

    const voltageRegulationFields = (
        <VoltageRegulationForm
            voltageLevelOptions={voltageLevelOptions}
            fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
        />
    );

    return (
        <>
            <Grid container spacing={2}>
                <GridItem size={4}>{generatorIdField}</GridItem>
                <GridItem size={4}>{generatorNameField}</GridItem>
                <GridItem size={4}>{energySourceField}</GridItem>
            </Grid>

            {/* Connectivity part */}
            <GridSection title="Connectivity" />
            <Grid container spacing={2}>
                <GridItem size={12}>{connectivityForm}</GridItem>
            </Grid>

            {/* ActiveLimits part */}
            <GridSection title="ActiveLimits" />
            <Grid container spacing={2}>
                <GridItem size={4}>{minimumActivePowerField}</GridItem>
                <GridItem size={4}>{maximumActivePowerField}</GridItem>
                <GridItem size={4}>{ratedNominalPowerField}</GridItem>
            </Grid>

            {/* Reactive limits part */}
            <GridSection title="ReactiveLimits" />
            <ReactiveLimitsForm />

            {/* Set points part */}
            <SetPointsForm />
            <Grid container spacing={2} paddingTop={2}>
                <Box sx={{ width: '100%' }} />
                <GridItem
                    tooltip={watchVoltageRegulation !== null ? '' : <FormattedMessage id="NoModification" />}
                    size={4}
                >
                    {voltageRegulationField}
                </GridItem>
                {voltageRegulationFields}
                <Box sx={{ width: '100%' }} />
                <ActivePowerControlForm />
            </Grid>

            {/* Short Circuit part */}
            <GridSection title="ShortCircuit" />
            <ShortCircuitForm />

            {/* Cost of start part */}
            <GridSection title="GenerationDispatch" />
            <Grid container spacing={2}>
                <GridItem size={4}>{plannedActivePowerSetPointField}</GridItem>
                <GridItem size={4}>{marginalCostField}</GridItem>
                <Grid container spacing={2}>
                    <GridItem size={4}>{plannedOutageRateField}</GridItem>
                    <GridItem size={4}>{forcedOutageRateField}</GridItem>
                </Grid>
            </Grid>
            <PropertiesForm networkElementType="generator" />
        </>
    );
}
