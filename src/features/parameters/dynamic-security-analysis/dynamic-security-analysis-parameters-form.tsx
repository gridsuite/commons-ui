/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ReactNode } from 'react';

import ScenarioParameters from './scenario-parameters';
import ContingencyParameters from './contingency-parameters';
import { ProviderParam, TabPanel, ParameterLayout, ParameterActions } from '../common';
import { useTabs } from '../common/hook/use-tabs';
import { getTabStyle, parametersStyles } from '../parameters-style';
import { mergeSx } from '../../../utils';
import { TabValues } from './dynamic-security-analysis.type';
import { UseComputationParametersFormReturn } from '../common/utils';

type DynamicSecurityAnalysisParametersFormProps = {
    dynamicSecurityAnalysisMethods: UseComputationParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    actions?: ParameterActions;
    onSubmit: (formData: any) => void;
};

export function DynamicSecurityAnalysisParametersForm({
    dynamicSecurityAnalysisMethods,
    renderTitleFields,
    actions,
    onSubmit,
}: Readonly<DynamicSecurityAnalysisParametersFormProps>) {
    const { paramsLoaded, formattedProviders, formMethods } = dynamicSecurityAnalysisMethods;
    const { handleSubmit } = formMethods;

    const { selectedTab, tabsWithError, onTabChange, onError } = useTabs({
        defaultTab: TabValues.SCENARIO,
        tabEnum: TabValues,
    });

    return (
        <ParameterLayout
            title="DynamicSecurityAnalysis"
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
                item
                xs
                key="dsaParameters"
                sx={mergeSx(parametersStyles.scrollableGrid, {
                    paddingTop: 0,
                    width: '100%',
                    maxHeight: '100%',
                })}
            >
                <TabPanel value={selectedTab} index={TabValues.SCENARIO}>
                    <ScenarioParameters path={TabValues.SCENARIO} />
                </TabPanel>
                <TabPanel value={selectedTab} index={TabValues.CONTINGENCY}>
                    <ContingencyParameters path={TabValues.CONTINGENCY} />
                </TabPanel>
            </Grid>
        </ParameterLayout>
    );
}
