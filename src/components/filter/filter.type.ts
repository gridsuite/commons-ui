/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { EquipmentType, FieldConstants, GsLang } from '../../utils';
import { ItemSelectionForCopy } from '../../utils/types/types';
import { RuleGroupTypeExport } from './expert/expertFilter.type';
import { EXPERT_FILTER_QUERY } from './expert/expertFilterConstants';
import { FILTER_EQUIPMENTS_ATTRIBUTES } from './explicitNaming/ExplicitNamingFilterConstants';
import { FilterType } from './constants/FilterConstants';

export type EquipmentsFilter = {
    equipmentID: string;
    distributionKey?: number;
};

export interface IdentifiableAttributes {
    id: string;
    type: EquipmentType;
    distributionKey: number;
}

export interface FilterEquipments {
    filterId: UUID;
    identifiableAttributes: IdentifiableAttributes[];
    notFoundEquipments: string[];
}

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

export type NewFilterType = ExpertFilter | ExplicitNamingFilter;

type BaseFilter = {
    id?: string | null;
    name?: string;
    type: string;
    equipmentType: string; // TODO must be EquipmentType enum
};

export type ExpertFilter = BaseFilter & {
    type: typeof FilterType.EXPERT.id;
    rules: RuleGroupTypeExport;
    topologyKind?: string; // TODO must be TopologyKind enum
};

export type ExplicitNamingFilter = BaseFilter & {
    type: typeof FilterType.EXPLICIT_NAMING.id;
    filterEquipmentsAttributes?: EquipmentsFilter[];
};
