/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import GridSection from '../../../grid/grid-section';
import { FieldConstants } from '../../../../utils';
import { ConnectivityNetworkProps } from './connectivity.type';
import { ConnectivityForm } from './ConnectivityForm';

interface BranchConnectivityFormProps extends ConnectivityNetworkProps {
    isModification?: boolean;
    previousValues?: any;
}

export function BranchConnectivityForm({
    isModification = false,
    previousValues,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
}: Readonly<BranchConnectivityFormProps>) {
    const id1 = `${FieldConstants.CONNECTIVITY}.${FieldConstants.CONNECTIVITY_1}`;
    const id2 = `${FieldConstants.CONNECTIVITY}.${FieldConstants.CONNECTIVITY_2}`;

    return (
        <>
            <GridSection title="Side1" heading={4} />
            <ConnectivityForm
                id={id1}
                isEquipmentModification={isModification}
                previousValues={{
                    connectablePosition: previousValues?.connectablePosition1,
                    voltageLevelId: previousValues?.voltageLevelId1,
                    busOrBusbarSectionId: previousValues?.busOrBusbarSectionId1,
                    terminalConnected: previousValues?.terminal1Connected,
                }}
                voltageLevelOptions={voltageLevelOptions}
                fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                PositionDiagramPane={PositionDiagramPane}
            />
            <GridSection title="Side2" heading={4} />
            <ConnectivityForm
                id={id2}
                isEquipmentModification={isModification}
                previousValues={{
                    connectablePosition: previousValues?.connectablePosition2,
                    voltageLevelId: previousValues?.voltageLevelId2,
                    busOrBusbarSectionId: previousValues?.busOrBusbarSectionId2,
                    terminalConnected: previousValues?.terminal2Connected,
                }}
                voltageLevelOptions={voltageLevelOptions}
                fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                PositionDiagramPane={PositionDiagramPane}
            />
        </>
    );
}
