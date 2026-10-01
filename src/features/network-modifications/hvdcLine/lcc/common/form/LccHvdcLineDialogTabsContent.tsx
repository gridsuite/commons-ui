/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { ConnectivityNetworkProps } from '../../../../common';
import { FieldConstants } from '../../../../../../utils';
import { LccHvdcLine } from './LccHvdcLine';
import { LccConverterStation } from './LccConverterStation';
import { LccHvdcLineDialogTab, LccHvdcLineFormInfos } from '../lccHvdcLine.types';

export interface LccHvdcLineDialogTabsContentProps extends ConnectivityNetworkProps {
    lccHvdcLineToModify?: LccHvdcLineFormInfos | null;
    tabIndex: number;
    isModification?: boolean;
}

export function LccHvdcLineDialogTabsContent({
    lccHvdcLineToModify,
    isModification = false,
    tabIndex,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
}: Readonly<LccHvdcLineDialogTabsContentProps>) {
    return (
        <>
            <Box hidden={tabIndex !== LccHvdcLineDialogTab.HVDC_LINE_TAB} sx={{ p: 1 }}>
                <LccHvdcLine
                    lccHvdcLineToModify={lccHvdcLineToModify}
                    isModification={isModification}
                    id={FieldConstants.HVDC_LINE_TAB}
                />
            </Box>
            <Box hidden={tabIndex !== LccHvdcLineDialogTab.CONVERTER_STATION_1_TAB} sx={{ p: 1 }}>
                <LccConverterStation
                    id={FieldConstants.CONVERTER_STATION_1}
                    stationLabel="converterStation1"
                    stationToModify={lccHvdcLineToModify?.lccConverterStation1}
                    isModification={isModification}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                />
            </Box>
            <Box hidden={tabIndex !== LccHvdcLineDialogTab.CONVERTER_STATION_2_TAB} sx={{ p: 1 }}>
                <LccConverterStation
                    id={FieldConstants.CONVERTER_STATION_2}
                    stationLabel="converterStation2"
                    stationToModify={lccHvdcLineToModify?.lccConverterStation2}
                    isModification={isModification}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                />
            </Box>
        </>
    );
}
