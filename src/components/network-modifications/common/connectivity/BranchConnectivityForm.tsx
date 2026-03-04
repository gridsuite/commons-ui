/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { ConnectivityForm } from './ConnectivityForm';
import GridSection from '../../../grid/grid-section';
import GridItem from '../../../grid/grid-item';
import { FieldConstants, Identifiable } from '../../../../utils';

interface BranchConnectivityFormProps {
    voltageLevelOptions?: Identifiable[];
    fetchBusesOrBusbarSections?: (voltageLevelId: string) => Promise<Identifiable[]>;
    isModification?: boolean;
    previousValues?: any;
}

export function BranchConnectivityForm({
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    isModification = false,
    previousValues,
}: Readonly<BranchConnectivityFormProps>) {
    const id1 = `${FieldConstants.CONNECTIVITY}.${FieldConstants.CONNECTIVITY_1}`;
    const id2 = `${FieldConstants.CONNECTIVITY}.${FieldConstants.CONNECTIVITY_2}`;

    const connectivity1Field = (
        <ConnectivityForm
            id={id1}
            voltageLevelOptions={voltageLevelOptions}
            withPosition
            isEquipmentModification={isModification}
            previousValues={{
                connectablePosition: previousValues?.connectablePosition1,
                voltageLevelId: previousValues?.voltageLevelId1,
                busOrBusbarSectionId: previousValues?.busOrBusbarSectionId1,
                terminalConnected: previousValues?.terminal1Connected,
            }}
            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
        />
    );

    const connectivity2Field = (
        <ConnectivityForm
            id={id2}
            voltageLevelOptions={voltageLevelOptions}
            withPosition
            isEquipmentModification={isModification}
            previousValues={{
                connectablePosition: previousValues?.connectablePosition2,
                voltageLevelId: previousValues?.voltageLevelId2,
                busOrBusbarSectionId: previousValues?.busOrBusbarSectionId2,
                terminalConnected: previousValues?.terminal2Connected,
            }}
            fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
        />
    );

    return (
        <>
            <GridSection title="Side1" heading={4} />
            <Grid container spacing={2}>
                <GridItem size={12}>{connectivity1Field}</GridItem>
            </Grid>
            <GridSection title="Side2" heading={4} />
            <Grid container spacing={2}>
                <GridItem size={12}>{connectivity2Field}</GridItem>
            </Grid>
        </>
    );
}
