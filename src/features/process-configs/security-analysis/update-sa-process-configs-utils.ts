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
// eslint-disable-next-line import-x/no-cycle
import {
    namedFormShape,
    processConfigModificationsFormShape,
    ProcessType,
    SecurityAnalysisProcessConfigBackend,
} from '../common';

export function getSAProcessConfigBackendFromFormData(
    formData: NamedSAProcessConfigFormData
): SecurityAnalysisProcessConfigBackend {
    return {
        processType: ProcessType.SECURITY_ANALYSIS,
        modifications: formData.modifications.map((row) => ({
            modificationUuid: row.modification[0].id as UUID,
            description: row.description ?? null,
            active: row.active,
        })),
        securityAnalysisParametersUuid: formData.securityAnalysisParameters[0].id as UUID,
        loadflowParametersUuid: formData.loadflowParameters[0].id as UUID,
    };
}

export const SAProcessConfigSpecificFormShape = {
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
export const SAProcessConfigFormSchema = yup.object().shape({
    ...processConfigModificationsFormShape,
    ...SAProcessConfigSpecificFormShape,
});

export const NamedSAProcessConfigFormSchema = yup.object().shape({
    ...namedFormShape,
    ...processConfigModificationsFormShape,
    ...SAProcessConfigSpecificFormShape,
});

export type SAProcessConfigFormData = yup.InferType<typeof SAProcessConfigFormSchema>;

export type NamedSAProcessConfigFormData = yup.InferType<typeof NamedSAProcessConfigFormSchema>;

export async function toSAProcessConfig(
    processConfig: SecurityAnalysisProcessConfigBackend
): Promise<SAProcessConfigFormData> {
    const allUuids = new Set<string>([
        ...processConfig.modifications.map((modification) => modification.modificationUuid),
        processConfig.securityAnalysisParametersUuid,
        processConfig.loadflowParametersUuid,
    ]);

    const elementNamesByUuid = await fetchElementNames(allUuids);

    return {
        modifications: processConfig.modifications.map((modification) => ({
            modification: [
                {
                    id: modification.modificationUuid,
                    name: elementNamesByUuid[modification.modificationUuid],
                },
            ],
            active: modification.active,
            description: modification.description ?? undefined,
        })),
        securityAnalysisParameters: [
            {
                id: processConfig.securityAnalysisParametersUuid,
                name: elementNamesByUuid[processConfig.securityAnalysisParametersUuid],
            },
        ],
        loadflowParameters: [
            {
                id: processConfig.loadflowParametersUuid,
                name: elementNamesByUuid[processConfig.loadflowParametersUuid],
            },
        ],
    } satisfies SAProcessConfigFormData;
}
