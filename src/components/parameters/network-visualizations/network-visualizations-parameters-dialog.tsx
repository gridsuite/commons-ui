/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { CustomMuiDialog } from '../../dialogs';
import { ElementType } from '../../../utils';
import { NetworkVisualizationParametersForm } from './network-visualizations-form';
import { useNetworkVisualizationParametersForm } from './use-network-visualizations-parameters-form';
import { NameElementEditorForm } from '../common/name-element-editor';
import { ParametersEditionDialogProps } from '../common';

export function NetworkVisualizationsParametersEditionDialog({
    id,
    open,
    onClose,
    titleId,
    name,
    description,
    activeDirectory,
    language,
    user,
}: Readonly<ParametersEditionDialogProps>) {
    const networkVisuMethods = useNetworkVisualizationParametersForm({
        parametersUuid: id,
        name,
        description,
        studyUuid: null,
        parameters: null,
    });

    const {
        formState: { errors, dirtyFields },
    } = networkVisuMethods.formMethods;
    const disableSave = Object.keys(errors).length > 0 || Object.keys(dirtyFields).length === 0;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={networkVisuMethods.onSaveDialog}
            formContext={{
                ...networkVisuMethods.formMethods,
                validationSchema: networkVisuMethods.formSchema,
                removeOptional: true,
                language,
            }}
            titleId={titleId}
            disabledSave={disableSave}
            PaperProps={{
                sx: {
                    height: '65vh', // we want the dialog height to be fixed even when switching tabs
                },
            }}
        >
            <NetworkVisualizationParametersForm
                user={user}
                networkVisuMethods={networkVisuMethods}
                renderTitleFields={() => {
                    return (
                        <NameElementEditorForm
                            initialElementName={name}
                            activeDirectory={activeDirectory}
                            elementType={ElementType.NETWORK_VISUALIZATIONS_PARAMETERS}
                        />
                    );
                }}
            />
        </CustomMuiDialog>
    );
}
