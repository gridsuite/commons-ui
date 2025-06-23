import { ReactNode } from 'react';
import { Box, Grid, LinearProgress, Theme } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { UseSensitivityAnalysisParametersReturn } from './use-sensitivity-analysis-parameters';
import { formSchema } from './utils';
import { parametersStyles } from '../parameters-style';
import { CustomFormProvider, MuiSelectInput } from '../../inputs';
import { LineSeparator, PROVIDER } from '../common';
import { mergeSx } from '../../../utils';
import { SensitivityAnalysisFields } from './sensitivity-Flow-parameters';
import SensitivityParametersSelector from './sensitivity-parameters-selector';

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
    },
    actions: {
        flexGrow: 0,
    },
    content: (theme: Theme) => ({
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        flexGrow: 1,
    }),
};

export function SensitivityAnalysisParametersForm({
    sensitivityAnalysisMethods,
    renderTitleFields,
    renderActions,
    enableDeveloperMode,
}: Readonly<{
    sensitivityAnalysisMethods: UseSensitivityAnalysisParametersReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
    enableDeveloperMode: boolean;
}>) {
    return (
        <CustomFormProvider validationSchema={formSchema} {...sensitivityAnalysisMethods.formMethods}>
            <Grid container sx={{ height: '100%' }} justifyContent="space-between">
                {renderTitleFields?.()}
                {sensitivityAnalysisMethods.paramsLoaded ? (
                    <Box>
                        <Grid item container>
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
                        <Grid
                            xs
                            item
                            container
                            sx={mergeSx(parametersStyles.scrollableGrid, {
                                paddingTop: 0,
                                display: 'unset',
                            })}
                            key="sensitivityAnalysisParameters"
                        >
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
                                onChangeParams={sensitivityAnalysisMethods.onChangeParams}
                                launchLoader={sensitivityAnalysisMethods.launchLoader}
                                analysisComputeComplexity={sensitivityAnalysisMethods.analysisComputeComplexity}
                                enableDeveloperMode={enableDeveloperMode}
                                isStudyLinked={sensitivityAnalysisMethods.isStudyLinked}
                            />
                        </Grid>
                    </Box>
                ) : (
                    <LinearProgress />
                )}
                {renderActions && <Box sx={styles.actions}>{renderActions()}</Box>}
            </Grid>
        </CustomFormProvider>
    );
}
