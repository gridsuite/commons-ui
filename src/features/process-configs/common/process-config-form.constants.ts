/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../../../utils';
import { ProcessType } from './process-config.type';
import type {
    ProcessConfigFormValues,
    ProcessConfigMode,
    ProcessConfigParameterRef,
} from './process-config-form.types';
import {
    PROCESS_CONFIG_PARAMETER_FIELDS,
    PROCESS_CONFIG_TYPE_DEFINITIONS,
    type ProcessConfigParameterField,
} from './process-config-type.definitions';

export const PROCESS_CONFIG_TYPES = Object.entries(PROCESS_CONFIG_TYPE_DEFINITIONS).map(
    ([processType, definition]) => ({
        id: processType as ProcessType,
        label: definition.label,
    })
);

function getEmptyParameterValues(): Partial<Record<ProcessConfigParameterField, ProcessConfigParameterRef[]>> {
    const parameterValues: Partial<Record<ProcessConfigParameterField, ProcessConfigParameterRef[]>> = {};
    PROCESS_CONFIG_PARAMETER_FIELDS.forEach((field) => {
        parameterValues[field] = [];
    });
    return parameterValues;
}

function getEmptyWatchedGeneratorsValues(): Partial<
    Record<FieldConstants.PCC_MIN_WATCHED_GENERATORS, ProcessConfigParameterRef[]>
> {
    const watchedGeneratorsValues: Partial<
        Record<FieldConstants.PCC_MIN_WATCHED_GENERATORS, ProcessConfigParameterRef[]>
    > = {};

    Object.values(PROCESS_CONFIG_TYPE_DEFINITIONS).forEach((definition) => {
        if ('watchedGenerators' in definition && definition.watchedGenerators) {
            const { watchedGenerators } = definition;
            watchedGeneratorsValues[watchedGenerators.field as FieldConstants.PCC_MIN_WATCHED_GENERATORS] = [];
        }
    });

    return watchedGeneratorsValues;
}

export function getProcessConfigFormDefaultValues(mode: ProcessConfigMode): ProcessConfigFormValues {
    const defaultValues: ProcessConfigFormValues = {
        processType: '',
        [FieldConstants.NAME]: '',
        [FieldConstants.DESCRIPTION]: '',
        [FieldConstants.MODIFICATIONS]: [],
        ...getEmptyParameterValues(),
        ...getEmptyWatchedGeneratorsValues(),
    };

    if (mode === 'create') {
        return {
            ...defaultValues,
            [FieldConstants.DIRECTORY]: { directoryItemId: '', directoryItemFullPath: '' },
        };
    }

    return defaultValues;
}
