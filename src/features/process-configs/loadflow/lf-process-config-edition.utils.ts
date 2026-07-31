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
import { LoadflowProcessConfigBackend } from './lf-process-config.type';

export const lfProcessConfigFormShape = {
    ...processConfigModificationsFormShape,
    [FieldConstants.LOADFLOW_PARAMETERS]: yup
        .array()
        .required()
        .of(yup.object().shape({ id: yup.string().required(), name: yup.string() }))
        .length(1, YUP_REQUIRED),
};

export const lfProcessConfigFormSchema = yup.object().shape({
    ...lfProcessConfigFormShape,
});
export type LFProcessConfigFormSchema = yup.InferType<typeof lfProcessConfigFormSchema>;

export const emptyLFProcessConfigFormData: LFProcessConfigFormSchema = {
    [FieldConstants.MODIFICATIONS]: [],
    [FieldConstants.LOADFLOW_PARAMETERS]: [],
};

export async function getLFProcessConfigFormData(
    processConfig: LoadflowProcessConfigBackend
): Promise<LFProcessConfigFormSchema> {
    const allUuids = new Set<string>([
        ...processConfig.modifications.map((modification) => modification.modificationUuid),
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
        [FieldConstants.LOADFLOW_PARAMETERS]: [
            {
                id: processConfig.loadflowParametersUuid,
                name: elementNamesByUuid[processConfig.loadflowParametersUuid],
            },
        ],
    } satisfies LFProcessConfigFormSchema;
}

export function getLFProcessConfigBackendFromFormData(
    formData: LFProcessConfigFormSchema
): LoadflowProcessConfigBackend {
    return {
        processType: ProcessType.LOADFLOW,
        modifications: formData[FieldConstants.MODIFICATIONS].map((row) => ({
            modificationUuid: row.modification[0].id as UUID,
            description: row.description ?? null,
            active: row.active,
        })),
        loadflowParametersUuid: formData[FieldConstants.LOADFLOW_PARAMETERS][0].id as UUID,
    };
}
