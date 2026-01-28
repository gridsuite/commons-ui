/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode } from 'react';
import { Grid, LinearProgress, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { UseDynamicMarginCalculationParametersFormReturn } from './use-dynamic-margin-calculation-parameters-form';
import { mergeSx } from '../../../utils';
import { CustomFormProvider } from '../../inputs';
import { ProviderParam } from '../common';
import { getTabStyle, parametersStyles } from '../parameters-style';
import { TabPanel } from '../common/parameters';
import TimeDelayParameters from './time-delay-parameters';
import LoadsVariationsParameters from './loads-variations-parameters';

import { TabValues } from './dynamic-margin-calculation.type';

type DynamicMarginCalculationFormProps = {
    dynamicMarginCalculationMethods: UseDynamicMarginCalculationParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
};

export function DynamicMarginCalculationForm({
    dynamicMarginCalculationMethods,
    renderTitleFields,
    renderActions,
}: Readonly<DynamicMarginCalculationFormProps>) {
    const { formMethods, formSchema, paramsLoaded, formattedProviders, selectedTab, onTabChange, tabsWithError } =
        dynamicMarginCalculationMethods;
    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods}>
            {renderTitleFields?.()}
            {paramsLoaded ? (
                <Grid sx={{ height: '100%' }}>
                    <ProviderParam options={formattedProviders} />
                    <Grid
                        key="dmcParameters"
                        sx={mergeSx(parametersStyles.scrollableGrid, {
                            height: '100%',
                            paddingTop: 0,
                        })}
                    >
                        <Grid item width="100%">
                            <Tabs
                                value={selectedTab}
                                variant="scrollable"
                                onChange={onTabChange}
                                aria-label="parameters"
                            >
                                <Tab
                                    label={<FormattedMessage id="DynamicMarginCalculationTimeDelay" />}
                                    value={TabValues.TAB_TIME_DELAY}
                                    sx={getTabStyle(tabsWithError, TabValues.TAB_TIME_DELAY)}
                                />
                                <Tab
                                    label={<FormattedMessage id="DynamicMarginCalculationLoadsVariations" />}
                                    value={TabValues.TAB_LOADS_VARIATIONS}
                                    sx={getTabStyle(tabsWithError, TabValues.TAB_LOADS_VARIATIONS)}
                                />
                            </Tabs>
                            <TabPanel value={selectedTab} index={TabValues.TAB_TIME_DELAY}>
                                <TimeDelayParameters path={TabValues.TAB_TIME_DELAY} />
                            </TabPanel>
                            <TabPanel value={selectedTab} index={TabValues.TAB_LOADS_VARIATIONS}>
                                <LoadsVariationsParameters path={TabValues.TAB_LOADS_VARIATIONS} />
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
            ) : (
                <LinearProgress />
            )}
            {renderActions?.()}
        </CustomFormProvider>
    );
}
