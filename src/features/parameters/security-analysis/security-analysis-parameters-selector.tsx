/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent, useEffect, useMemo } from 'react';

import { FormattedMessage } from 'react-intl';

import { Grid2 as Grid, Tab, Tabs } from '@mui/material';
import { ILimitReductionsByVoltageLevel, LimitReductionsTableForm, TAB_INFO, TabPanel, TabValues } from '../common';
import { PARAM_PROVIDER_OPENLOADFLOW } from '../loadflow';
import { ViolationsHidingParameters } from './security-analysis-violations-hiding';
import { SAParametersEnriched } from '../../../utils/types';
import { getTabStyle } from '../parameters-style';

export function SecurityAnalysisParametersSelector({
    params,
    currentProvider,
    isDeveloperMode,
    defaultLimitReductions,
    selectedTab,
    setSelectedTab,
    handleTabChange,
    tabIndexesWithError,
}: Readonly<{
    params: SAParametersEnriched | null;
    currentProvider?: string;
    isDeveloperMode: boolean;
    defaultLimitReductions: ILimitReductionsByVoltageLevel[];
    selectedTab: TabValues;
    setSelectedTab: (tab: TabValues) => void;
    handleTabChange: (event: SyntheticEvent, newValue: TabValues) => void;
    tabIndexesWithError: TabValues[];
}>) {
    const tabValue = useMemo(() => {
        return selectedTab === TabValues.LimitReductions && !params?.limitReductions ? TabValues.General : selectedTab;
    }, [params, selectedTab]);

    useEffect(() => {
        if (currentProvider !== PARAM_PROVIDER_OPENLOADFLOW) {
            setSelectedTab(TabValues.General);
        }
    }, [currentProvider, setSelectedTab]);

    return (
        <Grid sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                {TAB_INFO.filter((t) => isDeveloperMode || !t.developerModeOnly).map(
                    (tab, index) =>
                        (tab.label !== TabValues[TabValues.LimitReductions] ||
                            (currentProvider === PARAM_PROVIDER_OPENLOADFLOW && params?.limitReductions)) && (
                            <Tab
                                key={tab.label}
                                label={<FormattedMessage id={tab.label} />}
                                value={index}
                                sx={getTabStyle(tabIndexesWithError, index, tabValue)}
                            />
                        )
                )}
            </Tabs>

            {TAB_INFO.filter((t) => isDeveloperMode || !t.developerModeOnly).map((tab, index) => (
                <TabPanel key={tab.label} value={tabValue} index={index}>
                    {tabValue === TabValues.General && <ViolationsHidingParameters />}
                    {tabValue === TabValues.LimitReductions &&
                        currentProvider === PARAM_PROVIDER_OPENLOADFLOW &&
                        params?.limitReductions && (
                            <Grid sx={{ width: '100%' }}>
                                <LimitReductionsTableForm limits={params?.limitReductions ?? defaultLimitReductions} />
                            </Grid>
                        )}
                </TabPanel>
            ))}
        </Grid>
    );
}
