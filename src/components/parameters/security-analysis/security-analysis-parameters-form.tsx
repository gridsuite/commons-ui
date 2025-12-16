/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Grid, LinearProgress } from '@mui/material';
import { CustomFormProvider, MuiSelectInput } from '../../inputs';
import { parametersStyles } from '../parameters-style';
import { LineSeparator, PARAM_SA_PROVIDER } from '../common';
import { mergeSx, type MuiStyles } from '../../../utils/styles';
import { SecurityAnalysisParametersSelector } from './security-analysis-parameters-selector';
import { UseSecurityAnalysisParametersFormReturn } from './use-security-analysis-parameters-form';

const styles = {
    form: {
        height: '100%',
        display: 'flex',
        position: 'relative',
    },
    securityAnalysisParameters: {
        flexGrow: 1,
        paddingLeft: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    actions: {
        flexGrow: 0,
    },
    content: (theme) => ({
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        flexGrow: 1,
    }),
} as const satisfies MuiStyles;

export function SecurityAnalysisParametersForm({
    securityAnalysisMethods,
    renderTitleFields,
    renderActions,
    isDeveloperMode,
}: Readonly<{
    securityAnalysisMethods: UseSecurityAnalysisParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
    isDeveloperMode: boolean;
}>) {
    return (
        <CustomFormProvider
            validationSchema={securityAnalysisMethods.formSchema}
            {...securityAnalysisMethods.formMethods}
        >
            <Grid item sx={{ height: '100%' }} xl={9} lg={11} md={12}>
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        position: 'relative',
                        flexDirection: 'column',
                        width: '100%',
                    }}
                >
                    <Box sx={styles.securityAnalysisParameters}>
                        {renderTitleFields?.()}
                        {securityAnalysisMethods.paramsLoaded ? (
                            <>
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
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        overflow: 'auto',
                                        paddingLeft: 1,
                                    }}
                                >
                                    <Grid
                                        container
                                        sx={mergeSx(parametersStyles.scrollableGrid, {
                                            maxHeight: '100%',
                                        })}
                                    >
                                        <SecurityAnalysisParametersSelector
                                            params={securityAnalysisMethods.params}
                                            currentProvider={securityAnalysisMethods.currentProvider?.trim()}
                                            isDeveloperMode={isDeveloperMode}
                                            defaultLimitReductions={securityAnalysisMethods.defaultLimitReductions}
                                        />
                                    </Grid>
                                </Box>
                            </>
                        ) : (
                            <LinearProgress />
                        )}
                        {renderActions && <Box sx={styles.actions}>{renderActions()}</Box>}
                    </Box>
                </Box>
            </Grid>
        </CustomFormProvider>
    );
}
