/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, LinearProgress, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ReactNode } from 'react';

import ScenarioParameters from './scenario-parameters';
import ContingencyParameters from './contingency-parameters';
import { parametersStyles } from '../util/styles';
import { ProviderParam, TabPanel } from '../common';
import { getTabStyle } from '../parameters-style';
import {
    TabValues,
    UseDynamicSecurityAnalysisParametersFormReturn,
} from './use-dynamic-security-analysis-parameters-form';
import { mergeSx } from '../../../utils';
import { CustomFormProvider } from '../../inputs';

type DynamicSecurityAnalysisParametersFormProps = {
    dynamicSecurityAnalysisMethods: UseDynamicSecurityAnalysisParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
};

export function DynamicSecurityAnalysisParametersForm({
    dynamicSecurityAnalysisMethods,
    renderTitleFields,
    renderActions,
}: Readonly<DynamicSecurityAnalysisParametersFormProps>) {
    const { formMethods, formSchema, paramsLoaded, formattedProviders, selectedTab, onTabChange, tabsWithError } =
        dynamicSecurityAnalysisMethods;

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods}>
            {renderTitleFields?.()}
            {paramsLoaded ? (
                <Grid sx={{ height: '100%' }}>
                    <Grid container>
                        <ProviderParam options={formattedProviders} />
                    </Grid>
                    <Grid
                        key="dsaParameters"
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
                                    label={<FormattedMessage id="DynamicSecurityAnalysisScenario" />}
                                    value={TabValues.SCENARIO}
                                    sx={getTabStyle(tabsWithError, TabValues.SCENARIO)}
                                />
                                <Tab
                                    label={<FormattedMessage id="DynamicSecurityAnalysisContingency" />}
                                    value={TabValues.CONTINGENCY}
                                />
                            </Tabs>
                            <TabPanel value={selectedTab} index={TabValues.SCENARIO}>
                                <ScenarioParameters path={TabValues.SCENARIO} />
                            </TabPanel>
                            <TabPanel value={selectedTab} index={TabValues.CONTINGENCY}>
                                <ContingencyParameters path={TabValues.CONTINGENCY} />
                            </TabPanel>
                        </Grid>
                    </Grid>
                    {renderActions?.()}
                </Grid>
            ) : (
                <LinearProgress />
            )}
        </CustomFormProvider>
    );
}
