/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo } from 'react';

import { FormattedMessage } from 'react-intl';

import { Grid2 as Grid, Tab, Tabs } from '@mui/material';
import { LimitReductionsTableForm, TAB_INFO, TabPanel, TabValues } from '../common';
import { PARAM_PROVIDER_OPENLOADFLOW } from '../loadflow';
import { ViolationsHidingParameters } from './security-analysis-violations-hiding';
import { getTabStyle } from '../parameters-style';
import { UseSecurityAnalysisParametersFormReturn } from './use-security-analysis-parameters-form';

export function SecurityAnalysisParametersSelector({
    securityAnalysisMethods,
    isDeveloperMode,
}: Readonly<{
    securityAnalysisMethods: UseSecurityAnalysisParametersFormReturn;
    isDeveloperMode: boolean;
}>) {
    const {
        params,
        watchProvider,
        defaultLimitReductions,
        selectedTab,
        handleTabChange,
        setSelectedTab,
        tabIndexesWithError,
    } = securityAnalysisMethods;
    const currentProvider = watchProvider?.trim();

    const isLimitReductionsTabAvailable = currentProvider === PARAM_PROVIDER_OPENLOADFLOW && params?.limitReductions;

    useEffect(() => {
        if (currentProvider !== PARAM_PROVIDER_OPENLOADFLOW) {
            setSelectedTab(TabValues.General);
        }
    }, [currentProvider, setSelectedTab]);

    const availableTabs = useMemo(
        () => TAB_INFO.filter((t) => isDeveloperMode || !t.developerModeOnly),
        [isDeveloperMode]
    );

    return (
        <Grid sx={{ width: '100%' }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
                {availableTabs.map(
                    (tab) =>
                        (tab.label !== TabValues.LimitReductions || isLimitReductionsTabAvailable) && (
                            <Tab
                                key={tab.label}
                                label={<FormattedMessage id={tab.label} />}
                                value={tab.label}
                                sx={getTabStyle(tabIndexesWithError, tab.label)}
                            />
                        )
                )}
            </Tabs>

            {availableTabs.map((tab) => (
                <TabPanel key={tab.label} value={selectedTab} index={tab.label}>
                    {selectedTab === TabValues.General && <ViolationsHidingParameters />}
                    {selectedTab === TabValues.LimitReductions && isLimitReductionsTabAvailable && (
                        <Grid sx={{ width: '100%' }}>
                            <LimitReductionsTableForm limits={params?.limitReductions ?? defaultLimitReductions} />
                        </Grid>
                    )}
                </TabPanel>
            ))}
        </Grid>
    );
}
