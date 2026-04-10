/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { CONTAINER_ID, CONTAINER_NAME } from '../../components/parameters/common/parameter-table';
import { EquipmentsContainer } from './types';

export function mapEquipmentsContainerToIds(containers: EquipmentsContainer[] | undefined): UUID[] {
    return (containers ? containers.map((c) => c.containerId) : []) as UUID[];
}

export function mapIdsToEquipmentsContainer(
    ids: UUID[] | undefined,
    elementNames: Map<UUID, string>
): EquipmentsContainer[] {
    return ids
        ? ids.map((id) => ({
              [CONTAINER_ID]: id,
              [CONTAINER_NAME]: elementNames.get(id) ?? null,
          }))
        : [];
}
