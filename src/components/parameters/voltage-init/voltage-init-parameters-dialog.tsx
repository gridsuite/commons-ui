/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { CustomMuiDialog } from '../../dialogs';
import { ElementType } from '../../../utils';
import { NameElementEditorForm } from '../common/name-element-editor';
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
        formState: { errors, dirtyFields },
    } = voltageInitMethods.formMethods;
    const disableSave = Object.keys(errors).length > 0 || Object.keys(dirtyFields).length === 0;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={voltageInitMethods.onSaveDialog}
            titleId={titleId}
            formContext={{
                ...voltageInitMethods.formMethods,
                validationSchema: voltageInitMethods.formSchema,
                removeOptional: true,
                language,
            }}
            disabledSave={disableSave}
            PaperProps={{
                sx: {
                    height: '90vh', // we want the dialog height to be fixed even when switching tabs
                },
            }}
        >
            <VoltageInitParametersForm
                voltageInitMethods={voltageInitMethods}
                renderTitleFields={() => {
                    return (
                        <NameElementEditorForm
                            initialElementName={name}
                            activeDirectory={activeDirectory}
                            elementType={ElementType.VOLTAGE_INIT_PARAMETERS}
                        />
                    );
                }}
            />
        </CustomMuiDialog>
    );
}
