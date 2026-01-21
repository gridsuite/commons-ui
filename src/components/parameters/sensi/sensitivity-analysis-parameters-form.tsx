/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ReactNode } from 'react';
import { Box, Grid, LinearProgress } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { UseSensitivityAnalysisParametersReturn } from './use-sensitivity-analysis-parameters';
import { parametersStyles } from '../parameters-style';
import { CustomFormProvider, MuiSelectInput } from '../../inputs';
import { LineSeparator, PROVIDER } from '../common';
import { SensitivityAnalysisFields } from './sensitivity-Flow-parameters';
import SensitivityParametersSelector from './sensitivity-parameters-selector';
import { mergeSx, type MuiStyles } from '../../../utils/styles';

const styles = {
    form: {
        height: '100%',
        display: 'flex',
        position: 'relative',
    },
    sensibilityAnalysisParameters: {
        flexGrow: 1,
        paddingLeft: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    actions: (theme) => ({
        flexGrow: 0,
        paddingBottom: theme.spacing(3),
    }),
    content: (theme) => ({
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        flexGrow: 1,
    }),
} as const satisfies MuiStyles;

export function SensitivityAnalysisParametersForm({
    sensitivityAnalysisMethods,
    renderTitleFields,
    renderActions,
    isDeveloperMode,
}: Readonly<{
    sensitivityAnalysisMethods: UseSensitivityAnalysisParametersReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
    isDeveloperMode: boolean;
}>) {
    return (
        <CustomFormProvider
            validationSchema={sensitivityAnalysisMethods.formSchema}
            {...sensitivityAnalysisMethods.formMethods}
        >
            <Box sx={styles.sensibilityAnalysisParameters}>
                {renderTitleFields?.()}
                {sensitivityAnalysisMethods.paramsLoaded ? (
                    <Box sx={mergeSx(parametersStyles.scrollableGrid, { paddingTop: 0, maxHeight: '100%' })}>
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
                        <Box
                            sx={{
                                flexGrow: 1,
                                overflow: 'auto',
                                paddingLeft: 1,
                            }}
                        >
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
                                />
                            </Grid>
                        </Box>
                    </Box>
                ) : (
                    <LinearProgress />
                )}
                {renderActions && <Box sx={styles.actions}>{renderActions()}</Box>}
            </Box>
        </CustomFormProvider>
    );
}
