/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, Stack } from '@mui/material';
import { ConnectivityNetworkProps } from '../../common';
import {
    STATIC_VAR_COMPENSATOR_TAB_FIELDS,
    StaticVarCompensatorDialogTab,
} from '../common/static-var-compensator-tab-utils';
import { StaticVarCompensatorDialogHeader, StaticVarCompensatorDialogTabs } from '../common';
import { StaticVarCompensatorTabsContent } from '../common/static-var-compensator-tabs-content';
import { EquipmentType, Identifiable } from '../../../../utils';
import { useTabsWithError } from '../../hooks';

export interface StaticVarCompensatorCreationFormProps extends ConnectivityNetworkProps {
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function StaticVarCompensatorCreationForm({
    voltageLevelOptions,
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
    fetchVoltageLevelEquipments,
}: StaticVarCompensatorCreationFormProps) {
    const { tabIndex, setTabIndex, tabIndexesWithError } = useTabsWithError<StaticVarCompensatorDialogTab>(
        STATIC_VAR_COMPENSATOR_TAB_FIELDS,
        StaticVarCompensatorDialogTab.CONNECTIVITY_TAB
    );
    return (
        <Stack spacing={2}>
            <Grid>
                <StaticVarCompensatorDialogHeader />
            </Grid>
            <Grid>
                <StaticVarCompensatorDialogTabs
                    tabIndex={tabIndex}
                    tabIndexesWithError={tabIndexesWithError}
                    setTabIndex={setTabIndex}
                />
            </Grid>
            <Grid>
                <StaticVarCompensatorTabsContent
                    voltageLevelOptions={voltageLevelOptions}
                    PositionDiagramPane={PositionDiagramPane}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                    tabIndex={tabIndex}
                />
            </Grid>
        </Stack>
    );
}
