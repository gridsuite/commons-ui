/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { FieldConstants, MicroSusceptanceAdornment, OhmAdornment } from '../../../../utils/constants';
import { FloatInput } from '../../../../components';
import { convertInputValue, FieldType } from '../../../../utils';
import { BranchInfos } from '../commonForm/line.types';
import { ConnectivityNetworkProps } from '../../common/connectivity/connectivity.type';
import { ConnectivityForm } from '../../common/connectivity/ConnectivityForm';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import GridSection from '../../../../components/composite/grid/grid-section';
import GridItem from '../../../../components/composite/grid/grid-item';

const styles = {
    h3: {
        marginTop: 0,
        marginBottom: 0,
    },
};

interface LineCharacteristicsPaneProps extends ConnectivityNetworkProps {
    id?: string;
    displayConnectivity: boolean;
    lineToModify?: BranchInfos | null;
    clearableFields?: boolean;
    isModification?: boolean;
}

export function LineCharacteristicsPane({
    id = FieldConstants.CHARACTERISTICS,
    displayConnectivity,
    lineToModify,
    clearableFields = false,
    isModification = false,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
}: LineCharacteristicsPaneProps) {
    const seriesResistanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.R}`}
            label="SeriesResistanceText"
            adornment={OhmAdornment}
            previousValue={lineToModify?.r}
            clearable={clearableFields}
        />
    );

    const seriesReactanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.X}`}
            label="SeriesReactanceText"
            adornment={OhmAdornment}
            previousValue={lineToModify?.x}
            clearable={clearableFields}
        />
    );

    const shuntConductance1Field = (
        <FloatInput
            name={`${id}.${FieldConstants.G1}`}
            label="ShuntConductanceText"
            adornment={MicroSusceptanceAdornment}
            previousValue={convertInputValue(FieldType.G1, lineToModify?.g1)}
            clearable={clearableFields}
        />
    );

    const shuntSusceptance1Field = (
        <FloatInput
            name={`${id}.${FieldConstants.B1}`}
            label="ShuntSusceptanceText"
            adornment={MicroSusceptanceAdornment}
            previousValue={convertInputValue(FieldType.B1, lineToModify?.b1)}
            clearable={clearableFields}
        />
    );

    const shuntConductance2Field = (
        <FloatInput
            name={`${id}.${FieldConstants.G2}`}
            label="ShuntConductanceText"
            adornment={MicroSusceptanceAdornment}
            previousValue={convertInputValue(FieldType.G2, lineToModify?.g2)}
            clearable={clearableFields}
        />
    );

    const shuntSusceptance2Field = (
        <FloatInput
            name={`${id}.${FieldConstants.B2}`}
            label="ShuntSusceptanceText"
            adornment={MicroSusceptanceAdornment}
            previousValue={convertInputValue(FieldType.B2, lineToModify?.b2)}
            clearable={clearableFields}
        />
    );

    const connectivity1Field = (
        <ConnectivityForm
            id={`${id}.${FieldConstants.CONNECTIVITY_1}`}
            voltageLevelOptions={voltageLevelOptions}
            PositionDiagramPane={PositionDiagramPane}
            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
        />
    );

    const connectivity2Field = (
        <ConnectivityForm
            id={`${id}.${FieldConstants.CONNECTIVITY_2}`}
            voltageLevelOptions={voltageLevelOptions}
            PositionDiagramPane={PositionDiagramPane}
            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
        />
    );

    return (
        <>
            {displayConnectivity && (
                <>
                    <GridSection title="Connectivity" customStyle={styles.h3} />
                    <GridSection title="Side1" heading={4} />
                    <Grid container spacing={2}>
                        <GridItem size={12}>{connectivity1Field}</GridItem>
                    </Grid>
                    <GridSection title="Side2" heading={4} />
                    <Grid container spacing={2}>
                        <GridItem size={12}>{connectivity2Field}</GridItem>
                    </Grid>
                </>
            )}
            <GridSection title="Characteristics" />
            <Grid container spacing={2}>
                <GridItem size={4}>{seriesResistanceField}</GridItem>
                <GridItem size={4}>{seriesReactanceField}</GridItem>
            </Grid>
            <GridSection title="Side1" heading={4} />
            <Grid container spacing={2}>
                <GridItem size={4}>{shuntConductance1Field}</GridItem>
                <GridItem size={4}>{shuntSusceptance1Field}</GridItem>
            </Grid>
            <GridSection title="Side2" heading={4} />
            <Grid container spacing={2}>
                <GridItem size={4}>{shuntConductance2Field}</GridItem>
                <GridItem size={4}>{shuntSusceptance2Field}</GridItem>
            </Grid>
            <PropertiesForm networkElementType="line" isModification={isModification} />
        </>
    );
}
