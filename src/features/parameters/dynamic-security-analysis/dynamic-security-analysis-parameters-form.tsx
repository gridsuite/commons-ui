/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, Stack, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import ScenarioParameters from './scenario-parameters';
import ContingencyParameters from './contingency-parameters';
import { ProviderParam, TabPanel, UseTabsReturn } from '../common';
import { getTabStyle, parametersStyles } from '../parameters-style';
import { TabValues } from './dynamic-security-analysis.type';
import { UseComputationParametersFormReturn } from '../common/utils';

type DynamicSecurityAnalysisParametersFormProps = {
    dynamicSecurityAnalysisMethods: UseComputationParametersFormReturn;
    useTabsReturn: UseTabsReturn<TabValues>;
};

export function DynamicSecurityAnalysisParametersForm({
    dynamicSecurityAnalysisMethods,
    useTabsReturn,
}: Readonly<DynamicSecurityAnalysisParametersFormProps>) {
    const { formattedProviders } = dynamicSecurityAnalysisMethods;
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack sx={parametersStyles.scrollableGrid}>
            <Grid size={12}>
                <ProviderParam options={formattedProviders} id="Dsa" />
            </Grid>
            <Grid size={12}>
                <Tabs value={selectedTab} variant="scrollable" onChange={onTabChange} aria-label="parameters">
                    <Tab
                        label={<FormattedMessage id="DynamicSecurityAnalysisScenario" />}
                        value={TabValues.SCENARIO}
                        sx={getTabStyle(tabsWithError, TabValues.SCENARIO)}
                    />
                    <Tab
                        label={<FormattedMessage id="DynamicSecurityAnalysisContingency" />}
                        value={TabValues.CONTINGENCY}
                        sx={getTabStyle(tabsWithError, TabValues.CONTINGENCY)}
                    />
                </Tabs>
            </Grid>
            <Grid container size={12} key="dsaParameters" sx={{ paddingTop: 0, width: '100%', maxHeight: '100%' }}>
                <TabPanel value={selectedTab} index={TabValues.SCENARIO}>
                    <ScenarioParameters path={TabValues.SCENARIO} />
                </TabPanel>
                <TabPanel value={selectedTab} index={TabValues.CONTINGENCY}>
                    <ContingencyParameters path={TabValues.CONTINGENCY} />
                </TabPanel>
            </Grid>
        </Stack>
    );
}
