/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { User } from 'oidc-client';
import { Grid } from '@mui/material';
import { CustomMuiDialog } from '../../dialogs';
import { ComputingType } from '../common';
import {
    fetchLoadFlowParameters,
    getDefaultLoadFlowProvider,
    getLoadFlowDefaultLimitReductions,
    getLoadFlowProviders,
    getLoadFlowSpecificParametersDescription,
    setLoadFlowParameters,
} from '../../../services/loadflow';
import { OptionalServicesStatus, useParametersBackend } from '../../../hooks';
import { DescriptionField, UniqueNameInput } from '../../inputs';
import { ElementType, FieldConstants } from '../../../utils';
import { filterStyles } from '../../filter/HeaderFilterForm';
import { LoadFlowProvider } from './load-flow-parameters-provider';
import { useLoadFlowParametersForm } from './use-load-flow-parameters-form';
import { LoadFlowParametersForm } from './load-flow-parameters-form';

export interface ParametersEditionDialogProps {
    id: UUID;
    open: boolean;
    onClose: () => void;
    titleId: string;
    name: string;
    description: string | null;
    activeDirectory?: UUID;
    language?: string;
    user: User | null;
    enableDeveloperMode: boolean;
}

export function LoadFlowParametersEditionDialog({
    id,
    open,
    onClose,
    titleId,
    name,
    description,
    activeDirectory,
    language,
    user,
    enableDeveloperMode,
}: Readonly<ParametersEditionDialogProps>) {
    const parametersBackend = useParametersBackend(
        user,
        id,
        ComputingType.LOAD_FLOW,
        OptionalServicesStatus.Up,
        getLoadFlowProviders,
        null,
        getDefaultLoadFlowProvider,
        null,
        fetchLoadFlowParameters,
        setLoadFlowParameters,
        getLoadFlowSpecificParametersDescription,
        getLoadFlowDefaultLimitReductions
    );

    const loadflowMethods = useLoadFlowParametersForm(parametersBackend, enableDeveloperMode, id, name, description);

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={loadflowMethods.onSaveDialog}
            onValidationError={loadflowMethods.onValidationError}
            formSchema={loadflowMethods.formSchema}
            formMethods={loadflowMethods.formMethods}
            titleId={titleId}
            removeOptional
            language={language}
            unscrollableFullHeight
        >
            <LoadFlowProvider>
                <LoadFlowParametersForm
                    loadflowMethods={loadflowMethods}
                    renderTitleFields={() => {
                        return (
                            <Grid item sx={{ height: '100%' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <UniqueNameInput
                                            name={FieldConstants.NAME}
                                            label="nameProperty"
                                            elementType={ElementType.LOADFLOW_PARAMETERS}
                                            activeDirectory={activeDirectory}
                                            sx={filterStyles.textField}
                                            fullWidth={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <DescriptionField expandingTextSx={filterStyles.description} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    }}
                />
            </LoadFlowProvider>
        </CustomMuiDialog>
    );
}
