/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { UUID } from 'node:crypto';
import { FieldConstants, YUP_REQUIRED } from '../../../utils';
import { ModificationInfo } from './process-config.type';

const processConfigModificationSchema = yup.object().shape({
    modification: yup
        .array()
        .required()
        .of(
            yup
                .object()
                .shape({
                    id: yup.string().required(),
                    name: yup.string(),
                })
                .required()
        )
        .length(1, YUP_REQUIRED),
    description: yup.string().nullable(),
    active: yup.boolean().required(),
});
export type ProcessConfigModification = yup.InferType<typeof processConfigModificationSchema>;

export const processConfigModificationsShape = {
    [FieldConstants.MODIFICATIONS]: yup.array().required().of(processConfigModificationSchema),
};

export const emptyProcessConfigModificationsFormData = { [FieldConstants.MODIFICATIONS]: [] };

export function getProcessConfigModificationsFormData(
    processConfigModifications: ModificationInfo[],
    elementNamesByUuid: Record<string, string>
) {
    return {
        [FieldConstants.MODIFICATIONS]: processConfigModifications.map((modification) => ({
            modification: [
                {
                    id: modification.modificationUuid,
                    name: elementNamesByUuid[modification.modificationUuid],
                },
            ],
            active: modification.active,
            description: modification.description ?? undefined,
        })),
    };
}

export function getProcessConfigModificationsBackendFromFormData(
    formProcessConfigModifications: ProcessConfigModification[]
) {
    return {
        modifications: formProcessConfigModifications.map((row) => ({
            modificationUuid: row.modification[0].id as UUID,
            description: row.description ?? null,
            active: row.active,
        })),
    };
}
