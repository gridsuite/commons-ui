/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import {
    CheckboxNullableInput,
    FloatInput,
    GridItem,
    GridSection,
    SwitchInput,
    TextInput,
} from '../../../../../../components';
import { ReactiveLimitsForm } from '../../../../common/reactiveLimits/ReactiveLimitsForm';
import { ConnectivityForm, ConnectivityNetworkProps } from '../../../../common/connectivity';
import { FieldConstants, PercentageAdornment, ReactivePowerAdornment, VoltageAdornment } from '../../../../../../utils';
import { UpdateReactiveCapabilityCurveTable } from '../../../../common/reactiveLimits/reactiveLimits.type';
import { ConverterStationInfos } from '../vscHvdcLine.types';

interface VscConverterStationPaneProps extends ConnectivityNetworkProps {
    id: string;
    stationLabel: string;
    isModification?: boolean;
    stationToModify?: ConverterStationInfos | null;
    updatePreviousReactiveCapabilityCurveTableConverterStation?: UpdateReactiveCapabilityCurveTable;
}

export function VscConverterStationPane({
    id,
    stationLabel,
    isModification = false,
    stationToModify,
    updatePreviousReactiveCapabilityCurveTableConverterStation,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
}: Readonly<VscConverterStationPaneProps>) {
    const intl = useIntl();

    const { trigger } = useFormContext();

    const voltageRegulationOnWatch = useWatch({
        name: `${id}.${FieldConstants.VOLTAGE_REGULATION_ON}`,
    });

    useEffect(() => {
        if (!voltageRegulationOnWatch) {
            trigger(`${id}.${FieldConstants.VOLTAGE_REGULATION_ON}`);
        }
    }, [voltageRegulationOnWatch, trigger, id]);

    const converterStationIdField = (
        <TextInput
            name={`${id}.${FieldConstants.CONVERTER_STATION_ID}`}
            label="converterStationId"
            disabled={isModification}
        />
    );

    const converterStationNameField = (
        <TextInput
            name={`${id}.${FieldConstants.CONVERTER_STATION_NAME}`}
            label="converterStationName"
            previousValue={stationToModify?.name ?? ''}
        />
    );

    const connectivityForm = (
        <ConnectivityForm
            id={`${id}.${FieldConstants.CONNECTIVITY}`}
            isEquipmentModification={isModification}
            previousValues={{
                connectablePosition: stationToModify?.connectablePosition,
                voltageLevelId: stationToModify?.voltageLevelId,
                busOrBusbarSectionId: stationToModify?.busOrBusbarSectionId,
                terminalConnected: stationToModify?.terminalConnected,
            }}
            voltageLevelOptions={voltageLevelOptions}
            PositionDiagramPane={PositionDiagramPane}
            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
        />
    );

    const lossFactorField = (
        <FloatInput
            name={`${id}.${FieldConstants.LOSS_FACTOR}`}
            label="lossFactorLabel"
            adornment={PercentageAdornment}
            previousValue={stationToModify?.lossFactor}
        />
    );

    const reactivePowerField = (
        <FloatInput
            name={`${id}.${FieldConstants.REACTIVE_POWER}`}
            adornment={ReactivePowerAdornment}
            label="ReactivePowerText"
            previousValue={stationToModify?.reactivePowerSetpoint ?? undefined}
        />
    );

    const previousVoltageRegulatorOn = () => {
        return intl.formatMessage({
            id: stationToModify?.voltageRegulatorOn ? 'On' : 'Off',
        });
    };
    const voltageRegulation = isModification ? (
        <CheckboxNullableInput
            name={`${id}.${FieldConstants.VOLTAGE_REGULATION_ON}`}
            label="VoltageRegulationText"
            previousValue={previousVoltageRegulatorOn()}
            id={undefined}
            formProps={undefined}
        />
    ) : (
        <SwitchInput name={`${id}.${FieldConstants.VOLTAGE_REGULATION_ON}`} label="VoltageRegulationText" />
    );

    const voltageField = (
        <FloatInput
            name={`${id}.${FieldConstants.VOLTAGE}`}
            adornment={VoltageAdornment}
            label="VoltageText"
            previousValue={stationToModify?.voltageSetpoint ?? undefined}
        />
    );

    return (
        <Grid container>
            <GridSection title={stationLabel} />
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <GridItem size={4}>{converterStationIdField}</GridItem>
                <GridItem size={4}>{converterStationNameField}</GridItem>
            </Grid>

            {!isModification && (
                <>
                    <GridSection title="Connectivity" />
                    <Grid container spacing={2}>
                        <GridItem size={12}>{connectivityForm}</GridItem>
                    </Grid>
                </>
            )}

            <GridSection title="Characteristics" />
            <Grid container sx={{ width: '100%' }}>
                <GridItem size={4}>{lossFactorField}</GridItem>
            </Grid>

            <GridSection title="ReactiveLimits" />
            <ReactiveLimitsForm
                id={`${id}.${FieldConstants.REACTIVE_LIMITS}`}
                previousReactiveCapabilityCurvePoints={stationToModify?.reactiveCapabilityCurvePoints}
                previousMinMaxReactiveLimits={stationToModify?.minMaxReactiveLimits}
                updatePreviousReactiveCapabilityCurveTable={updatePreviousReactiveCapabilityCurveTableConverterStation}
            />

            <GridSection title="Setpoints" />
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <GridItem size={4}>{reactivePowerField}</GridItem>
            </Grid>
            <Grid container spacing={2} paddingTop={2} sx={{ width: '100%' }}>
                <GridItem size={4}>{voltageRegulation}</GridItem>
                <GridItem size={4}>{voltageField}</GridItem>
            </Grid>
        </Grid>
    );
}
