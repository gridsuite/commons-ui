/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { UUID } from 'node:crypto';
import { fetchElementNames } from '../../../services';
import { FieldConstants, YUP_REQUIRED } from '../../../utils';
import {
    emptyProcessConfigModificationsFormData,
    getProcessConfigModificationsBackendFromFormData,
    getProcessConfigModificationsFormData,
    processConfigModificationsShape,
    ProcessType,
} from '../common';
import { LoadflowProcessConfigBackend } from './lf-process-config.type';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../../../components';

export function getNamedLFProcessConfigFormSchema(initialName: string | null) {
    const formSchema = yup.object().shape({
        ...processConfigModificationsShape,
        [FieldConstants.LOADFLOW_PARAMETERS]: yup
            .array()
            .required()
            .of(yup.object().shape({ id: yup.string().required(), name: yup.string() }))
            .length(1, YUP_REQUIRED),
    });
    return formSchema.concat(getNameElementEditorSchema(initialName));
}
export type NamedLFProcessConfigFormSchema = yup.InferType<ReturnType<typeof getNamedLFProcessConfigFormSchema>>;

export function getEmptyLFProcessConfigFormData(initialName: string | null, initialDescription: string | null) {
    return {
        ...getNameElementEditorEmptyFormData(initialName, initialDescription),
        ...emptyProcessConfigModificationsFormData,
        [FieldConstants.LOADFLOW_PARAMETERS]: [],
    };
}

export async function getNamedLFProcessConfigFormData(
    processConfig: LoadflowProcessConfigBackend,
    name: string,
    description: string | null
): Promise<NamedLFProcessConfigFormSchema> {
    const allUuids = new Set<string>([
        ...processConfig.modifications.map((modification) => modification.modificationUuid),
        processConfig.loadflowParametersUuid,
    ]);

    const elementNamesByUuid = await fetchElementNames(allUuids);

    return {
        name,
        description: description ?? undefined,
        ...getProcessConfigModificationsFormData(processConfig.modifications, elementNamesByUuid),
        [FieldConstants.LOADFLOW_PARAMETERS]: [
            {
                id: processConfig.loadflowParametersUuid,
                name: elementNamesByUuid[processConfig.loadflowParametersUuid],
            },
        ],
    };
}

export function getLFProcessConfigBackendFromFormData(
    formData: NamedLFProcessConfigFormSchema
): LoadflowProcessConfigBackend {
    return {
        processType: ProcessType.LOADFLOW,
        ...getProcessConfigModificationsBackendFromFormData(formData[FieldConstants.MODIFICATIONS]),
        loadflowParametersUuid: formData[FieldConstants.LOADFLOW_PARAMETERS][0].id as UUID,
    };
}
