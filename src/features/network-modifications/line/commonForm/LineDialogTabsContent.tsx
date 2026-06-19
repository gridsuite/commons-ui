/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import GridSection from '../../../../components/composite/grid/grid-section';
import { ConnectivityNetworkProps } from '../../common/connectivity/connectivity.type';
import { LineDialogTab } from './line.utils';
import { BranchConnectivityForm } from '../../common/connectivity/BranchConnectivityForm';
import { BranchActiveReactivePowerMeasurementsForm } from '../../common/measurements/BranchActiveReactivePowerMeasurementsForm';
import { LineCharacteristicsPane } from '../characteristicsPane';
import { BranchInfos } from './line.types';
import { LimitsPane } from '../../common/limits/LimitsPane';

export interface LineDialogTabsContentProps extends ConnectivityNetworkProps {
    lineToModify?: BranchInfos | null;
    isModification?: boolean;
    tabIndex: number;
}

export function LineDialogTabsContent({
    lineToModify,
    isModification = false,
    tabIndex,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
}: Readonly<LineDialogTabsContentProps>) {
    return (
        <>
            {isModification && (
                <Box hidden={tabIndex !== LineDialogTab.CONNECTIVITY_TAB}>
                    <GridSection title="ConnectivityTab" />
                    <BranchConnectivityForm
                        isModification
                        previousValues={lineToModify}
                        voltageLevelOptions={voltageLevelOptions}
                        PositionDiagramPane={PositionDiagramPane}
                        fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    />
                </Box>
            )}
            <Box hidden={tabIndex !== LineDialogTab.CHARACTERISTICS_TAB} p={1}>
                <LineCharacteristicsPane
                    displayConnectivity={!isModification}
                    lineToModify={lineToModify}
                    clearableFields
                    isModification={isModification}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                />
            </Box>
            <Box hidden={tabIndex !== LineDialogTab.LIMITS_TAB} p={1}>
                <LimitsPane equipmentToModify={lineToModify} clearableFields />
            </Box>
            {isModification && (
                <Box hidden={tabIndex !== LineDialogTab.STATE_ESTIMATION_TAB}>
                    <BranchActiveReactivePowerMeasurementsForm equipmentToModify={lineToModify} />
                </Box>
            )}
        </>
    );
}
