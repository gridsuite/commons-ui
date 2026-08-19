/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { VscHvdcLineDialogTab } from './vscHvdcLine.utils';
import { VscHvdcLineInfo } from './vscHvdcLine.types';
import { ConnectivityNetworkProps } from '../../../common/connectivity';
import { GridSection } from '../../../../../components';
import { PowerMeasurementsForm } from '../../../common/measurements';
import { VscConverterStationPane } from './converterStation/VscConverterStationPane';
import { FieldConstants } from '../../../../../utils';
import { VscHvdcLinePane } from './line/VscHvdcLinePane';
import { UpdateReactiveCapabilityCurveTableConverterStation } from './converterStation';

export interface VscHvdcLineDialogTabsContentProps extends ConnectivityNetworkProps {
    hvdcLineToModify?: VscHvdcLineInfo | null;
    tabIndex: number;
    updatePreviousReactiveCapabilityCurveTableConverterStation: UpdateReactiveCapabilityCurveTableConverterStation;
    isModification?: boolean;
}

export function VscHvdcLineDialogTabsContent({
    hvdcLineToModify,
    isModification = false,
    tabIndex,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    updatePreviousReactiveCapabilityCurveTableConverterStation,
}: Readonly<VscHvdcLineDialogTabsContentProps>) {
    return (
        <>
            <Box hidden={tabIndex !== VscHvdcLineDialogTab.HVDC_LINE_TAB}>
                <VscHvdcLinePane hvdcLineToModify={hvdcLineToModify} isModification={isModification} />
            </Box>
            <Box hidden={tabIndex !== VscHvdcLineDialogTab.CONVERTER_STATION_1_TAB}>
                <VscConverterStationPane
                    id={FieldConstants.CONVERTER_STATION_1}
                    stationLabel={'converterStation1'}
                    stationToModify={hvdcLineToModify?.converterStation1}
                    isModification={isModification}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    updatePreviousReactiveCapabilityCurveTableConverterStation={(action, index) => {
                        updatePreviousReactiveCapabilityCurveTableConverterStation(
                            action,
                            index,
                            FieldConstants.CONVERTER_STATION_1
                        );
                    }}
                />
            </Box>
            <Box hidden={tabIndex !== VscHvdcLineDialogTab.CONVERTER_STATION_2_TAB}>
                <VscConverterStationPane
                    id={FieldConstants.CONVERTER_STATION_2}
                    stationLabel={'converterStation2'}
                    stationToModify={hvdcLineToModify?.converterStation2}
                    isModification={isModification}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    updatePreviousReactiveCapabilityCurveTableConverterStation={(action, index) => {
                        updatePreviousReactiveCapabilityCurveTableConverterStation(
                            action,
                            index,
                            FieldConstants.CONVERTER_STATION_2
                        );
                    }}
                />
            </Box>
            {isModification && (
                <Box hidden={tabIndex !== VscHvdcLineDialogTab.STATE_ESTIMATION_TAB}>
                    <GridSection title="MeasurementsSection" />
                    <GridSection title={'converterStation1'} />
                    <PowerMeasurementsForm
                        activePowerMeasurement={hvdcLineToModify?.converterStation1?.measurementP}
                        reactivePowerMeasurement={hvdcLineToModify?.converterStation1?.measurementQ}
                        idPrefix={FieldConstants.CONVERTER_STATION_1}
                    />
                    <GridSection title={'converterStation2'} />
                    <PowerMeasurementsForm
                        activePowerMeasurement={hvdcLineToModify?.converterStation2?.measurementP}
                        reactivePowerMeasurement={hvdcLineToModify?.converterStation2?.measurementQ}
                        idPrefix={FieldConstants.CONVERTER_STATION_2}
                    />
                </Box>
            )}
        </>
    );
}
