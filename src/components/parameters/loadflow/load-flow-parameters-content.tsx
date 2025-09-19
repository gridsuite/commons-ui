/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid } from '@mui/material';
import { TabValues } from './load-flow-parameters-utils';
import LoadFlowGeneralParameters from './load-flow-general-parameters';
import { LimitReductionsTableForm } from '../common';
import {
    alertThresholdMarks,
    MAX_VALUE_ALLOWED_FOR_LIMIT_REDUCTION,
    MIN_VALUE_ALLOWED_FOR_LIMIT_REDUCTION,
    PARAM_LIMIT_REDUCTION,
    PARAM_PROVIDER_OPENLOADFLOW,
} from './constants';
import { ILimitReductionsByVoltageLevel } from '../common/limitreductions/columns-definitions';
import { parametersStyles } from '../parameters-style';
import { SpecificParameterInfos } from '../../../utils/types/parameters.type';
import { LoadFlowParametersInfos } from '../../../utils/types/loadflow.type';
import { ParameterLineSlider } from '../common/widget/parameter-line-slider';
import { TabPanel } from '../common/parameters';
import type { MuiStyles } from '../../../utils/styles';

type LoadFlowParametersContentProps = {
    selectedTab: TabValues;
    currentProvider: string;
    specificParameters: SpecificParameterInfos[];
    params: LoadFlowParametersInfos | null;
    defaultLimitReductions: ILimitReductionsByVoltageLevel[];
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

function LoadFlowParametersContent({
    selectedTab,
    currentProvider,
    specificParameters,
    params,
    defaultLimitReductions,
}: Readonly<LoadFlowParametersContentProps>) {
    return (
        <Box sx={styles.wrapper}>
            <Grid container sx={styles.container}>
                <Grid item sx={styles.maxWidth}>
                    <TabPanel value={selectedTab} index={TabValues.GENERAL}>
                        <LoadFlowGeneralParameters provider={currentProvider} specificParams={specificParameters} />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={TabValues.LIMIT_REDUCTIONS}>
                        <Grid container sx={{ width: '100%' }}>
                            {currentProvider === PARAM_PROVIDER_OPENLOADFLOW ? (
                                <LimitReductionsTableForm limits={params?.limitReductions ?? defaultLimitReductions} />
                            ) : (
                                <ParameterLineSlider
                                    name={PARAM_LIMIT_REDUCTION}
                                    label="LimitReduction"
                                    marks={alertThresholdMarks}
                                    minValue={MIN_VALUE_ALLOWED_FOR_LIMIT_REDUCTION}
                                    maxValue={MAX_VALUE_ALLOWED_FOR_LIMIT_REDUCTION}
                                />
                            )}
                        </Grid>
                    </TabPanel>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LoadFlowParametersContent;
