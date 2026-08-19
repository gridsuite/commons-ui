/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { getTabStyle } from '../../../parameters/parameters-style';
import { StaticVarCompensatorDialogTab } from './static-var-compensator-tab-utils';

export interface StaticVarCompensatorCreationDialogTabsProps {
    tabIndex: number;
    tabIndexesWithError: StaticVarCompensatorDialogTab[];
    setTabIndex: (newValue: StaticVarCompensatorDialogTab) => void;
}

export function StaticVarCompensatorDialogTabs({
    tabIndex,
    tabIndexesWithError,
    setTabIndex,
}: StaticVarCompensatorCreationDialogTabsProps) {
    return (
        <Grid container sx={{ width: '100%' }}>
            <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)}>
                <Tab
                    label={<FormattedMessage id="ConnectivityTab" />}
                    sx={getTabStyle(tabIndexesWithError, StaticVarCompensatorDialogTab.CONNECTIVITY_TAB)}
                />
                <Tab
                    label={<FormattedMessage id="SetpointsAndLimitsTab" />}
                    sx={getTabStyle(tabIndexesWithError, StaticVarCompensatorDialogTab.SET_POINTS_LIMITS_TAB)}
                />
                <Tab
                    label={<FormattedMessage id="StaticVarCompensatorAutomatonTab" />}
                    sx={getTabStyle(tabIndexesWithError, StaticVarCompensatorDialogTab.AUTOMATON_TAB)}
                />
                <Tab
                    label={<FormattedMessage id="StaticVarCompensatorAdditionalInfosTab" />}
                    sx={getTabStyle(tabIndexesWithError, StaticVarCompensatorDialogTab.ADDITIONAL_INFO_TAB)}
                />
            </Tabs>
        </Grid>
    );
}
