/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, Grid2 } from '@mui/material';
import { UUID } from 'node:crypto';
import { FormattedMessage } from 'react-intl';
import { UpdateProcessConfigModifications } from '../update-process-config-modifications';
import { DescriptionField, UniqueNameInput } from '../../../components/ui';
import { FieldConstants, ElementType } from '../../../utils';
import { ParameterLineDirectoryItemsInput } from '../../parameters';

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
                <FormattedMessage id="process_config/modifications" />
            </Box>
            <UpdateProcessConfigModifications name={FieldConstants.MODIFICATIONS} />
            <Box component="h3">
                <FormattedMessage id="process_config/providersParameters" />
            </Box>
            <ParameterLineDirectoryItemsInput
                label="process_config/loadflow"
                elementType={ElementType.LOADFLOW_PARAMETERS}
                name={FieldConstants.LOADFLOW_PARAMETERS}
                allowMultiSelect={false}
                hideErrorMessage={false}
            />
            <ParameterLineDirectoryItemsInput
                label="process_config/securityAnalysis"
                elementType={ElementType.SECURITY_ANALYSIS_PARAMETERS}
                name={FieldConstants.SECURITY_ANALYSIS_PARAMETERS}
                allowMultiSelect={false}
                hideErrorMessage={false}
            />
        </Grid2>
    );
}
