/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { LineDialogTab } from './line.utils';
import { LineDialogHeader, LineDialogHeaderProps } from './LineDialogHeader';
import { LineDialogTabs } from './LineDialogTabs';
import { LineDialogTabsContent, LineDialogTabsContentProps } from './LineDialogTabsContent';
import { useCustomFormContext } from '../../../../components';
import { ReadOnlyBoundary } from '../../../../components/ui/reactHookForm/provider/ReadOnlyBoundary';
import { UseTabsReturn } from '../../../../hooks';
import { tabbedFormStyles } from '../../common';

interface LineFormProps
    extends LineDialogHeaderProps, Omit<LineDialogTabsContentProps, 'tabIndex' | 'isModification' | 'lineToModify'> {
    useTabsReturn: UseTabsReturn<LineDialogTab>;
}

export function LineForm({
    lineToModify,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    isModification = false,
    withConnectivity = true,
    useTabsReturn,
}: Readonly<LineFormProps>) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;
    const { readOnly } = useCustomFormContext();

    return (
        <Stack spacing={2} sx={tabbedFormStyles.container}>
            <LineDialogHeader lineToModify={lineToModify} isModification={isModification} />
            <LineDialogTabs
                tabIndex={selectedTab}
                tabIndexesWithError={tabsWithError}
                onTabChange={onTabChange}
                isModification={isModification}
                withConnectivity={withConnectivity}
            />
            <Box sx={tabbedFormStyles.scrollableContent}>
                <ReadOnlyBoundary readOnly={readOnly}>
                    <LineDialogTabsContent
                        tabIndex={selectedTab}
                        lineToModify={lineToModify}
                        voltageLevelOptions={voltageLevelOptions}
                        fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                        PositionDiagramPane={PositionDiagramPane}
                        isModification={isModification}
                        withConnectivity={withConnectivity}
                    />
                </ReadOnlyBoundary>
            </Box>
        </Stack>
    );
}
