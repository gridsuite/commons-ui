/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { getTabStyle, parametersStyles } from '../parameters-style';
import { ShortCircuitParametersTabValues } from './short-circuit-parameters-utils';
import type { MuiStyles } from '../../../utils/styles';
import { ShortCircuitGeneralTabPanel } from './short-circuit-general-tab-panel';
import { ShortCircuitStudyAreaTabPanel } from './short-circuit-study-area-tab-panel';
import { ShortCircuitPowerElectronicsTabPanel } from './short-circuit-power-electronics-tab-panel';
import { SPECIFIC_PARAMETERS } from '../common';
import { UseShortCircuitParametersFormReturn } from './use-short-circuit-parameters-form';

type ShortCircuitParametersContentProps = {
    shortCircuitMethods: UseShortCircuitParametersFormReturn;
    isDeveloperMode: boolean;
};

const styles = {
    container: {
        ...parametersStyles.scrollableGrid,
        maxHeight: '100%',
    },
    maxWidth: {
        width: '100%',
    },
    wrapper: {
        flexGrow: 1,
        overflow: 'auto',
        paddingLeft: 1,
    },
} as const satisfies MuiStyles;

function ShortCircuitParametersContent({
    shortCircuitMethods,
    isDeveloperMode,
}: Readonly<ShortCircuitParametersContentProps>) {
    const { resetAll, selectedTab, handleTabChange, tabIndexesWithError } = shortCircuitMethods;

    const watchSpecificParameters = useWatch({
        name: `${SPECIFIC_PARAMETERS}`,
    });

    const isThereSpecificParameters = useMemo(
        () => Object.keys(watchSpecificParameters).length > 0 && watchSpecificParameters.constructor === Object,
        [watchSpecificParameters]
    );

    return (
        <>
            <Grid item sx={{ width: '100%' }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab
                        label={<FormattedMessage id={ShortCircuitParametersTabValues.GENERAL} />}
                        value={ShortCircuitParametersTabValues.GENERAL}
                        sx={getTabStyle(tabIndexesWithError, ShortCircuitParametersTabValues.GENERAL)}
                    />
                    {isThereSpecificParameters && isDeveloperMode && (
                        <Tab
                            label={<FormattedMessage id={ShortCircuitParametersTabValues.STUDY_AREA} />}
                            value={ShortCircuitParametersTabValues.STUDY_AREA}
                            sx={getTabStyle(tabIndexesWithError, ShortCircuitParametersTabValues.STUDY_AREA)}
                        />
                    )}
                    {isThereSpecificParameters && isDeveloperMode && (
                        <Tab
                            label={<FormattedMessage id={ShortCircuitParametersTabValues.POWER_ELECTRONICS} />}
                            value={ShortCircuitParametersTabValues.POWER_ELECTRONICS}
                            sx={getTabStyle(tabIndexesWithError, ShortCircuitParametersTabValues.POWER_ELECTRONICS)}
                        />
                    )}
                </Tabs>
            </Grid>
            <Box sx={styles.wrapper}>
                <Grid container sx={styles.container}>
                    <Grid item sx={styles.maxWidth}>
                        <ShortCircuitGeneralTabPanel resetAll={resetAll} value={selectedTab} />
                        {isThereSpecificParameters && isDeveloperMode && (
                            <>
                                <ShortCircuitStudyAreaTabPanel value={selectedTab} />
                                <ShortCircuitPowerElectronicsTabPanel value={selectedTab} />
                            </>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default ShortCircuitParametersContent;
