/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';

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
