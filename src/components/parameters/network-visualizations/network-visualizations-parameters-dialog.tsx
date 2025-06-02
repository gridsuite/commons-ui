/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { User } from 'oidc-client';
import { CustomMuiDialog } from '../../dialogs';
import { ElementType } from '../../../utils';
import { NetworkVisualizationParametersForm } from './network-visualizations-form';
import { useNetworkVisualizationParametersForm } from './use-network-visualizations-parameters-form';
import { NameElementEditorForm } from '../common/name-element-editor';

export interface NetworkVisualizationsParametersEditionDialogProps {
    id: UUID;
    open: boolean;
    onClose: () => void;
    titleId: string;
    name: string;
    description: string | null;
    activeDirectory: UUID;
    language?: string;
    user: User | null;
}

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
}: Readonly<NetworkVisualizationsParametersEditionDialogProps>) {
    const networkVisuMethods = useNetworkVisualizationParametersForm(id, null, null, name, description);

    const {
        formState: { errors, dirtyFields },
    } = networkVisuMethods.formMethods;
    const disableSave = Object.keys(errors).length > 0 || Object.keys(dirtyFields).length === 0;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={networkVisuMethods.onSaveDialog}
            formSchema={networkVisuMethods.formSchema}
            formMethods={networkVisuMethods.formMethods}
            titleId={titleId}
            removeOptional
            language={language}
            disabledSave={disableSave}
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
                        ></NameElementEditorForm>
                    );
                }}
            />
        </CustomMuiDialog>
    );
}
