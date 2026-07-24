/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { FieldConstants, YUP_REQUIRED } from '../../../utils';
// eslint-disable-next-line import-x/no-cycle
import { ProcessConfigFormData, NamedProcessConfigFormData, ProcessType } from './process-config.type';

export const namedFormShape = {
    [FieldConstants.NAME]: yup.string().required(),
    [FieldConstants.DESCRIPTION]: yup.string(),
};

export const processConfigModificationsFormShape = {
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
                                name: yup.string(),
                            })
                            .required()
                    )
                    .length(1, YUP_REQUIRED),
                description: yup.string().nullable(),
                enabled: yup.boolean().required(),
            })
        ),
};

export function getProcessConfigFormData<TProcessType extends ProcessType>(
    processConfig: ProcessConfigFormData<TProcessType>,
    name: string,
    description: string | null
): NamedProcessConfigFormData<TProcessType> {
    return {
        name,
        description: description ?? undefined,
        ...processConfig,
    } as NamedProcessConfigFormData<TProcessType>;
}
