/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { FieldValues } from 'react-hook-form';
import { FieldConstants, YUP_REQUIRED } from '../../../utils';
import { ProcessConfig, ProcessType } from './process-config.type';

export const processConfigBaseFormShape = {
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
                                name: yup.string(),
                            })
                            .required()
                    )
                    .length(1, YUP_REQUIRED),
            })
        ),
};

export function getProcessConfigFormData<TProcessType extends ProcessType>(
    processConfig: ProcessConfig<TProcessType>,
    name: string,
    description: string | null
): FieldValues {
    // ici c'est faiblement typé -> pas top
    const { processType, ...processConfigData } = processConfig;

    return {
        name,
        description: description ?? undefined,
        ...processConfigData,
    };
}
