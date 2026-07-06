/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid } from '@mui/material';
import { LINE_TAB_FIELDS, LineDialogTab } from './line.utils';
import { LineDialogHeader, LineDialogHeaderProps } from './LineDialogHeader';
import { LineDialogTabs } from './LineDialogTabs';
import { LineDialogTabsContent, LineDialogTabsContentProps } from './LineDialogTabsContent';
import { useTabsWithError } from '../../hooks';

interface LineFormProps
    extends LineDialogHeaderProps, Omit<LineDialogTabsContentProps, 'tabIndex' | 'isModification' | 'lineToModify'> {}

export function LineForm({
    lineToModify,
    voltageLevelOptions,
    fetchBusesOrBusbarSections,
    PositionDiagramPane,
    isModification = false,
    withConnectivity = true,
    clearableFields = false,
}: Readonly<LineFormProps>) {
    const { tabIndex, setTabIndex, tabIndexesWithError } = useTabsWithError<LineDialogTab>(
        LINE_TAB_FIELDS,
        withConnectivity ? LineDialogTab.CONNECTIVITY_TAB : LineDialogTab.CHARACTERISTICS_TAB
    );

    return (
        <Grid container direction="column" wrap="nowrap" sx={{ height: '100%', gap: 2 }}>
            <Grid sx={{ flexShrink: 0 }}>
                <LineDialogHeader lineToModify={lineToModify} isModification={isModification} />
            </Grid>
            <Grid sx={{ flexShrink: 0 }}>
                <LineDialogTabs
                    tabIndex={tabIndex}
                    tabIndexesWithError={tabIndexesWithError}
                    setTabIndex={setTabIndex}
                    isModification={isModification}
                    withConnectivity={withConnectivity}
                />
            </Grid>
            <Grid sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <LineDialogTabsContent
                    tabIndex={tabIndex}
                    lineToModify={lineToModify}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    PositionDiagramPane={PositionDiagramPane}
                    isModification={isModification}
                    withConnectivity={withConnectivity}
                    clearableFields={clearableFields}
                />
            </Grid>
        </Grid>
    );
}
