/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import type { ProcessConfigBaseBackend, ProcessType } from './process-config.type';
import type {
    PROCESS_CONFIG_TYPE_DEFINITIONS,
    ProcessConfigParameterUuidProperties,
} from './process-config-type.definitions';

type ProcessConfigParameterUuidProperty<TProcessType extends ProcessType> =
    TProcessType extends keyof typeof PROCESS_CONFIG_TYPE_DEFINITIONS
        ? (typeof PROCESS_CONFIG_TYPE_DEFINITIONS)[TProcessType]['parameters'][number]['backendProperty']
        : never;

type ProcessConfigBackendByProcessType = {
    [TProcessType in ProcessType]: ProcessConfigBaseBackend & {
        processType: TProcessType;
    } & Pick<ProcessConfigParameterUuidProperties, ProcessConfigParameterUuidProperty<TProcessType>>;
};

export type ProcessConfigBackend<TProcessType extends ProcessType = ProcessType> =
    ProcessConfigBackendByProcessType[TProcessType];

export type PersistedProcessConfigBackend<TProcessType extends ProcessType = ProcessType> = {
    id: UUID;
    processConfig: ProcessConfigBackend<TProcessType>;
};
