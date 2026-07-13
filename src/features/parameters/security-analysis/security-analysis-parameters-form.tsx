/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, Stack } from '@mui/material';
import { ForwardedRef } from 'react';
import { UUID } from 'node:crypto';
import { parametersStyles } from '../parameters-style';
import { CONTINGENCY_LISTS_INFOS, ContingencyTableApi, LineSeparator, ProviderParam } from '../common';
import { SecurityAnalysisParametersSelector } from './security-analysis-parameters-selector';
import { UseSecurityAnalysisParametersFormReturn } from './use-security-analysis-parameters-form';
import { ContingencyTable } from '../common/contingency-table';
import { ContingencyCount } from '../common/contingency-table/types';

export type SecurityAnalysisParametersFormProps = {
    securityAnalysisMethods: UseSecurityAnalysisParametersFormReturn;
    showContingencyCount: boolean;
    fetchContingencyCount?: (contingencyListIds: UUID[] | null, abortSignal: AbortSignal) => Promise<ContingencyCount>;
    contingencyTableApiRef?: ForwardedRef<ContingencyTableApi>;
    isBuiltCurrentNode?: boolean;
    isDeveloperMode: boolean;
};

export function SecurityAnalysisParametersForm({
    securityAnalysisMethods,
    showContingencyCount,
    fetchContingencyCount,
    contingencyTableApiRef,
    isBuiltCurrentNode,
    isDeveloperMode,
}: Readonly<SecurityAnalysisParametersFormProps>) {
    return (
        <Stack sx={parametersStyles.scrollableGrid}>
            <ProviderParam options={securityAnalysisMethods.formattedProviders} id="Sa" sx={{ paddingBottom: 1 }} />
            <ContingencyTable
                name={CONTINGENCY_LISTS_INFOS}
                showContingencyCount={showContingencyCount}
                fetchContingencyCount={fetchContingencyCount}
                isBuiltCurrentNode={isBuiltCurrentNode}
                ref={contingencyTableApiRef}
            />
            <Box paddingTop={4} paddingBottom={2}>
                <LineSeparator />
            </Box>
            <SecurityAnalysisParametersSelector
                params={securityAnalysisMethods.params}
                currentProvider={securityAnalysisMethods.watchProvider?.trim()}
                isDeveloperMode={isDeveloperMode}
                defaultLimitReductions={securityAnalysisMethods.defaultLimitReductions}
            />
        </Stack>
    );
}
