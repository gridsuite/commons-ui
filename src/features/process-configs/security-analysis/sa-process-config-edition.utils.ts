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
import { processConfigModificationsFormShape, ProcessType } from '../common';
import { SecurityAnalysisProcessConfigBackend } from './sa-process-config.type';

export const saProcessConfigFormShape = {
    ...processConfigModificationsFormShape,
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
};

export const saProcessConfigFormSchema = yup.object().shape({
    ...saProcessConfigFormShape,
});
export type SAProcessConfigFormSchema = yup.InferType<typeof saProcessConfigFormSchema>;

export const emptySAProcessConfigFormData: SAProcessConfigFormSchema = {
    [FieldConstants.MODIFICATIONS]: [],
    [FieldConstants.LOADFLOW_PARAMETERS]: [],
    [FieldConstants.SECURITY_ANALYSIS_PARAMETERS]: [],
};

export async function getSAProcessConfigFormData(
    processConfig: SecurityAnalysisProcessConfigBackend
): Promise<SAProcessConfigFormSchema> {
    const allUuids = new Set<string>([
        ...processConfig.modifications.map((modification) => modification.modificationUuid),
        processConfig.securityAnalysisParametersUuid,
        processConfig.loadflowParametersUuid,
    ]);

    const elementNamesByUuid = await fetchElementNames(allUuids);

    return {
        [FieldConstants.MODIFICATIONS]: processConfig.modifications.map((modification) => ({
            modification: [
                {
                    id: modification.modificationUuid,
                    name: elementNamesByUuid[modification.modificationUuid],
                },
            ],
            active: modification.active,
            description: modification.description ?? undefined,
        })),
        [FieldConstants.SECURITY_ANALYSIS_PARAMETERS]: [
            {
                id: processConfig.securityAnalysisParametersUuid,
                name: elementNamesByUuid[processConfig.securityAnalysisParametersUuid],
            },
        ],
        [FieldConstants.LOADFLOW_PARAMETERS]: [
            {
                id: processConfig.loadflowParametersUuid,
                name: elementNamesByUuid[processConfig.loadflowParametersUuid],
            },
        ],
    } satisfies SAProcessConfigFormSchema;
}

export function getSAProcessConfigBackendFromFormData(
    formData: SAProcessConfigFormSchema
): SecurityAnalysisProcessConfigBackend {
    return {
        processType: ProcessType.SECURITY_ANALYSIS,
        modifications: formData[FieldConstants.MODIFICATIONS].map((row) => ({
            modificationUuid: row.modification[0].id as UUID,
            description: row.description ?? null,
            active: row.active,
        })),
        securityAnalysisParametersUuid: formData[FieldConstants.SECURITY_ANALYSIS_PARAMETERS][0].id as UUID,
        loadflowParametersUuid: formData[FieldConstants.LOADFLOW_PARAMETERS][0].id as UUID,
    };
}
