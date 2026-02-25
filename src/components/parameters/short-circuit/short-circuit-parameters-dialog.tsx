/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { CustomMuiDialog } from '../../dialogs';
import { ElementType } from '../../../utils';
import { NameElementEditorForm } from '../common/name-element-editor';
import { useShortCircuitParametersForm } from './use-short-circuit-parameters-form';
import { ShortCircuitParametersForm } from './short-circuit-parameters-form';
import { ComputingType, ParametersEditionDialogProps } from '../common';
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
    user,
    language,
    isDeveloperMode,
}: Readonly<ParametersEditionDialogProps & { isDeveloperMode: boolean }>) {
    const parametersBackend = useParametersBackend(
        user,
        id,
        ComputingType.SHORT_CIRCUIT,
        OptionalServicesStatus.Up,
        null,
        null,
        null,
        null,
        fetchShortCircuitParameters,
        updateShortCircuitParameters,
        getShortCircuitSpecificParametersDescription
    );

    const shortCircuitMethods = useShortCircuitParametersForm({
        parametersBackend,
        parametersUuid: id,
        name,
        description,
    });

    const {
        formState: { errors, dirtyFields },
    } = shortCircuitMethods.formMethods;
    const disableSave = Object.keys(errors).length > 0 || Object.keys(dirtyFields).length === 0;

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
            disabledSave={disableSave}
        >
            <ShortCircuitParametersForm
                shortCircuitMethods={shortCircuitMethods}
                isDeveloperMode={isDeveloperMode}
                renderTitleFields={() => {
                    return (
                        <NameElementEditorForm
                            initialElementName={name}
                            activeDirectory={activeDirectory}
                            elementType={ElementType.SHORT_CIRCUIT_PARAMETERS}
                        />
                    );
                }}
            />
        </CustomMuiDialog>
    );
}
