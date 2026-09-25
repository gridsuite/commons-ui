/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { PermissionType } from '../../services/directory';
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
    // MODIFICATION_REFERENCE only: uuid of the referenced composite modification
    referencedId?: UUID;
    // MODIFICATION_REFERENCE only: what the user may do with the shared modification it points at.
    permission?: PermissionType;
    applicabilityByRootNetworkTag?: Record<string, boolean>;
}

export interface BasicComposedModificationMetadata extends NetworkModificationMetadata {
    subModifications: ComposedModificationMetadata[];
    parentCompositeUuid?: UUID;
    maxDepth?: number;
    name?: string;
    childFromShared?: boolean;
    // Same as above, restricted to the shared modifications the user may not write into
    childFromReadOnlyShared?: boolean;
}

export interface ComposedModificationMetadata extends BasicComposedModificationMetadata {
    rowKey: UUID;
}
export interface ReferencedCompositeModifications extends NetworkModificationMetadata {
    modificationsInfos?: NetworkModificationMetadata[];
}

export interface ModificationReferenceInfos extends NetworkModificationMetadata {
    referenceType?: string;
    referencedInfos?: BasicComposedModificationMetadata;
}
