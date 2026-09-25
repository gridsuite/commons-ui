/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { LccConverterStationFormInfos } from '../lccHvdcLine.types';
import { FloatInput, GridItem, GridSection, TextInput } from '../../../../../../components';
import { ConnectivityForm, ConnectivityNetworkProps } from '../../../../common';
import { FieldConstants, PercentageAdornment } from '../../../../../../utils';
import { FiltersShuntCompensatorTable } from './FiltersShuntCompensatorTable';
import { ModificationFiltersShuntCompensatorTable } from './FilterShuntCompensatorTableModification';

interface LccConverterStationProps extends ConnectivityNetworkProps {
    id: string;
    stationLabel: string;
    stationToModify?: LccConverterStationFormInfos | null;
    isModification?: boolean;
}

function ShuntCompensatorSection({
    id,
    isModification,
    stationToModify,
}: {
    id: string;
    isModification?: boolean;
    stationToModify?: LccConverterStationFormInfos | null;
}) {
    return isModification ? (
        <ModificationFiltersShuntCompensatorTable id={id} previousValues={stationToModify?.shuntCompensatorsOnSide} />
    ) : (
        <FiltersShuntCompensatorTable id={id} />
    );
}

export function LccConverterStation({
    id,
    stationLabel,
    stationToModify,
    isModification = false,
    PositionDiagramPane,
    voltageLevelOptions = [],
    fetchBusesOrBusbarSections,
}: Readonly<LccConverterStationProps>) {
    const stationNameField = (
        <TextInput
            name={`${id}.${FieldConstants.CONVERTER_STATION_NAME}`}
            label="converterStationName"
            previousValue={stationToModify?.name ?? ''}
            clearable={isModification}
        />
    );

    const connectivityForm = (
        <ConnectivityForm
            id={`${id}.${FieldConstants.CONNECTIVITY}`}
            previousValues={undefined}
            voltageLevelOptions={voltageLevelOptions}
            PositionDiagramPane={PositionDiagramPane}
            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
        />
    );

    const connectivitySection = (
        <>
            <GridSection title="Connectivity" />
            <Grid container spacing={2}>
                <GridItem size={12}>{connectivityForm}</GridItem>
            </Grid>
        </>
    );

    const powerFactorField = (
        <FloatInput
            name={`${id}.${FieldConstants.POWER_FACTOR}`}
            label="powerFactorLabel"
            previousValue={stationToModify?.powerFactor}
            clearable={isModification}
        />
    );

    return (
        <Grid container>
            <GridSection title={stationLabel} />
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <GridItem size={4}>
                    <TextInput
                        name={`${id}.${FieldConstants.CONVERTER_STATION_ID}`}
                        label="converterStationId"
                        disabled={isModification}
                    />
                </GridItem>
                <GridItem size={4}>{stationNameField}</GridItem>
            </Grid>
            {!isModification && connectivitySection}
            <GridSection title="Characteristics" />
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <GridItem size={4}>
                    {' '}
                    <FloatInput
                        name={`${id}.${FieldConstants.LOSS_FACTOR}`}
                        label="lossFactorLabel"
                        adornment={PercentageAdornment}
                        previousValue={stationToModify?.lossFactor}
                        clearable={isModification}
                    />
                </GridItem>
                <GridItem size={4}>{powerFactorField}</GridItem>
            </Grid>
            <GridSection title="Filters" />
            <ShuntCompensatorSection id={id} isModification={isModification} stationToModify={stationToModify} />
        </Grid>
    );
}
