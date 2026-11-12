/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { UseTabsReturn } from '../../../../hooks';
import { EquipmentType, Identifiable } from '../../../../utils';
import { ConnectivityNetworkProps, tabbedFormStyles } from '../../common';
import { StaticVarCompensatorDialogHeader } from '../common/static-var-compensator-dialog-header';
import { StaticVarCompensatorDialogTabs } from '../common/static-var-compensator-dialog-tabs';
import { StaticVarCompensatorTabsContent } from '../common/static-var-compensator-tabs-content';
import { StaticVarCompensatorDialogTab } from '../common/static-var-compensator-tab-utils';
import { StaticVarCompensatorFormInfo } from '../common/static-var-compensator.types';

export interface StaticVarCompensatorModificationFormProps extends ConnectivityNetworkProps {
    staticVarCompensatorToModify?: StaticVarCompensatorFormInfo | null;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    useTabsReturn: UseTabsReturn<StaticVarCompensatorDialogTab>;
}

export function StaticVarCompensatorModificationForm({
    staticVarCompensatorToModify,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    fetchVoltageLevelEquipments,
    useTabsReturn,
}: Readonly<StaticVarCompensatorModificationFormProps>) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack spacing={2} sx={tabbedFormStyles.container}>
            <StaticVarCompensatorDialogHeader
                isEquipmentModification
                previousName={staticVarCompensatorToModify?.name ?? undefined}
            />
            <StaticVarCompensatorDialogTabs
                tabIndex={selectedTab}
                tabIndexesWithError={tabsWithError}
                onTabChange={onTabChange}
                showAutomatonTab={false}
            />
            <Box sx={tabbedFormStyles.scrollableContent}>
                <StaticVarCompensatorTabsContent
                    isEquipmentModification
                    previousValues={staticVarCompensatorToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                    tabIndex={selectedTab}
                />
            </Box>
        </Stack>
    );
}
