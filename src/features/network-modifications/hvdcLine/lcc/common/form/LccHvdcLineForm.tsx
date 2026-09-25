/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { mergeSx } from '../../../../../../utils';
import { ConnectivityNetworkProps, tabbedFormStyles } from '../../../../common';
import { UseTabsReturn } from '../../../../../../hooks';
import { LccHvdcLineDialogHeader } from './LccHvdcLineDialogHeader';
import { LccHvdcLineDialogTabsContent } from './LccHvdcLineDialogTabsContent';
import { LccHvdcLineDialogTabs } from './LccHvdcLineDialogTabs';
import { LccHvdcLineDialogTab, LccHvdcLineFormInfos } from '../lccHvdcLine.types';

interface LccCreationFormProps extends ConnectivityNetworkProps {
    useTabsReturn: UseTabsReturn<LccHvdcLineDialogTab>;
    isModification?: boolean;
    lccHvdcLineToModify?: LccHvdcLineFormInfos | null;
}
export function LccHvdcLineForm({
    lccHvdcLineToModify,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    isModification = false,
    useTabsReturn,
}: Readonly<LccCreationFormProps>) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack spacing={2} sx={tabbedFormStyles.container}>
            <LccHvdcLineDialogHeader lccHvdcLineToModify={lccHvdcLineToModify} isModification={isModification} />
            <LccHvdcLineDialogTabs
                tabIndex={selectedTab}
                tabIndexesWithError={tabsWithError}
                onTabChange={onTabChange}
            />
            <Box sx={mergeSx(tabbedFormStyles.scrollableContent, { paddingLeft: 1.5 })}>
                <LccHvdcLineDialogTabsContent
                    tabIndex={selectedTab}
                    isModification={isModification}
                    lccHvdcLineToModify={lccHvdcLineToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                />
            </Box>
        </Stack>
    );
}
