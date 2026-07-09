/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid } from '@mui/material';
import { FieldConstants, MicroSusceptanceAdornment, OhmAdornment } from '../../../../utils/constants';
import { FloatInput } from '../../../../components';
import { convertInputValue, FieldType } from '../../../../utils';
import { BranchInfos } from '../common/line.types';
import { PropertiesForm } from '../../common/properties/PropertiesForm';
import { GridSection } from '../../../../components/composite/grid/grid-section';
import { GridItem } from '../../../../components/composite/grid/grid-item';

interface LineCharacteristicsPaneProps {
    id?: string;
    lineToModify?: BranchInfos | null;
    isModification?: boolean;
}

export function LineCharacteristicsPane({
    id = FieldConstants.CHARACTERISTICS,
    lineToModify,
    isModification = false,
}: Readonly<LineCharacteristicsPaneProps>) {
    const seriesResistanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.R}`}
            label="SeriesResistanceText"
            adornment={OhmAdornment}
            previousValue={lineToModify?.r}
            clearable={isModification}
        />
    );

    const seriesReactanceField = (
        <FloatInput
            name={`${id}.${FieldConstants.X}`}
            label="SeriesReactanceText"
            adornment={OhmAdornment}
            previousValue={lineToModify?.x}
            clearable={isModification}
        />
    );

    const shuntConductance1Field = (
        <FloatInput
            name={`${id}.${FieldConstants.G1}`}
            label="ShuntConductanceText"
            adornment={MicroSusceptanceAdornment}
            previousValue={convertInputValue(FieldType.G1, lineToModify?.g1)}
            clearable={isModification}
        />
    );

    const shuntSusceptance1Field = (
        <FloatInput
            name={`${id}.${FieldConstants.B1}`}
            label="ShuntSusceptanceText"
            adornment={MicroSusceptanceAdornment}
            previousValue={convertInputValue(FieldType.B1, lineToModify?.b1)}
            clearable={isModification}
        />
    );

    const shuntConductance2Field = (
        <FloatInput
            name={`${id}.${FieldConstants.G2}`}
            label="ShuntConductanceText"
            adornment={MicroSusceptanceAdornment}
            previousValue={convertInputValue(FieldType.G2, lineToModify?.g2)}
            clearable={isModification}
        />
    );

    const shuntSusceptance2Field = (
        <FloatInput
            name={`${id}.${FieldConstants.B2}`}
            label="ShuntSusceptanceText"
            adornment={MicroSusceptanceAdornment}
            previousValue={convertInputValue(FieldType.B2, lineToModify?.b2)}
            clearable={isModification}
        />
    );

    return (
        <>
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
