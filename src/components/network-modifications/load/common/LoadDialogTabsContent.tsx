/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import React from 'react';
import { LoadDialogTab } from './load.utils';
import { PowerMeasurementsForm } from '../../common/measurements/PowerMeasurementsForm';
import { LoadFormInfos, PositionDiagramPaneType } from './load.types';
import GridSection from '../../../grid/grid-section';
import { Identifiable } from '../../../../utils';
import { ConnectivityForm, PropertiesForm, SetPointsForm } from '../../common';

export interface LoadDialogTabsContentProps {
    loadToModify?: LoadFormInfos | null;
    isModification?: boolean;
    tabIndex: number;
    voltageLevelOptions?: Identifiable[];
    PositionDiagramPane?: PositionDiagramPaneType;
    fetchBusesOrBusbarSections?: (voltageLevelId: string) => Promise<Identifiable[]>;
}

export function LoadDialogTabsContent({
    loadToModify,
    isModification = false,
    tabIndex,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
}: Readonly<LoadDialogTabsContentProps>) {
    return (
        <>
            <Box hidden={tabIndex !== LoadDialogTab.CONNECTIVITY_TAB} p={1}>
                <ConnectivityForm
                    voltageLevelOptions={voltageLevelOptions}
                    withPosition
                    isEquipmentModification={isModification}
                    previousValues={{
                        connectablePosition: loadToModify?.connectablePosition,
                        voltageLevelId: loadToModify?.voltageLevelId,
                        busOrBusbarSectionId: loadToModify?.busOrBusbarSectionId,
                        terminalConnected: loadToModify?.terminalConnected,
                    }}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                />
            </Box>
            <Box hidden={tabIndex !== LoadDialogTab.CHARACTERISTICS_TAB} p={1} sx={{ marginTop: -4 }}>
                <SetPointsForm
                    previousValues={{
                        activePower: loadToModify?.p0,
                        reactivePower: loadToModify?.q0,
                    }}
                    isModification={isModification}
                />
                <PropertiesForm networkElementType="load" isModification={isModification} />
            </Box>
            {isModification && (
                <Box hidden={tabIndex !== LoadDialogTab.STATE_ESTIMATION_TAB} p={1} sx={{ marginTop: -4 }}>
                    <GridSection title="MeasurementsSection" />
                    <PowerMeasurementsForm
                        activePowerMeasurement={loadToModify?.measurementP}
                        reactivePowerMeasurement={loadToModify?.measurementQ}
                    />
                </Box>
            )}
        </>
    );
}
