/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { ElementExistsType } from '../../utils';
import { RuleGroupTypeExport } from './expert/expertFilter.type';

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

export interface FilterEditionProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: BroadcastChannel;
    itemSelectionForCopy: ItemSelectionForCopy;
    setItemSelectionForCopy: (selection: ItemSelectionForCopy) => void;
    getFilterById: (id: string) => Promise<{ [prop: string]: any }>;
    activeDirectory?: UUID;
    elementExists?: ElementExistsType;
    language?: string;
    description?: string;
}

export interface NewFilterType {
    id: string | null;
    type: string;
    equipmentType: string;
    rules?: RuleGroupTypeExport;
    filterEquipmentsAttributes?: {
        equipmentID: string;
        distributionKey?: string;
    }[];
}
