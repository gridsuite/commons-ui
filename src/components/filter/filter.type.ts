/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { ElementExistsType } from '../../utils';

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

export interface FilterProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: BroadcastChannel;
    itemSelectionForCopy: ItemSelectionForCopy;
    setItemSelectionForCopy: (selection: ItemSelectionForCopy) => void;
    getFilterById: (id: string) => Promise<{ [prop: string]: any }>;
    elementUuid: UUID;
    activeDirectory?: UUID;
    elementExists?: ElementExistsType;
    language?: string;
    description?: string;
}
