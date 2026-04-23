/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { ModificationType } from './modificationType';

export interface NetworkModificationMetadata {
    uuid: UUID;
    type: ModificationType;
    date: Date;
    stashed: boolean;
    activated: boolean;
    description: string;
    messageType: string;
    messageValues: string;
}

export interface ComposedModificationMetadata extends NetworkModificationMetadata {
    subModifications: ComposedModificationMetadata[];
    maxDepth?: number;
}
