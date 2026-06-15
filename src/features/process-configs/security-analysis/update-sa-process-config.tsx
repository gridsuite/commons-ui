/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, Grid2 } from '@mui/material';
import {
    DescriptionField,
    DirectoryItemsInput,
    ElementType,
    FieldConstants,
    ParameterLineDirectoryItemsInput,
    UniqueNameInput,
} from '@gridsuite/commons-ui';
import { UUID } from 'node:crypto';
import { FormattedMessage } from 'react-intl';
import { UpdateProcessConfigModifications } from '../update-process-config-modifications';

interface UpdateSaProcessConfigProps {
    directory?: UUID;
    processConfigName: string;
}

export function UpdateSaProcessConfig({ directory, processConfigName }: Readonly<UpdateSaProcessConfigProps>) {
    return (
        <Grid2 container spacing={2}>
            <Grid2 size={12}>
                <UniqueNameInput
                    name={FieldConstants.NAME}
                    label="name"
                    elementType={ElementType.PROCESS_CONFIG}
                    currentName={processConfigName}
                    activeDirectory={directory}
                    autoFocus
                />
            </Grid2>
            <Grid2 size={12}>
                <DescriptionField />
            </Grid2>
            <Box component="h3">
                <FormattedMessage id="modifications" />
            </Box>
            <UpdateProcessConfigModifications />
            <Box component="h3">
                <FormattedMessage id="providersParameters" />
            </Box>
            <ParameterLineDirectoryItemsInput
                label="loadflow"
                elementType={ElementType.LOADFLOW_PARAMETERS}
                name="loadflowParameters"
                allowMultiSelect={false}
                hideErrorMessage={false}
            />
            <Grid2 size={12}>
                <DirectoryItemsInput
                    titleId="loadflow"
                    elementType={ElementType.LOADFLOW_PARAMETERS}
                    label="loadflow"
                    name="loadflowParameters"
                    allowMultiSelect={false}
                />
            </Grid2>
            <Grid2 size={12}>
                <DirectoryItemsInput
                    titleId="securityAnalysis"
                    elementType={ElementType.SECURITY_ANALYSIS_PARAMETERS}
                    label="securityAnalysis"
                    name="securityAnalysisParameters"
                    allowMultiSelect={false}
                />
            </Grid2>
        </Grid2>
    );
}
