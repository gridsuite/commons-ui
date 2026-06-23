/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode } from 'react';
import { Grid, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { FieldValues } from 'react-hook-form';
import { mergeSx } from '../../../utils';
import { ProviderParam, ParameterLayout, ParameterActions } from '../common';
import { useTabs } from '../common/hook/use-tabs';
import { getTabStyle, parametersStyles } from '../parameters-style';
import { TabPanel } from '../common/parameters';
import TimeDelayParameters from './time-delay-parameters';
import LoadsVariationsParameters from './loads-variations-parameters';

import { TabValues } from './dynamic-margin-calculation.type';
import { UseComputationParametersFormReturn } from '../common/utils';

type DynamicMarginCalculationFormProps = {
    dynamicMarginCalculationMethods: UseComputationParametersFormReturn;
    onSubmit: (formData: FieldValues) => void;
    renderTitleFields?: () => ReactNode;
    actions?: ParameterActions;
};

export function DynamicMarginCalculationForm({
    dynamicMarginCalculationMethods,
    onSubmit,
    renderTitleFields,
    actions,
}: Readonly<DynamicMarginCalculationFormProps>) {
    const { paramsLoaded, formattedProviders, formMethods } = dynamicMarginCalculationMethods;
    const { handleSubmit } = formMethods;

    const { selectedTab, tabsWithError, onTabChange, onError } = useTabs({
        defaultTab: Object.values(TabValues)[0],
        tabEnum: TabValues,
    });
    return (
        <ParameterLayout
            title="DynamicMarginCalculation"
            header={
                <>
                    {renderTitleFields?.()}
                    {paramsLoaded && (
                        <>
                            <ProviderParam options={formattedProviders} />
                            <Tabs
                                value={selectedTab}
                                variant="scrollable"
                                onChange={onTabChange}
                                aria-label="parameters"
                            >
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
                        </>
                    )}
                </>
            }
            isLoading={!paramsLoaded}
            actions={{
                ...actions,
                validateOnClick: handleSubmit(onSubmit, onError),
            }}
        >
            <Grid
                container
                xs
                key="dmcParameters"
                sx={mergeSx(parametersStyles.scrollableGrid, {
                    paddingTop: 0,
                    width: '100%',
                    maxHeight: '100%',
                })}
            >
                <TabPanel value={selectedTab} index={TabValues.TAB_TIME_DELAY}>
                    <TimeDelayParameters path={TabValues.TAB_TIME_DELAY} />
                </TabPanel>
                <TabPanel value={selectedTab} index={TabValues.TAB_LOADS_VARIATIONS}>
                    <LoadsVariationsParameters path={TabValues.TAB_LOADS_VARIATIONS} />
                </TabPanel>
            </Grid>
        </ParameterLayout>
    );
}
