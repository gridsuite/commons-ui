/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid2 as Grid, Stack } from '@mui/material';
import React from 'react';
import { UseSensitivityAnalysisParametersReturn } from './use-sensitivity-analysis-parameters';
import { parametersStyles } from '../parameters-style';
import { LineSeparator, ProviderParam } from '../common';
import { SensitivityAnalysisFields } from './sensitivity-parameters-fields';
import SensitivityParametersSelector from './sensitivity-parameters-selector';
import { BuildStatus } from '../../node/constant';

export function SensitivityAnalysisParametersForm({
    sensitivityAnalysisMethods,
    isDeveloperMode,
    isRootNode,
    globalBuildStatus,
}: Readonly<{
    sensitivityAnalysisMethods: UseSensitivityAnalysisParametersReturn;
    isDeveloperMode: boolean;
    isRootNode: boolean;
    globalBuildStatus?: BuildStatus;
}>) {
    return (
        <Stack sx={parametersStyles.scrollableGrid}>
            <ProviderParam
                options={sensitivityAnalysisMethods.formattedProviders}
                id="Sensi"
                sx={{ paddingBottom: 1 }}
            />
            <Stack>
                <SensitivityAnalysisFields />
                <Grid container size={12} paddingTop={1} paddingBottom={1}>
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
            </Stack>
        </Stack>
    );
}
