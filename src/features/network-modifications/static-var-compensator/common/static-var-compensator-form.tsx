/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { UseTabsReturn } from '../../../../hooks';
import { tabbedFormStyles } from '../../common';
import { StaticVarCompensatorDialogHeader } from './static-var-compensator-dialog-header';
import { StaticVarCompensatorDialogTabs } from './static-var-compensator-dialog-tabs';
import {
    StaticVarCompensatorTabsContent,
    StaticVarCompensatorTabsContentProps,
} from './static-var-compensator-tabs-content';
import { StaticVarCompensatorDialogTab } from './static-var-compensator-tab-utils';

export interface StaticVarCompensatorFormProps extends Omit<StaticVarCompensatorTabsContentProps, 'tabIndex'> {
    useTabsReturn: UseTabsReturn<StaticVarCompensatorDialogTab>;
}

export function StaticVarCompensatorForm({
    staticVarCompensatorToModify,
    isModification = false,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    fetchVoltageLevelEquipments,
    useTabsReturn,
}: Readonly<StaticVarCompensatorFormProps>) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack spacing={2} sx={tabbedFormStyles.container}>
            <StaticVarCompensatorDialogHeader
                isModification={isModification}
                staticVarCompensatorToModify={staticVarCompensatorToModify}
            />
            <StaticVarCompensatorDialogTabs
                tabIndex={selectedTab}
                tabIndexesWithError={tabsWithError}
                onTabChange={onTabChange}
                // TODO: the automaton tab of the modification is added in a next PR
                showAutomatonTab={!isModification}
            />
            <Box sx={tabbedFormStyles.scrollableContent}>
                <StaticVarCompensatorTabsContent
                    tabIndex={selectedTab}
                    isModification={isModification}
                    staticVarCompensatorToModify={staticVarCompensatorToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                />
            </Box>
        </Stack>
    );
}
