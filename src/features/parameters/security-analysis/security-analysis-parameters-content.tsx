/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, ForwardedRef } from 'react';

import { FormattedMessage } from 'react-intl';

import { Tab, Tabs } from '@mui/material';
import type { UUID } from 'node:crypto';
import { LimitReductionsTableForm, TabPanel, CONTINGENCY_LISTS_INFOS, ContingencyTableApi } from '../common';
import { ContingencyTable } from '../common/contingency-table';
import { ContingencyCount } from '../common/contingency-table/types';
import { PARAM_PROVIDER_OPENLOADFLOW } from '../loadflow';
import { ViolationsHidingParameters } from './security-analysis-violations-hiding';
import { TabValues } from './constants';
import { UseSecurityAnalysisParametersFormReturn } from './use-security-analysis-parameters-form';
import { getTabStyle } from '../parameters-style';

export function SecurityAnalysisParametersContent({
    securityAnalysisMethods,
    showContingencyCount,
    fetchContingencyCount,
    contingencyTableApiRef,
    isBuiltCurrentNode,
}: Readonly<{
    securityAnalysisMethods: UseSecurityAnalysisParametersFormReturn;
    showContingencyCount: boolean;
    fetchContingencyCount?: (contingencyListIds: UUID[] | null, abortSignal: AbortSignal) => Promise<ContingencyCount>;
    contingencyTableApiRef?: ForwardedRef<ContingencyTableApi>;
    isBuiltCurrentNode?: boolean;
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

    useEffect(() => {
        if (currentProvider !== PARAM_PROVIDER_OPENLOADFLOW && selectedTab === TabValues.LimitReductions) {
            setSelectedTab(TabValues.Contingencies);
        }
    }, [currentProvider, selectedTab, setSelectedTab]);

    return (
        <>
            <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab
                    label={<FormattedMessage id={TabValues.Contingencies} />}
                    value={TabValues.Contingencies}
                    sx={getTabStyle(tabIndexesWithError, TabValues.Contingencies)}
                />
                <Tab
                    label={<FormattedMessage id={TabValues.Aggravation} />}
                    value={TabValues.Aggravation}
                    sx={getTabStyle(tabIndexesWithError, TabValues.Aggravation)}
                />
                {currentProvider === PARAM_PROVIDER_OPENLOADFLOW && params?.limitReductions && (
                    <Tab
                        label={<FormattedMessage id={TabValues.LimitReductions} />}
                        value={TabValues.LimitReductions}
                        sx={getTabStyle(tabIndexesWithError, TabValues.LimitReductions)}
                    />
                )}
            </Tabs>

            <TabPanel value={selectedTab} index={TabValues.Contingencies} keepState>
                <ContingencyTable
                    name={CONTINGENCY_LISTS_INFOS}
                    showContingencyCount={showContingencyCount}
                    fetchContingencyCount={fetchContingencyCount}
                    isBuiltCurrentNode={isBuiltCurrentNode}
                    ref={contingencyTableApiRef}
                />
            </TabPanel>
            <TabPanel value={selectedTab} index={TabValues.Aggravation}>
                <ViolationsHidingParameters />
            </TabPanel>
            <TabPanel value={selectedTab} index={TabValues.LimitReductions}>
                {currentProvider === PARAM_PROVIDER_OPENLOADFLOW && params?.limitReductions && (
                    <LimitReductionsTableForm limits={params.limitReductions ?? defaultLimitReductions} />
                )}
            </TabPanel>
        </>
    );
}
