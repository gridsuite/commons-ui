/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, LinearProgress, Tab, Tabs } from '@mui/material';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { CustomFormProvider } from '../../inputs';
import { getTabStyle, parametersStyles } from '../parameters-style';
import { UseShortCircuitParametersFormReturn } from './use-short-circuit-parameters-form';
import { MuiStyles } from '../../../utils';
import ShortCircuitParametersContent from './short-circuit-parameters-content';
import { ShortCircuitParametersTabValues } from './short-circuit-parameters-utils';

const styles = {
    shortCircuitParameters: {
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
    },
} as const satisfies MuiStyles;

interface ShortCircuitParametersFormProps {
    shortCircuitMethods: UseShortCircuitParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
    isDeveloperMode: boolean;
}

export function ShortCircuitParametersForm({
    shortCircuitMethods,
    renderTitleFields,
    renderActions,
    isDeveloperMode,
}: Readonly<ShortCircuitParametersFormProps>) {
    const { formMethods, formSchema, paramsLoaded, resetAll, selectedTab, handleTabChange, tabIndexesWithError } =
        shortCircuitMethods;
    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods} removeOptional>
            <Box sx={styles.shortCircuitParameters}>
                <Grid item container direction="column">
                    {renderTitleFields?.()}
                </Grid>
                {paramsLoaded ? (
                    <>
                        <Grid item sx={{ width: '100%' }}>
                            <Tabs value={selectedTab} onChange={handleTabChange}>
                                <Tab
                                    label={<FormattedMessage id={ShortCircuitParametersTabValues.GENERAL} />}
                                    value={ShortCircuitParametersTabValues.GENERAL}
                                    sx={getTabStyle(tabIndexesWithError, ShortCircuitParametersTabValues.GENERAL)}
                                />
                                <Tab
                                    label={<FormattedMessage id={ShortCircuitParametersTabValues.STUDY_AREA} />}
                                    value={ShortCircuitParametersTabValues.STUDY_AREA}
                                    sx={getTabStyle(tabIndexesWithError, ShortCircuitParametersTabValues.STUDY_AREA)}
                                />
                                <Tab
                                    label={<FormattedMessage id={ShortCircuitParametersTabValues.POWER_ELECTRONICS} />}
                                    value={ShortCircuitParametersTabValues.POWER_ELECTRONICS}
                                    sx={getTabStyle(
                                        tabIndexesWithError,
                                        ShortCircuitParametersTabValues.POWER_ELECTRONICS
                                    )}
                                />
                            </Tabs>
                        </Grid>
                        <Grid sx={parametersStyles.scrollableGrid}>
                            <ShortCircuitParametersContent
                                isDeveloperMode={isDeveloperMode}
                                resetAll={resetAll}
                                selectedTab={selectedTab}
                            />
                        </Grid>
                    </>
                ) : (
                    <LinearProgress />
                )}
                <Grid
                    item
                    container
                    direction="column"
                    sx={{
                        position: 'absolute',
                        bottom: '15px',
                    }}
                >
                    {renderActions?.()}
                </Grid>
            </Box>
        </CustomFormProvider>
    );
}
