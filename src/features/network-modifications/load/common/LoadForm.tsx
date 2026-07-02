/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, Stack } from '@mui/material';
import { LOAD_TAB_FIELDS, LoadDialogTab } from './load.utils';
import { LoadDialogHeader, LoadDialogHeaderProps } from './LoadDialogHeader';
import { LoadDialogTabs } from './LoadDialogTabs';
import { LoadDialogTabsContent, LoadDialogTabsContentProps } from './LoadDialogTabsContent';
import { useTabsWithError } from '../../hooks';

interface LoadFormProps
    extends LoadDialogHeaderProps,
        Omit<LoadDialogTabsContentProps, 'tabIndex' | 'isModification' | 'loadToModify'> {}

export function LoadForm({
    loadToModify,
    isModification,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
}: Readonly<LoadFormProps>) {
    const { tabIndex, setTabIndex, tabIndexesWithError } = useTabsWithError<LoadDialogTab>(
        LOAD_TAB_FIELDS,
        LoadDialogTab.CONNECTIVITY_TAB
    );

    return (
        <Stack spacing={2}>
            <Grid>
                <LoadDialogHeader loadToModify={loadToModify} isModification={isModification} />
            </Grid>
            <Grid>
                <LoadDialogTabs
                    tabIndex={tabIndex}
                    tabIndexesWithError={tabIndexesWithError}
                    setTabIndex={setTabIndex}
                    isModification={isModification}
                />
            </Grid>
            <Grid>
                <LoadDialogTabsContent
                    tabIndex={tabIndex}
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
