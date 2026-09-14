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
import { ShortcircuitProcessConfigBackend } from './sc-process-config.type';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../../../components';

export function getNamedSCProcessConfigFormSchema(initialName: string | null) {
    const formSchema = yup.object().shape({
        ...processConfigModificationsShape,
        [FieldConstants.SHORTCIRCUIT_PARAMETERS]: yup
            .array()
            .required()
            .of(yup.object().shape({ id: yup.string().required(), name: yup.string() }))
            .length(1, YUP_REQUIRED),
    });
    return formSchema.concat(getNameElementEditorSchema(initialName));
}
export type NamedSCProcessConfigFormSchema = yup.InferType<ReturnType<typeof getNamedSCProcessConfigFormSchema>>;

export function getEmptySCProcessConfigFormData(initialName: string | null, initialDescription: string | null) {
    return {
        ...getNameElementEditorEmptyFormData(initialName, initialDescription),
        ...emptyProcessConfigModificationsFormData,
        [FieldConstants.SHORTCIRCUIT_PARAMETERS]: [],
    };
}

export async function getNamedSCProcessConfigFormData(
    processConfig: ShortcircuitProcessConfigBackend,
    name: string,
    description: string | null
): Promise<NamedSCProcessConfigFormSchema> {
    const allUuids = new Set<string>([
        ...processConfig.modifications.map((modification) => modification.modificationUuid),
        processConfig.shortCircuitParametersUuid,
    ]);

    const elementNamesByUuid = await fetchElementNames(allUuids);

    return {
        name,
        description: description ?? undefined,
        ...getProcessConfigModificationsFormData(processConfig.modifications, elementNamesByUuid),
        [FieldConstants.SHORTCIRCUIT_PARAMETERS]: [
            {
                id: processConfig.shortCircuitParametersUuid,
                name: elementNamesByUuid[processConfig.shortCircuitParametersUuid],
            },
        ],
    };
}

export function getSCProcessConfigBackendFromFormData(
    formData: NamedSCProcessConfigFormSchema
): ShortcircuitProcessConfigBackend {
    return {
        processType: ProcessType.SHORT_CIRCUIT,
        ...getProcessConfigModificationsBackendFromFormData(formData[FieldConstants.MODIFICATIONS]),
        shortCircuitParametersUuid: formData[FieldConstants.SHORTCIRCUIT_PARAMETERS][0].id as UUID,
    };
}
