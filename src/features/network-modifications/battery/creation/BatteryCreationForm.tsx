/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid2 as Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import {
    ActivePowerControlForm,
    ConnectivityForm,
    ConnectivityNetworkProps,
    filledTextField,
    PropertiesForm,
    ReactiveLimitsForm,
    SetPointsForm,
    ShortCircuitForm,
    VoltageRegulationForm,
} from '../../common';
import { ActivePowerAdornment, EquipmentType, FieldConstants, Identifiable } from '../../../../utils';
import { FloatInput, SwitchInput, TextInput } from '../../../../components/ui';
import { GridItem } from '../../../../components/composite/grid/grid-item';
import { GridSection } from '../../../../components/composite/grid/grid-section';
import { useWatch } from 'react-hook-form';

export interface BatteryCreationFormProps extends ConnectivityNetworkProps {
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function BatteryCreationForm({
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    fetchVoltageLevelEquipments,
}: Readonly<BatteryCreationFormProps>) {
    const watchVoltageRegulation = useWatch({
        name: FieldConstants.VOLTAGE_REGULATION,
    });

    const batteryIdField = (
        <TextInput name={FieldConstants.EQUIPMENT_ID} label="ID" formProps={{ autoFocus: true, ...filledTextField }} />
    );

    const batteryNameField = (
        <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={filledTextField} />
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
                <GridItem size={4}>{batteryIdField}</GridItem>
                <GridItem size={4}>{batteryNameField}</GridItem>
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
            </Grid>

            {/* Reactive limits part */}
            <GridSection title="ReactiveLimits" />
            <ReactiveLimitsForm />

            {/* Set points part */}
            <SetPointsForm />

            {/* Active power control part */}
            <Grid container spacing={2} paddingTop={2}>
                <GridItem
                    tooltip={watchVoltageRegulation !== null ? '' : <FormattedMessage id="NoModification" />}
                    size={4}
                >
                    {voltageRegulationField}
                </GridItem>
                {voltageRegulationFields}
                <ActivePowerControlForm />
            </Grid>

            {/* Short Circuit part */}
            <GridSection title="ShortCircuit" />
            <ShortCircuitForm />

            <PropertiesForm networkElementType="battery" />
        </>
    );
}
