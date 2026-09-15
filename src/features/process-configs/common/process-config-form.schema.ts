/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { directoryItemSchema } from '../../../components';
import { FieldConstants, YUP_REQUIRED } from '../../../utils';
import { ProcessType } from './process-config.type';
import { processConfigModificationsShape } from './process-config-modifications-edition.utils';
import type { ProcessConfigMode } from './process-config-form.types';
import {
    PROCESS_CONFIG_PARAMETER_FIELDS,
    getProcessTypesRequiringParameter,
    type ProcessConfigParameterField,
} from './process-config-type.definitions';

const parameterSelectionSchema = yup.object({
    id: yup.string().required(),
    name: yup.string(),
});

const parameterField = (field: ProcessConfigParameterField) =>
    yup
        .array()
        .of(parameterSelectionSchema)
        .when('processType', {
            is: (value: unknown) => getProcessTypesRequiringParameter(field).includes(value as ProcessType),
            then: (schema) => schema.required().length(1, YUP_REQUIRED),
            otherwise: (schema) => schema,
        });

export function getProcessConfigFormSchema(mode: ProcessConfigMode) {
    const parameterFields: Record<string, yup.AnySchema> = {};
    PROCESS_CONFIG_PARAMETER_FIELDS.forEach((field) => {
        parameterFields[field] = parameterField(field);
    });

    return yup.object().shape({
        processType: yup.string().oneOf(Object.values(ProcessType)).required(),

        [FieldConstants.NAME]: yup.string().trim().required(),

        [FieldConstants.DESCRIPTION]: yup.string().optional(),

        ...processConfigModificationsShape,

        ...parameterFields,

        ...(mode === 'create'
            ? {
                  [FieldConstants.DIRECTORY]: directoryItemSchema.nullable().required(),
              }
            : {}),
    });
}
