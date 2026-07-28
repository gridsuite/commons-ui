/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, LinearProgress } from '@mui/material';
import { ElementType, isDisabledValidationButton } from '../../../utils';
import { CustomMuiDialog, NameElementEditorForm } from '../../../components';
import { ParametersEditionDialogProps } from '../common';
import { useVoltageInitParametersForm } from './use-voltage-init-parameters-form';
import { VoltageInitParametersForm } from './voltage-init-parameters-form';

export function VoltageInitParametersEditionDialog({
    id,
    open,
    onClose,
    titleId,
    name,
    description,
    activeDirectory,
    language,
}: Readonly<ParametersEditionDialogProps>) {
    const voltageInitMethods = useVoltageInitParametersForm({
        parametersUuid: id,
        name,
        description,
        studyUuid: null,
        parameters: null,
    });

    const {
        formState: { errors },
    } = voltageInitMethods.formMethods;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={voltageInitMethods.onSaveDialog}
            onValidationError={voltageInitMethods.onValidationError}
            titleId={titleId}
            formContext={{
                ...voltageInitMethods.formMethods,
                validationSchema: voltageInitMethods.formSchema,
                removeOptional: true,
                language,
            }}
            disabledSave={isDisabledValidationButton(errors)}
            PaperProps={{
                sx: {
                    height: '90vh', // we want the dialog height to be fixed even when switching tabs
                },
            }}
        >
            <Grid container sx={{ width: '100%' }}>
                <NameElementEditorForm
                    initialElementName={name}
                    activeDirectory={activeDirectory}
                    elementType={ElementType.VOLTAGE_INIT_PARAMETERS}
                />
            </Grid>
            {voltageInitMethods.paramsLoading ? (
                <LinearProgress />
            ) : (
                <VoltageInitParametersForm voltageInitMethods={voltageInitMethods} />
            )}
        </CustomMuiDialog>
    );
}
