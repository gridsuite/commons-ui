/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, LinearProgress } from '@mui/material';
import { CustomMuiDialog } from '../../../components/ui/dialogs';
import { ComputingType, ElementType } from '../../../utils';
import { NameElementEditorForm } from '../common/name-element-editor';
import { useShortCircuitParametersForm } from './use-short-circuit-parameters-form';
import { ShortCircuitParametersForm } from './short-circuit-parameters-form';
import { ParametersEditionDialogProps } from '../common';
import { OptionalServicesStatus, useParametersBackend } from '../../../hooks';
import {
    fetchShortCircuitParameters,
    getShortCircuitSpecificParametersDescription,
    updateShortCircuitParameters,
} from '../../../services/short-circuit-analysis';

export function ShortCircuitParametersEditionDialog({
    id,
    open,
    onClose,
    titleId,
    name,
    description,
    activeDirectory,
    userProfile,
    language,
}: Readonly<ParametersEditionDialogProps>) {
    const parametersBackend = useParametersBackend(
        userProfile,
        id,
        ComputingType.SHORT_CIRCUIT,
        OptionalServicesStatus.Up,
        {
            backendFetchParameters: fetchShortCircuitParameters,
            backendUpdateParameters: updateShortCircuitParameters,
            backendFetchSpecificParametersDescription: getShortCircuitSpecificParametersDescription,
        }
    );

    const shortCircuitMethods = useShortCircuitParametersForm({
        parametersBackend,
        parametersUuid: id,
        name,
        description,
    });

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={shortCircuitMethods.onSaveDialog}
            onValidationError={shortCircuitMethods.onValidationError}
            formContext={{
                ...shortCircuitMethods.formMethods,
                validationSchema: shortCircuitMethods.formSchema,
                removeOptional: true,
                language,
            }}
            titleId={titleId}
            maxWidth="lg"
        >
            <Grid container sx={{ width: '100%' }}>
                <NameElementEditorForm
                    initialElementName={name}
                    activeDirectory={activeDirectory}
                    elementType={ElementType.SHORT_CIRCUIT_PARAMETERS}
                />
            </Grid>
            {shortCircuitMethods.paramsLoaded ? (
                <ShortCircuitParametersForm shortCircuitMethods={shortCircuitMethods} />
            ) : (
                <LinearProgress />
            )}
        </CustomMuiDialog>
    );
}
