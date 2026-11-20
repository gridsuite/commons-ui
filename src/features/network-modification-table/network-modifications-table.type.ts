/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import type { ModificationMoveInfos } from '../../services';
import type { ComposedModificationMetadata, NetworkModificationMetadata } from '../../utils';

export type ModificationMetadataUpdate = Partial<NetworkModificationMetadata | ComposedModificationMetadata>;

export type MoveModificationsFn = (modifications: ModificationMoveInfos[]) => Promise<unknown>;

export type UpdateModificationApplicabilityByRootNetworkFn = (
    rootNetworkUuid: UUID,
    modificationUuid: UUID,
    applicable: boolean
) => Promise<unknown>;

export type UpdateModificationActivationFn = (modificationUuid: UUID, active: boolean) => Promise<unknown>;

export type UpdateModificationMetadataFn = (
    modificationUuid: UUID,
    metadata: ModificationMetadataUpdate
) => Promise<unknown>;

export type UnshareModificationFn = (modificationUuid: UUID) => Promise<unknown>;
