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
    LoadflowProcessConfigBackend,
    namedFormShape,
    processConfigModificationsFormShape,
    ProcessType,
} from '../common';

export function getLFProcessConfigBackendFromFormData(
    formData: NamedLFProcessConfigFormData
): LoadflowProcessConfigBackend {
    return {
        processType: ProcessType.LOADFLOW,
        loadflowParametersUuid: formData.loadflowParameters[0].id as UUID,
        modificationUuids: formData.modifications.map((modification) => modification.modification[0].id as UUID),
    };
}

export const lfProcessConfigSpecificFormShape = {
    [FieldConstants.LOADFLOW_PARAMETERS]: yup
        .array()
        .required()
        .of(yup.object().shape({ id: yup.string().required(), name: yup.string() }))
        .length(1, YUP_REQUIRED),
};

export const lfProcessConfigFormSchema = yup.object().shape({
    ...processConfigModificationsFormShape,
    ...lfProcessConfigSpecificFormShape,
});

export const namedLFProcessConfigFormSchema = yup.object().shape({
    ...namedFormShape,
    ...processConfigModificationsFormShape,
    ...lfProcessConfigSpecificFormShape,
});

export type LFProcessConfigFormData = yup.InferType<typeof lfProcessConfigFormSchema>;
export type NamedLFProcessConfigFormData = yup.InferType<typeof namedLFProcessConfigFormSchema>;

export async function toLFProcessConfig(processConfig: LoadflowProcessConfigBackend) {
    const allUuids = new Set<string>([...processConfig.modificationUuids, processConfig.loadflowParametersUuid]);

    const elementNamesByUuid = await fetchElementNames(allUuids);

    return {
        modifications: processConfig.modificationUuids.map((uuid) => ({
            modification: [{ id: uuid, name: elementNamesByUuid[uuid] }],
            enabled: true,
            description: undefined,
        })),
        loadflowParameters: [
            {
                id: processConfig.loadflowParametersUuid,
                name: elementNamesByUuid[processConfig.loadflowParametersUuid],
            },
        ],
    } satisfies LFProcessConfigFormData;
}
