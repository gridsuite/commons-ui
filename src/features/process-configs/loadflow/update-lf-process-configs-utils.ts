/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { UUID } from 'node:crypto';
import {
    LoadflowProcessConfig,
    LoadflowProcessConfigBackend,
    PersistedProcessConfigBackend,
    ProcessType,
} from '../process-configs.type';
import { fetchElementNames } from '../../../services';
import { FieldConstants, YUP_REQUIRED } from '../../../utils';

export function getLFProcessConfigFormDataFromFetchedElement(
    processConfig: LoadflowProcessConfig,
    name: string,
    description: string | null
) {
    return {
        name,
        description: description ?? undefined,
        modifications: processConfig.modifications.map((modification) => ({
            modification: [{ id: modification.id, name: modification.name }],
        })),
        loadflowParameters: [processConfig.loadflowParameters],
    };
}

export function getLFProcessConfigBackendFromFormData(
    formData: UpdateLFProcessConfigFormData
): LoadflowProcessConfigBackend {
    return {
        processType: ProcessType.LOADFLOW,
        loadflowParametersUuid: formData.loadflowParameters[0].id as UUID,
        modificationUuids: formData.modifications.map((modification) => modification.modification[0].id as UUID),
    };
}

export const updateLFProcessConfigFormSchema = yup.object().shape({
    [FieldConstants.NAME]: yup.string().required(),
    [FieldConstants.DESCRIPTION]: yup.string(),
    [FieldConstants.MODIFICATIONS]: yup
        .array()
        .required()
        .of(
            yup.object().shape({
                modification: yup
                    .array()
                    .required()
                    .of(
                        yup
                            .object()
                            .shape({
                                id: yup.string().required(),
                                name: yup.string().required(),
                            })
                            .required()
                    )
                    .length(1, YUP_REQUIRED),
            })
        ),
    [FieldConstants.LOADFLOW_PARAMETERS]: yup
        .array()
        .required()
        .of(yup.object().shape({ id: yup.string().required(), name: yup.string().required() }))
        .length(1, YUP_REQUIRED),
});

export type UpdateLFProcessConfigFormData = yup.InferType<typeof updateLFProcessConfigFormSchema>;

export async function toLFProcessConfig(persistedProcessConfig: PersistedProcessConfigBackend) {
    const { processConfig } = persistedProcessConfig;
    const lfProcessConfig = processConfig as LoadflowProcessConfigBackend;

    const allUuids = new Set<string>([...lfProcessConfig.modificationUuids, lfProcessConfig.loadflowParametersUuid]);

    const elementNamesByUuid = await fetchElementNames(allUuids);

    return {
        processType: lfProcessConfig.processType,
        modifications: lfProcessConfig.modificationUuids.map((uuid) => ({
            id: uuid,
            name: elementNamesByUuid[uuid],
            enabled: true,
            description: undefined,
        })),
        loadflowParameters: {
            id: lfProcessConfig.loadflowParametersUuid,
            name: elementNamesByUuid[lfProcessConfig.loadflowParametersUuid],
        },
    } satisfies LoadflowProcessConfig;
}
