/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { ConnectivityNetworkProps } from '../../common';
import { StaticVarCompensatorDialogTab } from '../common/static-var-compensator-tab-utils';
import { StaticVarCompensatorDialogHeader, StaticVarCompensatorDialogTabs } from '../common';
import { StaticVarCompensatorTabsContent } from '../common/static-var-compensator-tabs-content';
import { EquipmentType, Identifiable } from '../../../../utils';
import { UseTabsReturn } from '../../../../hooks';

export interface StaticVarCompensatorCreationFormProps extends ConnectivityNetworkProps {
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    useTabsReturn: UseTabsReturn<StaticVarCompensatorDialogTab>;
}

export function StaticVarCompensatorCreationForm({
    voltageLevelOptions,
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    fetchVoltageLevelEquipments,
    useTabsReturn,
}: StaticVarCompensatorCreationFormProps) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack spacing={2}>
            <StaticVarCompensatorDialogHeader />
            <StaticVarCompensatorDialogTabs
                tabIndex={selectedTab}
                tabIndexesWithError={tabsWithError}
                onTabChange={onTabChange}
            />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: 3 }}>
                <StaticVarCompensatorTabsContent
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
