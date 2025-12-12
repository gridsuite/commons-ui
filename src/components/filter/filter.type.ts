/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { FieldConstants, GsLang } from '../../utils';
import { RuleGroupTypeExport } from './expert/expertFilter.type';
import { EXPERT_FILTER_QUERY } from './expert/expertFilterConstants';
import { FILTER_EQUIPMENTS_ATTRIBUTES } from './explicitNaming/ExplicitNamingFilterConstants';

/**
 * Represent an item/object in directories.
 */
export type ItemSelectionForCopy = {
    sourceItemUuid: UUID | null;
    typeItem: string | null;
    nameItem: string | null;
    descriptionItem: string | null;
    parentDirectoryUuid: UUID | null;
    specificTypeItem: string | null;
};

type EquipmentsFilter = {
    equipmentID: string;
    distributionKey?: number;
};

export interface FilterEditionProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: BroadcastChannel;
    itemSelectionForCopy: ItemSelectionForCopy;
    setItemSelectionForCopy: (selection: ItemSelectionForCopy) => void;
    getFilterById: (id: string) => Promise<{
        [FieldConstants.EQUIPMENT_TYPE]: string;
        [EXPERT_FILTER_QUERY]?: RuleGroupTypeExport;
        [FILTER_EQUIPMENTS_ATTRIBUTES]?: EquipmentsFilter[];
    }>;
    activeDirectory?: UUID;
    language?: GsLang;
    description?: string;
    isDeveloperMode: boolean;
}

export interface NewFilterType {
    id: string | null;
    type: string;
    equipmentType: string;
    rules?: RuleGroupTypeExport;
    filterEquipmentsAttributes?: EquipmentsFilter[];
}
