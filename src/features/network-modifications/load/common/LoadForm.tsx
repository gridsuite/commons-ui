/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Stack } from '@mui/material';
import { LoadDialogTab } from './load.utils';
import { LoadDialogHeader, LoadDialogHeaderProps } from './LoadDialogHeader';
import { LoadDialogTabs } from './LoadDialogTabs';
import { LoadDialogTabsContent, LoadDialogTabsContentProps } from './LoadDialogTabsContent';
import { UseTabsReturn } from '../../../../hooks';

interface LoadFormProps
    extends LoadDialogHeaderProps, Omit<LoadDialogTabsContentProps, 'tabIndex' | 'isModification' | 'loadToModify'> {
    useTabsReturn: UseTabsReturn<LoadDialogTab>;
}

export function LoadForm({
    loadToModify,
    isModification,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    useTabsReturn,
}: Readonly<LoadFormProps>) {
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack spacing={2}>
            <Grid>
                <LoadDialogHeader loadToModify={loadToModify} isModification={isModification} />
            </Grid>
            <Grid>
                <LoadDialogTabs
                    tabIndex={selectedTab}
                    tabIndexesWithError={tabsWithError}
                    onTabChange={onTabChange}
                    isModification={isModification}
                />
            </Grid>
            <Grid>
                <LoadDialogTabsContent
                    tabIndex={selectedTab}
                    loadToModify={loadToModify}
                    isModification={isModification}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                />
            </Grid>
        </Stack>
    );
}
