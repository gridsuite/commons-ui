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
import { ParametersEditionDialogProps } from '../common';

export function ShortCircuitParametersEditionDialog({
    id,
    open,
    onClose,
    titleId,
    name,
    description,
    activeDirectory,
    language,
    enableDeveloperMode,
}: Readonly<ParametersEditionDialogProps>) {
    const shortCircuitMethods = useShortCircuitParametersForm({
        parametersUuid: id,
        name,
        description,
        studyUuid: null,
        studyShortCircuitParameters: null,
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
            formSchema={shortCircuitMethods.formSchema}
            formMethods={shortCircuitMethods.formMethods}
            titleId={titleId}
            removeOptional
            language={language}
            disabledSave={disableSave}
        >
            <ShortCircuitParametersForm
                shortCircuitMethods={shortCircuitMethods}
                renderTitleFields={() => {
                    return (
                        <NameElementEditorForm
                            initialElementName={name}
                            activeDirectory={activeDirectory}
                            elementType={ElementType.SHORT_CIRCUIT_PARAMETERS}
                        />
                    );
                }}
                enableDeveloperMode={enableDeveloperMode ?? false}
            />
        </CustomMuiDialog>
    );
}
