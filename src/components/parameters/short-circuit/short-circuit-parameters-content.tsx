/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid } from '@mui/material';
import { ShortCircuitParametersTabValues } from './short-circuit-parameters-utils';
import { parametersStyles } from '../parameters-style';
import { TabPanel } from '../common/parameters';
import type { MuiStyles } from '../../../utils/styles';
import { PredefinedParameters } from './constants';
import { ShortCircuitFields } from './short-circuit-fields';
import { ShortCircuitStudyArea } from './short-circuit-study-area';
import { ShortCircuitPowerElectronics } from './short-circuit-power-electronics';

type ShortCircuitParametersContentProps = {
    isDeveloperMode: boolean;
    resetAll: (predefinedParams: PredefinedParameters) => void;
    selectedTab: ShortCircuitParametersTabValues;
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
    isDeveloperMode,
    resetAll,
    selectedTab,
}: Readonly<ShortCircuitParametersContentProps>) {
    return (
        <Box sx={styles.wrapper}>
            <Grid container sx={styles.container}>
                <Grid item sx={styles.maxWidth}>
                    <TabPanel value={selectedTab} index={ShortCircuitParametersTabValues.GENERAL}>
                        <ShortCircuitFields resetAll={resetAll} isDeveloperMode={isDeveloperMode} />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={ShortCircuitParametersTabValues.STUDY_AREA}>
                        <ShortCircuitStudyArea />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={ShortCircuitParametersTabValues.POWER_ELECTRONICS}>
                        <ShortCircuitPowerElectronics isDeveloperMode={isDeveloperMode} />
                    </TabPanel>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ShortCircuitParametersContent;
