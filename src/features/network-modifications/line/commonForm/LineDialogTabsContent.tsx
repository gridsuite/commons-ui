/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { ConnectivityNetworkProps } from '../../common/connectivity/connectivity.type';
import { LineDialogOptions, LineDialogTab } from './line.utils';
import { BranchConnectivityForm } from '../../common/connectivity/BranchConnectivityForm';
import { BranchActiveReactivePowerMeasurementsForm } from '../../common/measurements/BranchActiveReactivePowerMeasurementsForm';
import { LineCharacteristicsPane } from '../characteristicsPane';
import { BranchInfos } from './line.types';
import { LimitsPane } from '../../common/limits/LimitsPane';
import { GridSection } from '../../../../components';

export interface LineDialogTabsContentProps extends ConnectivityNetworkProps, LineDialogOptions {
    lineToModify?: BranchInfos | null;
    tabIndex: number;
}

export function LineDialogTabsContent({
    lineToModify,
    isModification = false,
    withConnectivity = true,
    clearableFields = false,
    tabIndex,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
}: Readonly<LineDialogTabsContentProps>) {
    return (
        <>
            {withConnectivity && (
                <Box hidden={tabIndex !== LineDialogTab.CONNECTIVITY_TAB}>
                    <GridSection title="ConnectivityTab" />
                    <BranchConnectivityForm
                        isModification={isModification}
                        previousValues={lineToModify}
                        voltageLevelOptions={voltageLevelOptions}
                        PositionDiagramPane={PositionDiagramPane}
                        fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    />
                </Box>
            )}
            <Box hidden={tabIndex !== LineDialogTab.CHARACTERISTICS_TAB} p={1}>
                <LineCharacteristicsPane lineToModify={lineToModify} isModification={isModification} />
            </Box>
            <Box hidden={tabIndex !== LineDialogTab.LIMITS_TAB} p={1}>
                <LimitsPane equipmentToModify={lineToModify} clearableFields={clearableFields} />
            </Box>
            {isModification && (
                <Box hidden={tabIndex !== LineDialogTab.STATE_ESTIMATION_TAB}>
                    <BranchActiveReactivePowerMeasurementsForm equipmentToModify={lineToModify} />
                </Box>
            )}
        </>
    );
}
