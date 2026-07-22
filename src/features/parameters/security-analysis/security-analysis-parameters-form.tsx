/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Stack } from '@mui/material';
import { ForwardedRef } from 'react';
import type { UUID } from 'node:crypto';
import { parametersStyles } from '../parameters-style';
import { ContingencyTableApi, ProviderParam } from '../common';
import { SecurityAnalysisParametersContent } from './security-analysis-parameters-content';
import { UseSecurityAnalysisParametersFormReturn } from './use-security-analysis-parameters-form';
import { ContingencyCount } from '../common/contingency-table/types';

export type SecurityAnalysisParametersFormProps = {
    securityAnalysisMethods: UseSecurityAnalysisParametersFormReturn;
    showContingencyCount: boolean;
    fetchContingencyCount?: (contingencyListIds: UUID[] | null, abortSignal: AbortSignal) => Promise<ContingencyCount>;
    contingencyTableApiRef?: ForwardedRef<ContingencyTableApi>;
    isBuiltCurrentNode?: boolean;
};

export function SecurityAnalysisParametersForm({
    securityAnalysisMethods,
    showContingencyCount,
    fetchContingencyCount,
    contingencyTableApiRef,
    isBuiltCurrentNode,
}: Readonly<SecurityAnalysisParametersFormProps>) {
    return (
        <Stack sx={parametersStyles.scrollableGrid}>
            <ProviderParam options={securityAnalysisMethods.formattedProviders} id="Sa" sx={{ paddingBottom: 1 }} />
            <SecurityAnalysisParametersContent
                params={securityAnalysisMethods.params}
                currentProvider={securityAnalysisMethods.watchProvider?.trim()}
                defaultLimitReductions={securityAnalysisMethods.defaultLimitReductions}
                showContingencyCount={showContingencyCount}
                fetchContingencyCount={fetchContingencyCount}
                contingencyTableApiRef={contingencyTableApiRef}
                isBuiltCurrentNode={isBuiltCurrentNode}
            />
        </Stack>
    );
}
