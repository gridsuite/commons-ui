/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, Stack, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ProviderParam, UseTabsReturn } from '../common';
import { getTabStyle, parametersStyles } from '../parameters-style';
import { TabPanel } from '../common/parameters';
import TimeDelayParameters from './time-delay-parameters';
import LoadsVariationsParameters from './loads-variations-parameters';

import { TabValues } from './dynamic-margin-calculation.type';
import { UseComputationParametersFormReturn } from '../common/utils';

type DynamicMarginCalculationFormProps = {
    dynamicMarginCalculationMethods: UseComputationParametersFormReturn;
    useTabsReturn: UseTabsReturn<TabValues>;
};

export function DynamicMarginCalculationForm({
    dynamicMarginCalculationMethods,
    useTabsReturn,
}: Readonly<DynamicMarginCalculationFormProps>) {
    const { formattedProviders } = dynamicMarginCalculationMethods;
    const { selectedTab, tabsWithError, onTabChange } = useTabsReturn;

    return (
        <Stack sx={parametersStyles.scrollableGrid}>
            <Grid size={12}>
                <ProviderParam options={formattedProviders} />
            </Grid>
            <Grid size={12}>
                <Tabs value={selectedTab} variant="scrollable" onChange={onTabChange} aria-label="parameters">
                    <Tab
                        label={<FormattedMessage id="DynamicMarginCalculationTimeDelayTab" />}
                        value={TabValues.TAB_TIME_DELAY}
                        sx={getTabStyle(tabsWithError, TabValues.TAB_TIME_DELAY)}
                    />
                    <Tab
                        label={<FormattedMessage id="DynamicMarginCalculationLoadsVariationsTab" />}
                        value={TabValues.TAB_LOADS_VARIATIONS}
                        sx={getTabStyle(tabsWithError, TabValues.TAB_LOADS_VARIATIONS)}
                    />
                </Tabs>
            </Grid>
            <Grid container size={12} key="dmcParameters" sx={{ paddingTop: 0, width: '100%', maxHeight: '100%' }}>
                <TabPanel value={selectedTab} index={TabValues.TAB_TIME_DELAY}>
                    <TimeDelayParameters path={TabValues.TAB_TIME_DELAY} />
                </TabPanel>
                <TabPanel value={selectedTab} index={TabValues.TAB_LOADS_VARIATIONS}>
                    <LoadsVariationsParameters path={TabValues.TAB_LOADS_VARIATIONS} />
                </TabPanel>
            </Grid>
        </Stack>
    );
}
