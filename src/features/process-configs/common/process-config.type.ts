/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';

export enum ProcessType {
    SECURITY_ANALYSIS = 'SECURITY_ANALYSIS',
    LOADFLOW = 'LOADFLOW',
}

// Backend types
export interface ModificationInfo {
    modificationUuid: UUID;
    description: string | null;
    active: boolean;
}
export interface ProcessConfigBaseBackend {
    processType: ProcessType;
    modifications: ModificationInfo[];
}
