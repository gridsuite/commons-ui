/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { ConnectivityNetworkProps } from '../../common/connectivity/connectivity.type';
import { BranchConnectivityForm } from '../../common/connectivity/BranchConnectivityForm';
import { BranchActiveReactivePowerMeasurementsForm } from '../../common/measurements/BranchActiveReactivePowerMeasurementsForm';
import { LimitsPane } from '../../common/currentLimits/LimitsPane';
import { GridSection } from '../../../../components';
import { TwoWindingsTransformerMapInfos } from './twoWindingsTransformer.types';
import { TwoWindingsTransformerDialogTab } from './twoWindingsTransformer.utils';
import { BranchInfos } from '../../line';
import { RatioTapChangerPane } from '../tapChanger/ratioTapChanger/RatioTapChangerPane';
import { PhaseTapChangerPane } from '../tapChanger/phaseTapChanger/PhaseTapChangerPane';
import { TwoWindingsTransformerCharacteristicsPane } from '../characteristics';
import { TwoWindingsTransformerModificationDto } from '../modification';
import { EquipmentType, Identifiable } from '../../../../utils';

export interface TwoWindingsTransformerDialogTabsContentProps extends ConnectivityNetworkProps {
    twtToModify?: TwoWindingsTransformerMapInfos | null;
    isModification?: boolean;
    tabIndex: number;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    editData?: TwoWindingsTransformerModificationDto;
}

export function TwoWindingsTransformerDialogTabsContent({
    twtToModify,
    isModification = false,
    tabIndex,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    fetchVoltageLevelEquipments,
    editData,
}: Readonly<TwoWindingsTransformerDialogTabsContentProps>) {
    return (
        <>
            <Box hidden={tabIndex !== TwoWindingsTransformerDialogTab.CONNECTIVITY_TAB}>
                <GridSection title="ConnectivityTab" />
                <BranchConnectivityForm
                    isModification={isModification}
                    previousValues={twtToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                />
            </Box>
            <Box hidden={tabIndex !== TwoWindingsTransformerDialogTab.CHARACTERISTICS_TAB}>
                <TwoWindingsTransformerCharacteristicsPane twtToModify={twtToModify} isModification={isModification} />
            </Box>
            <Box hidden={tabIndex !== TwoWindingsTransformerDialogTab.LIMITS_TAB}>
                <LimitsPane equipmentToModify={twtToModify as BranchInfos} isModification={isModification} />
            </Box>
            {isModification && (
                <Box hidden={tabIndex !== TwoWindingsTransformerDialogTab.STATE_ESTIMATION_TAB}>
                    <BranchActiveReactivePowerMeasurementsForm equipmentToModify={twtToModify} />
                </Box>
            )}
            <Box hidden={tabIndex !== TwoWindingsTransformerDialogTab.RATIO_TAP_TAB}>
                <RatioTapChangerPane
                    voltageLevelOptions={voltageLevelOptions}
                    previousValues={twtToModify ?? undefined}
                    editData={editData}
                    isModification={isModification}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                />
            </Box>
            <Box hidden={tabIndex !== TwoWindingsTransformerDialogTab.PHASE_TAP_TAB}>
                <PhaseTapChangerPane
                    voltageLevelOptions={voltageLevelOptions}
                    previousValues={twtToModify ?? undefined}
                    editData={editData}
                    isModification={isModification}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                />
            </Box>
        </>
    );
}
