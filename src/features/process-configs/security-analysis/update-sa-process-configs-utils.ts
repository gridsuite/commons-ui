/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { UUID } from 'node:crypto';
import {
    PersistedProcessConfigBackend,
    ProcessType,
    SecurityAnalysisProcessConfig,
    SecurityAnalysisProcessConfigBackend,
} from '../process-configs.type';
import { fetchElementNames } from '../../../services';
import { FieldConstants, YUP_REQUIRED } from '../../../utils';

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
        loadflowParametersUuid: formData.loadflowParameters[0].id as UUID,
        securityAnalysisParametersUuid: formData.securityAnalysisParameters[0].id as UUID,
        modificationUuids: formData.modifications.map((modification) => modification.modification[0].id as UUID),
    };
}

export const updateSAProcessConfigFormSchema = yup.object().shape({
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
    [FieldConstants.SECURITY_ANALYSIS_PARAMETERS]: yup
        .array()
        .required()
        .of(yup.object().shape({ id: yup.string().required(), name: yup.string().required() }))
        .length(1, YUP_REQUIRED),
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

export function isProcessType(type: string): type is ProcessType {
    return Object.values(ProcessType).includes(type as ProcessType);
}
