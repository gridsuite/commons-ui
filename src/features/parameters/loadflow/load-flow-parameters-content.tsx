/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid } from '@mui/material';
import { TabValues } from './load-flow-parameters-utils';
import LoadFlowAdvancedParameters from './load-flow-advanced-parameters';
import LoadFlowGeneralParameters from './load-flow-general-parameters';
import LoadFlowProviderSpecificParameters from './load-flow-provider-specific-parameters';
import { LimitScalingsTableForm } from '../common';
import {
    alertThresholdMarks,
    MAX_VALUE_ALLOWED_FOR_LIMIT_SCALING,
    MIN_VALUE_ALLOWED_FOR_LIMIT_SCALING,
    PARAM_LIMIT_SCALING,
    PARAM_PROVIDER_OPENLOADFLOW,
} from './constants';
import { ILimitScalingsByVoltageLevel } from '../common/limitscalings/columns-definitions';
import { parametersStyles } from '../parameters-style';
import { SpecificParameterInfos } from '../../../utils/types/parameters.type';
import { LoadFlowParametersInfos } from '../../../utils/types/loadflow.type';
import { ParameterLineSlider } from '../common/widget/parameter-line-slider';
import { TabPanel } from '../common/parameters';
import type { MuiStyles } from '../../../utils/styles';

type LoadFlowParametersContentProps = {
    selectedTab: TabValues;
    currentProvider: string;
    specificParameters?: SpecificParameterInfos[];
    params: LoadFlowParametersInfos | null;
    defaultLimitScalings: ILimitScalingsByVoltageLevel[];
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
    defaultLimitScalings,
}: Readonly<LoadFlowParametersContentProps>) {
    const parametersDifferences = params?.parametersDifferences;

    return (
        <Box sx={styles.wrapper}>
            <Grid container sx={styles.container}>
                <Grid sx={styles.maxWidth}>
                    <TabPanel value={selectedTab} index={TabValues.GENERAL}>
                        <LoadFlowGeneralParameters parametersDifferences={parametersDifferences} />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={TabValues.LIMIT_SCALINGS}>
                        <Grid container sx={{ width: '100%' }}>
                            {currentProvider === PARAM_PROVIDER_OPENLOADFLOW ? (
                                <LimitScalingsTableForm limits={params?.limitReductions ?? defaultLimitScalings} />
                            ) : (
                                <ParameterLineSlider
                                    name={PARAM_LIMIT_SCALING}
                                    label="LimitReduction"
                                    marks={alertThresholdMarks}
                                    minValue={MIN_VALUE_ALLOWED_FOR_LIMIT_SCALING}
                                    maxValue={MAX_VALUE_ALLOWED_FOR_LIMIT_SCALING}
                                />
                            )}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={selectedTab} index={TabValues.ADVANCED}>
                        <LoadFlowAdvancedParameters parametersDifferences={parametersDifferences} />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={TabValues.PROVIDER_SPECIFIC}>
                        <LoadFlowProviderSpecificParameters
                            specificParameters={specificParameters}
                            parametersDifferences={parametersDifferences}
                        />
                    </TabPanel>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LoadFlowParametersContent;
