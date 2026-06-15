/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ForwardedRef, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Grid } from '@mui/material';
import { UUID } from 'node:crypto';
import { CustomFormProvider, MuiSelectInput } from '../../../components/ui';
import { parametersStyles } from '../parameters-style';
import {
    CONTINGENCY_LISTS_INFOS,
    ContingencyTableApi,
    LineSeparator,
    PARAM_SA_PROVIDER,
    ParameterLayout,
} from '../common';
import { mergeSx } from '../../../utils/styles';
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
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
    isDeveloperMode: boolean;
};

export function SecurityAnalysisParametersForm({
    securityAnalysisMethods,
    showContingencyCount,
    fetchContingencyCount,
    contingencyTableApiRef,
    isBuiltCurrentNode,
    renderTitleFields,
    renderActions,
    isDeveloperMode,
}: Readonly<SecurityAnalysisParametersFormProps>) {
    return (
        <CustomFormProvider
            validationSchema={securityAnalysisMethods.formSchema}
            {...securityAnalysisMethods.formMethods}
        >
            <ParameterLayout
                header={renderTitleFields?.()}
                footer={renderActions?.()}
                isLoading={!securityAnalysisMethods.paramsFormInitialized}
                contentSx={{ paddingLeft: 1 }}
            >
                <Grid
                    container
                    spacing={1}
                    sx={{
                        padding: 0,
                        paddingBottom: 2,
                        height: 'fit-content',
                    }}
                    justifyContent="space-between"
                >
                    <Grid item xs="auto" sx={parametersStyles.parameterName}>
                        <FormattedMessage id="Provider" />
                    </Grid>
                    <Grid item xs="auto" sx={parametersStyles.controlItem}>
                        <MuiSelectInput
                            name={PARAM_SA_PROVIDER}
                            size="small"
                            options={Object.values(securityAnalysisMethods.formattedProviders)}
                        />
                    </Grid>
                    <LineSeparator />
                </Grid>
                <Grid
                    container
                    key="securityAnalysisParameters"
                    sx={mergeSx(parametersStyles.scrollableGrid, {
                        maxHeight: '100%',
                    })}
                >
                    <ContingencyTable
                        name={CONTINGENCY_LISTS_INFOS}
                        showContingencyCount={showContingencyCount}
                        fetchContingencyCount={fetchContingencyCount}
                        isBuiltCurrentNode={isBuiltCurrentNode}
                        ref={contingencyTableApiRef}
                    />
                    <Grid container paddingTop={4} paddingBottom={2}>
                        <LineSeparator />
                    </Grid>
                    <SecurityAnalysisParametersSelector
                        params={securityAnalysisMethods.params}
                        currentProvider={securityAnalysisMethods.watchProvider?.trim()}
                        isDeveloperMode={isDeveloperMode}
                        defaultLimitReductions={securityAnalysisMethods.defaultLimitReductions}
                    />
                </Grid>
            </ParameterLayout>
        </CustomFormProvider>
    );
}
