/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { ElementType, FieldConstants, ParameterType, SpecificParameterInfos } from '../../../utils';
import { ProcessType } from './process-config.type';

export type ProcessConfigParameterField =
    | FieldConstants.LOADFLOW_PARAMETERS
    | FieldConstants.SECURITY_ANALYSIS_PARAMETERS
    | FieldConstants.SHORTCIRCUIT_PARAMETERS;

export type ProcessConfigParameterUuidProperties = {
    loadflowParametersUuid: UUID;
    securityAnalysisParametersUuid: UUID;
    shortCircuitParametersUuid: UUID;
};

export type ProcessConfigParameterDefinition = {
    field: ProcessConfigParameterField;
    elementType: ElementType;
    label: string;
    backendProperty: keyof ProcessConfigParameterUuidProperties;
};

export type ProcessConfigTypeDefinition = {
    label: string;
    parameters: ProcessConfigParameterDefinition[];
    advancedParams?: SpecificParameterInfos[];
};

export const PROCESS_CONFIG_TYPE_DEFINITIONS = {
    [ProcessType.SECURITY_ANALYSIS]: {
        label: 'process_config/securityAnalysis',
        parameters: [
            {
                field: FieldConstants.LOADFLOW_PARAMETERS,
                elementType: ElementType.LOADFLOW_PARAMETERS,
                label: 'process_config/loadflow',
                backendProperty: 'loadflowParametersUuid',
            },
            {
                field: FieldConstants.SECURITY_ANALYSIS_PARAMETERS,
                elementType: ElementType.SECURITY_ANALYSIS_PARAMETERS,
                label: 'process_config/securityAnalysis',
                backendProperty: 'securityAnalysisParametersUuid',
            },
        ],
        advancedParams: [
            {
                name: 'testField',
                type: ParameterType.BOOLEAN,
                label: 'testField',
            },
        ],
    },
    [ProcessType.LOADFLOW]: {
        label: 'process_config/loadflow',
        parameters: [
            {
                field: FieldConstants.LOADFLOW_PARAMETERS,
                elementType: ElementType.LOADFLOW_PARAMETERS,
                label: 'process_config/loadflow',
                backendProperty: 'loadflowParametersUuid',
            },
        ],
    },
    [ProcessType.SHORT_CIRCUIT]: {
        label: 'process_config/shortcircuit',
        parameters: [
            {
                field: FieldConstants.SHORTCIRCUIT_PARAMETERS,
                elementType: ElementType.SHORT_CIRCUIT_PARAMETERS,
                label: 'process_config/shortcircuit',
                backendProperty: 'shortCircuitParametersUuid',
            },
        ],
    },
} as const satisfies Record<ProcessType, ProcessConfigTypeDefinition>;

const definitionsByProcessType: Partial<Record<ProcessType, ProcessConfigTypeDefinition>> =
    PROCESS_CONFIG_TYPE_DEFINITIONS;

export const PROCESS_CONFIG_PARAMETER_FIELDS: ProcessConfigParameterField[] = [
    ...new Set(
        Object.values(PROCESS_CONFIG_TYPE_DEFINITIONS).flatMap((definition) =>
            definition.parameters.map((parameter) => parameter.field)
        )
    ),
];

export function getProcessConfigTypeDefinition(processType: ProcessType | ''): ProcessConfigTypeDefinition | undefined {
    return definitionsByProcessType[processType as ProcessType];
}

export function getProcessTypesRequiringParameter(field: ProcessConfigParameterField): ProcessType[] {
    return Object.values(ProcessType).filter((processType) =>
        getProcessConfigTypeDefinition(processType)?.parameters.some((parameter) => parameter.field === field)
    );
}


export function getAdvancedParameterDefinitions() {
    const definitions = new Map<
        string,
        {
            parameter: SpecificParameterInfos;
            processTypes: ProcessType[];
        }
    >();

    Object.entries(PROCESS_CONFIG_TYPE_DEFINITIONS).forEach(([processType, definition]) => {
        definition.advancedParams?.forEach((parameter) => {
            const existing = definitions.get(parameter.name);

            if (existing) {
                existing.processTypes.push(processType as ProcessType);
            } else {
                definitions.set(parameter.name, {
                    parameter,
                    processTypes: [processType as ProcessType],
                });
            }
        });
    });

    return [...definitions.values()];
}
