/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { UseSensitivityAnalysisParametersReturn } from './use-sensitivity-analysis-parameters';
import { parametersStyles } from '../parameters-style';
import { CustomFormProvider, MuiSelectInput } from '../../../components/ui';
import { LineSeparator, PROVIDER, ParameterLayout, ParameterActions } from '../common';
import { SensitivityAnalysisFields } from './sensitivity-parameters-fields';
import SensitivityParametersSelector from './sensitivity-parameters-selector';
import { BuildStatus } from '../../node/constant';

export function SensitivityAnalysisParametersForm({
    sensitivityAnalysisMethods,
    renderTitleFields,
    actions,
    isDeveloperMode,
    isRootNode,
    globalBuildStatus,
}: Readonly<{
    sensitivityAnalysisMethods: UseSensitivityAnalysisParametersReturn;
    renderTitleFields?: () => ReactNode;
    actions?: ParameterActions;
    isDeveloperMode: boolean;
    isRootNode: boolean;
    globalBuildStatus?: BuildStatus;
}>) {
    const { handleSubmit } = sensitivityAnalysisMethods.formMethods;
    return (
        <CustomFormProvider
            validationSchema={sensitivityAnalysisMethods.formSchema}
            {...sensitivityAnalysisMethods.formMethods}
        >
            <ParameterLayout
                title="SensitivityAnalysis"
                header={renderTitleFields?.()}
                isLoading={!sensitivityAnalysisMethods.paramsFormInitialized}
                actions={{
                    ...actions,
                    validateOnClick: handleSubmit(sensitivityAnalysisMethods.onSaveInline),
                }}
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
                    <Grid item xs={8} xl={4} sx={parametersStyles.parameterName}>
                        <FormattedMessage id="Provider" />
                    </Grid>
                    <Grid item xs={4} xl={2} sx={parametersStyles.controlItem}>
                        <MuiSelectInput
                            name={PROVIDER}
                            size="small"
                            options={Object.values(sensitivityAnalysisMethods.formattedProviders)}
                        />
                    </Grid>
                </Grid>
                <Grid container key="sensitivityAnalysisParameters">
                    <Grid xl={6}>
                        <Grid container paddingTop={1} paddingBottom={1}>
                            <LineSeparator />
                        </Grid>
                        <SensitivityAnalysisFields />
                    </Grid>
                    <Grid container paddingTop={4} paddingBottom={2}>
                        <LineSeparator />
                    </Grid>
                    <SensitivityParametersSelector
                        onFormChanged={sensitivityAnalysisMethods.onFormChanged}
                        isLoading={sensitivityAnalysisMethods.isLoading}
                        factorsCount={sensitivityAnalysisMethods.factorsCount}
                        isDeveloperMode={isDeveloperMode}
                        isStudyLinked={sensitivityAnalysisMethods.isStudyLinked}
                        isRootNode={isRootNode}
                        globalBuildStatus={globalBuildStatus}
                    />
                </Grid>
            </ParameterLayout>
        </CustomFormProvider>
    );
}
