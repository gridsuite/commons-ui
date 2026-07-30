/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid2 as Grid } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { BatteryDialogTab } from './batteryTabs.utils';
import { GridSection } from '../../../../components/composite/grid/grid-section';
import { GridItem } from '../../../../components/composite/grid/grid-item';
import { BatteryFormInfos } from '../batteryDialog.type';
import {
    ActivePowerControlForm,
    ConnectivityForm,
    ConnectivityNetworkProps,
    PowerMeasurementsForm,
    PropertiesForm,
    ReactiveLimitsForm,
    ShortCircuitForm,
    VoltageRegulationForm,
} from '../../common';
import { CheckboxNullableInput, FloatInput } from '../../../../components';
import { FieldConstants } from '../../../../utils/constants/fieldConstants';
import { ActivePowerAdornment, EquipmentType, Identifiable, ReactivePowerAdornment } from '../../../../utils';

export interface BatteryDialogTabsContentProps extends ConnectivityNetworkProps {
    batteryToModify?: BatteryFormInfos | null;
    updatePreviousReactiveCapabilityCurveTable: (action: string, index: number) => void;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    tabIndex: number;
}

export function BatteryDialogTabsContent({
    batteryToModify,
    updatePreviousReactiveCapabilityCurveTable,
    tabIndex,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    fetchVoltageLevelEquipments,
}: Readonly<BatteryDialogTabsContentProps>) {
    const intl = useIntl();
    const previousRegulation = () => {
        if (batteryToModify?.voltageRegulatorOn) {
            return intl.formatMessage({ id: 'On' });
        }
        if (batteryToModify?.voltageRegulatorOn === false) {
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

    const voltageRegulationForm = (
        <VoltageRegulationForm
            voltageLevelOptions={voltageLevelOptions}
            fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
            previousValues={{
                regulatingTerminalConnectableId: batteryToModify?.regulatingTerminalConnectableId,
                regulatingTerminalVlId: batteryToModify?.regulatingTerminalVlId,
                regulatingTerminalConnectableType: batteryToModify?.regulatingTerminalConnectableType,
                voltageSetPoint: batteryToModify?.targetV,
            }}
            isEquipmentModification
            isGenerator={false}
        />
    );

    return (
        <>
            <Box hidden={tabIndex !== BatteryDialogTab.CONNECTIVITY_TAB}>
                <GridSection title="Connectivity" />
                <ConnectivityForm
                    isEquipmentModification
                    previousValues={{
                        connectablePosition: batteryToModify?.connectablePosition,
                        voltageLevelId: batteryToModify?.voltageLevelId,
                        busOrBusbarSectionId: batteryToModify?.busOrBusbarSectionId,
                        terminalConnected: batteryToModify?.terminalConnected,
                    }}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                />
            </Box>

            <Box hidden={tabIndex !== BatteryDialogTab.LIMITS_AND_SETPOINTS_TAB}>
                <GridSection title="Setpoints" />
                <Grid container spacing={2}>
                    <GridItem size={4}>
                        <FloatInput
                            name={FieldConstants.ACTIVE_POWER_SET_POINT}
                            label="ActivePowerText"
                            adornment={ActivePowerAdornment}
                            previousValue={batteryToModify?.targetP}
                            clearable
                        />
                    </GridItem>
                    <GridItem size={4}>
                        <FloatInput
                            name={FieldConstants.REACTIVE_POWER_SET_POINT}
                            label="ReactivePowerText"
                            adornment={ReactivePowerAdornment}
                            previousValue={batteryToModify?.targetQ}
                            clearable
                        />
                    </GridItem>
                </Grid>
                <Grid container spacing={2} paddingTop={2}>
                    <GridItem size={4}>{voltageRegulationField}</GridItem>
                    {voltageRegulationForm}
                    <ActivePowerControlForm
                        isEquipmentModification
                        previousValues={batteryToModify?.activePowerControl}
                    />
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <h3>
                            <FormattedMessage id="Limits" />
                        </h3>
                        <h4>
                            <FormattedMessage id="ActiveLimits" />
                        </h4>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <GridItem size={4}>
                        <FloatInput
                            name={FieldConstants.MINIMUM_ACTIVE_POWER}
                            label="MinimumActivePowerText"
                            adornment={ActivePowerAdornment}
                            previousValue={batteryToModify?.minP}
                            clearable
                        />
                    </GridItem>
                    <GridItem size={4}>
                        <FloatInput
                            name={FieldConstants.MAXIMUM_ACTIVE_POWER}
                            label="MaximumActivePowerText"
                            adornment={ActivePowerAdornment}
                            previousValue={batteryToModify?.maxP}
                            clearable
                        />
                    </GridItem>
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <h4>
                            <FormattedMessage id="ReactiveLimits" />
                        </h4>
                    </Grid>
                </Grid>
                <ReactiveLimitsForm
                    previousReactiveCapabilityCurvePoints={batteryToModify?.reactiveCapabilityCurvePoints}
                    previousMinMaxReactiveLimits={batteryToModify?.minMaxReactiveLimits}
                    updatePreviousReactiveCapabilityCurveTable={updatePreviousReactiveCapabilityCurveTable}
                />
            </Box>

            <Box hidden={tabIndex !== BatteryDialogTab.SPECIFIC_TAB}>
                <GridSection title="ShortCircuit" />
                <ShortCircuitForm previousValues={batteryToModify?.batteryShortCircuit} />
                <GridSection title="MeasurementsSection" />
                <PowerMeasurementsForm
                    activePowerMeasurement={batteryToModify?.measurementP}
                    reactivePowerMeasurement={batteryToModify?.measurementQ}
                />
            </Box>

            <Box hidden={tabIndex !== BatteryDialogTab.ADDITIONAL_INFORMATION_TAB}>
                <PropertiesForm networkElementType="battery" isModification />
            </Box>
        </>
    );
}
