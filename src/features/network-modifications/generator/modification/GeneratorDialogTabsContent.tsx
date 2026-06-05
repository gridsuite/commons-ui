/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { GeneratorDialogTab } from './generatorTabs.utils';
import {
    ActivePowerControlForm,
    ConnectivityForm,
    ConnectivityNetworkProps,
    PowerMeasurementsForm,
    PropertiesForm,
    ReactiveLimitsForm,
    SetPointsForm,
    ShortCircuitForm,
    VoltageRegulationForm,
} from '../../common';
import { GeneratorFormInfos } from '../generatorDialog.type';
import {
    ActivePowerAdornment,
    EquipmentType,
    FieldConstants,
    Identifiable,
    MVAPowerAdornment,
} from '../../../../utils';
import { CheckboxNullableInput, FloatInput } from '../../../../components';
import GridSection from '../../../../components/composite/grid/grid-section';
import GridItem from '../../../../components/composite/grid/grid-item';

export interface GeneratorDialogTabsContentProps extends ConnectivityNetworkProps {
    generatorToModify?: GeneratorFormInfos | null;
    updatePreviousReactiveCapabilityCurveTable: (action: string, index: number) => void;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    tabIndex: number;
}

export function GeneratorDialogTabsContent({
    generatorToModify,
    updatePreviousReactiveCapabilityCurveTable,
    tabIndex,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    fetchVoltageLevelEquipments,
}: Readonly<GeneratorDialogTabsContentProps>) {
    const intl = useIntl();
    const watchVoltageRegulation = useWatch({
        name: FieldConstants.VOLTAGE_REGULATION,
    });

    const previousRegulation = () => {
        if (generatorToModify?.voltageRegulatorOn) {
            return intl.formatMessage({ id: 'On' });
        }
        if (generatorToModify?.voltageRegulatorOn === false) {
            return intl.formatMessage({ id: 'Off' });
        }
        return null;
    };

    const voltageRegulationField = (
        <Box>
            <CheckboxNullableInput
                name={FieldConstants.VOLTAGE_REGULATION}
                label="VoltageRegulationText"
                previousValue={previousRegulation() ?? undefined}
            />
        </Box>
    );

    const voltageRegulationFields = (
        <VoltageRegulationForm
            voltageLevelOptions={voltageLevelOptions}
            fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
            previousValues={{
                regulatingTerminalConnectableId: generatorToModify?.regulatingTerminalConnectableId,
                regulatingTerminalVlId: generatorToModify?.regulatingTerminalVlId,
                regulatingTerminalConnectableType: generatorToModify?.regulatingTerminalConnectableType,
                voltageSetPoint: generatorToModify?.targetV,
                qPercent: generatorToModify?.coordinatedReactiveControl?.qPercent,
            }}
            isEquipmentModification
        />
    );

    const maximumActivePowerField = (
        <FloatInput
            name={FieldConstants.MAXIMUM_ACTIVE_POWER}
            label="MaximumActivePowerText"
            adornment={ActivePowerAdornment}
            previousValue={generatorToModify?.maxP}
            clearable
        />
    );

    const minimumActivePowerField = (
        <FloatInput
            name={FieldConstants.MINIMUM_ACTIVE_POWER}
            label="MinimumActivePowerText"
            adornment={ActivePowerAdornment}
            previousValue={generatorToModify?.minP}
            clearable
        />
    );

    const ratedNominalPowerField = (
        <FloatInput
            name={FieldConstants.RATED_NOMINAL_POWER}
            label="RatedNominalPowerText"
            adornment={MVAPowerAdornment}
            previousValue={generatorToModify?.ratedS}
            clearable
        />
    );

    const plannedActivePowerSetPointField = (
        <FloatInput
            name={FieldConstants.PLANNED_ACTIVE_POWER_SET_POINT}
            label="PlannedActivePowerSetPointForm"
            adornment={ActivePowerAdornment}
            previousValue={generatorToModify?.generatorStartup?.plannedActivePowerSetPoint ?? undefined}
            clearable
        />
    );

    const marginalCostField = (
        <FloatInput
            name={FieldConstants.MARGINAL_COST}
            label="MarginalCost"
            previousValue={generatorToModify?.generatorStartup?.marginalCost ?? undefined}
            clearable
        />
    );

    const plannedOutageRateField = (
        <FloatInput
            name={FieldConstants.PLANNED_OUTAGE_RATE}
            label="plannedOutageRate"
            previousValue={generatorToModify?.generatorStartup?.plannedOutageRate ?? undefined}
            clearable
        />
    );

    const forcedOutageRateField = (
        <FloatInput
            name={FieldConstants.FORCED_OUTAGE_RATE}
            label="forcedOutageRate"
            previousValue={generatorToModify?.generatorStartup?.forcedOutageRate ?? undefined}
            clearable
        />
    );

    return (
        <>
            <Box hidden={tabIndex !== GeneratorDialogTab.CONNECTIVITY_TAB}>
                <GridSection title="ConnectivityTab" />
                <ConnectivityForm
                    isEquipmentModification
                    previousValues={{
                        connectablePosition: generatorToModify?.connectablePosition,
                        voltageLevelId: generatorToModify?.voltageLevelId,
                        busOrBusbarSectionId: generatorToModify?.busOrBusbarSectionId,
                        terminalConnected: generatorToModify?.terminalConnected,
                    }}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                />
            </Box>

            <Box hidden={tabIndex !== GeneratorDialogTab.SETPOINTS_AND_LIMITS_TAB}>
                <SetPointsForm
                    previousValues={{
                        activePower: generatorToModify?.targetP,
                        reactivePower: generatorToModify?.targetQ,
                    }}
                    isModification
                />
                <Grid container spacing={2} paddingTop={2}>
                    <Box sx={{ width: '100%' }} />
                    <GridItem
                        tooltip={watchVoltageRegulation === null ? <FormattedMessage id="NoModification" /> : ''}
                        size={4}
                    >
                        {voltageRegulationField}
                    </GridItem>
                    {voltageRegulationFields}
                    <Box sx={{ width: '100%' }} />
                    <ActivePowerControlForm
                        isEquipmentModification
                        previousValues={generatorToModify?.activePowerControl}
                    />
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <h3>
                            <FormattedMessage id="Limits" />
                        </h3>
                        <h4>
                            <FormattedMessage id="ActiveLimits" />
                        </h4>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <GridItem size={4}>{minimumActivePowerField}</GridItem>
                    <GridItem size={4}>{maximumActivePowerField}</GridItem>
                    <GridItem size={4}>{ratedNominalPowerField}</GridItem>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <h4>
                            <FormattedMessage id="ReactiveLimits" />
                        </h4>
                    </Grid>
                </Grid>
                <ReactiveLimitsForm
                    previousReactiveCapabilityCurvePoints={generatorToModify?.reactiveCapabilityCurvePoints}
                    previousMinMaxReactiveLimits={generatorToModify?.minMaxReactiveLimits}
                    updatePreviousReactiveCapabilityCurveTable={updatePreviousReactiveCapabilityCurveTable}
                />
            </Box>

            <Box hidden={tabIndex !== GeneratorDialogTab.SPECIFIC_TAB}>
                <GridSection title="ShortCircuit" />
                <ShortCircuitForm previousValues={generatorToModify?.generatorShortCircuit} />
                <GridSection title="GenerationDispatch" />
                <Grid container spacing={2}>
                    <GridItem size={4}>{plannedActivePowerSetPointField}</GridItem>
                    <GridItem size={4}>{marginalCostField}</GridItem>
                    <Grid container item spacing={2}>
                        <GridItem size={4}>{plannedOutageRateField}</GridItem>
                        <GridItem size={4}>{forcedOutageRateField}</GridItem>
                    </Grid>
                </Grid>
                <GridSection title="MeasurementsSection" />
                <PowerMeasurementsForm
                    activePowerMeasurement={generatorToModify?.measurementP}
                    reactivePowerMeasurement={generatorToModify?.measurementQ}
                />
            </Box>

            <Box hidden={tabIndex !== GeneratorDialogTab.ADDITIONAL_INFORMATION_TAB}>
                <PropertiesForm networkElementType="generator" isModification />
            </Box>
        </>
    );
}
