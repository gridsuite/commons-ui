/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box } from '@mui/material';
import { UUID } from 'node:crypto';
import { FormattedMessage } from 'react-intl';
import { UpdateProcessConfigModifications } from '../common/update-process-config-modifications';
import { FieldConstants, ElementType } from '../../../utils';
import { ParameterLineDirectoryItemsInput } from '../../parameters';
import { NameElementEditorForm } from '../../parameters/common/name-element-editor';

interface UpdateLFProcessConfigProps {
    directory: UUID;
    processConfigName: string;
}

export function UpdateLFProcessConfig({ directory, processConfigName }: Readonly<UpdateLFProcessConfigProps>) {
    return (
        <>
            <NameElementEditorForm
                activeDirectory={directory}
                elementType={ElementType.PROCESS_CONFIG}
                initialElementName={processConfigName}
            />
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
        </>
    );
}
