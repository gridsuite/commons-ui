/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { fetchElementNames } from '../../../services';
import { FieldConstants } from '../../../utils';
import {
    getProcessConfigModificationsBackendFromFormData,
    getProcessConfigModificationsFormData,
} from './process-config-modifications-edition.utils';
import type { ProcessConfigBackend, PersistedProcessConfigBackend } from './process-config-backend.type';
import type { ProcessConfigFormValues, ProcessConfigParameterRef } from './process-config-form.types';
import { ProcessType } from './process-config.type';
import {
    getProcessConfigTypeDefinition,
    type ProcessConfigParameterField,
    type ProcessConfigParameterUuidProperties,
    type ProcessConfigWatchedGeneratorsProperties,
} from './process-config-type.definitions';

export async function getProcessConfigFormData(
    persistedProcessConfig: PersistedProcessConfigBackend,
    name: string,
    description: string | null
): Promise<ProcessConfigFormValues> {
    const { processConfig } = persistedProcessConfig;
    const definition = getProcessConfigTypeDefinition(processConfig.processType);
    if (!definition) {
        throw new Error(`Unsupported process type: ${processConfig.processType}`);
    }

    const backendParameters = processConfig as unknown as ProcessConfigParameterUuidProperties;
    const parameterUuids = definition.parameters.map(({ backendProperty }) => backendParameters[backendProperty]);
    const { watchedGenerators } = definition;
    const backendWatchedGenerators = processConfig as typeof processConfig &
        Partial<ProcessConfigWatchedGeneratorsProperties>;
    const watchedGeneratorUuids = watchedGenerators
        ? (backendWatchedGenerators[watchedGenerators.backendProperty] ?? [])
        : [];

    const allUuids = new Set<string>([
        ...processConfig.modifications.map((modification) => modification.modificationUuid),
        ...parameterUuids,
        ...watchedGeneratorUuids,
    ]);
    const elementNamesByUuid = await fetchElementNames(allUuids);

    const parameterValues: Partial<Record<ProcessConfigParameterField, ProcessConfigParameterRef[]>> = {};
    definition.parameters.forEach(({ field, backendProperty }) => {
        const uuid = backendParameters[backendProperty];
        parameterValues[field] = [{ id: uuid, name: elementNamesByUuid[uuid] }];
    });

    const watchedGeneratorValues: Partial<
        Record<FieldConstants.PCC_MIN_WATCHED_GENERATORS, ProcessConfigParameterRef[]>
    > = {};
    if (watchedGenerators) {
        watchedGeneratorValues[watchedGenerators.field] = watchedGeneratorUuids.map((id) => ({
            id,
            name: elementNamesByUuid[id],
        }));
    }

    return {
        processType: processConfig.processType,
        [FieldConstants.NAME]: name,
        [FieldConstants.DESCRIPTION]: description ?? undefined,
        ...getProcessConfigModificationsFormData(processConfig.modifications, elementNamesByUuid),
        ...parameterValues,
        ...watchedGeneratorValues,
    };
}

export function getProcessConfigBackendFromFormData(formData: ProcessConfigFormValues): ProcessConfigBackend {
    const processType = formData.processType as ProcessType;
    const definition = getProcessConfigTypeDefinition(processType);
    if (!definition) {
        throw new Error(`Unsupported process type: ${formData.processType}`);
    }

    const backendParameters: Partial<ProcessConfigParameterUuidProperties> = {};
    definition.parameters.forEach(({ field, backendProperty }) => {
        const [parameter] = formData[field] ?? [];
        if (parameter?.id) {
            backendParameters[backendProperty] =
                parameter.id as ProcessConfigParameterUuidProperties[keyof ProcessConfigParameterUuidProperties];
        }
    });

    const watchedGeneratorValues: Partial<ProcessConfigWatchedGeneratorsProperties> = {};
    if (definition.watchedGenerators) {
        watchedGeneratorValues[definition.watchedGenerators.backendProperty] = (
            formData[definition.watchedGenerators.field] ?? []
        )
            .map(({ id }) => id)
            .filter(Boolean) as UUID[];
    }

    return {
        processType,
        ...getProcessConfigModificationsBackendFromFormData(formData[FieldConstants.MODIFICATIONS] ?? []),
        ...backendParameters,
        ...watchedGeneratorValues,
    } as unknown as ProcessConfigBackend;
}
