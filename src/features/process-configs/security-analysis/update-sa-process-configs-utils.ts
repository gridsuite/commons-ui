/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import {
    PersistedProcessConfigBackend,
    ProcessType,
    SecurityAnalysisProcessConfig,
    SecurityAnalysisProcessConfigBackend,
} from '../process-configs.type';
import { fetchElementNames } from '../../../services';

export function getSAProcessConfigFormDataFromFetchedElement(
    processConfig: SecurityAnalysisProcessConfig,
    name: string,
    description: string | null
) {
    return {
        name,
        description: description ?? undefined,
        modifications: processConfig.modifications.map((modification) => ({
            modification: [{ id: modification.id, name: modification.name }],
        })),
        securityAnalysisParameters: [processConfig.securityAnalysisParameters],
        loadflowParameters: [processConfig.loadflowParameters],
    };
}

export function getSAProcessConfigBackendFromFormData(
    formData: UpdateSAProcessConfigFormData
): SecurityAnalysisProcessConfigBackend {
    return {
        processType: ProcessType.SECURITY_ANALYSIS,
        loadflowParametersUuid: formData.loadflowParameters[0].id,
        securityAnalysisParametersUuid: formData.securityAnalysisParameters[0].id,
        modificationUuids: formData.modifications.map((modification) => modification.modification[0].id),
    };
}

export const updateSAProcessConfigFormSchema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    modifications: yup
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
                    .length(1, 'atLeastOneItemError'),
            })
        ),
    loadflowParameters: yup
        .array()
        .required()
        .of(yup.object().shape({ id: yup.string().required(), name: yup.string().required() }))
        .length(1, 'atLeastOneItemError'),
    securityAnalysisParameters: yup
        .array()
        .required()
        .of(yup.object().shape({ id: yup.string().required(), name: yup.string().required() }))
        .length(1, 'atLeastOneItemError'),
});

export type UpdateSAProcessConfigFormData = yup.InferType<typeof updateSAProcessConfigFormSchema>;

export async function toSAProcessConfig(persistedProcessConfig: PersistedProcessConfigBackend) {
    const { processConfig } = persistedProcessConfig;
    const allUuids = new Set<string>([
        ...processConfig.modificationUuids,
        processConfig.securityAnalysisParametersUuid,
        processConfig.loadflowParametersUuid,
    ]);

    const elementNamesByUuid = await fetchElementNames(allUuids);

    return {
        processType: processConfig.processType,
        modifications: processConfig.modificationUuids.map((uuid) => ({
            id: uuid,
            name: elementNamesByUuid[uuid],
            enabled: true,
            description: undefined,
        })),
        securityAnalysisParameters: {
            id: processConfig.securityAnalysisParametersUuid,
            name: elementNamesByUuid[processConfig.securityAnalysisParametersUuid],
        },
        loadflowParameters: {
            id: processConfig.loadflowParametersUuid,
            name: elementNamesByUuid[processConfig.loadflowParametersUuid],
        },
    } satisfies SecurityAnalysisProcessConfig;
}