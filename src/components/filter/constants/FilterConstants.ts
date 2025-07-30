/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ItemSelectionForCopy } from '../filter.type';

export const DISTRIBUTION_KEY = 'distributionKey';

export const FilterType = {
    EXPERT: { id: 'EXPERT', label: 'filter.expert' },
    EXPLICIT_NAMING: { id: 'IDENTIFIER_LIST', label: 'filter.explicitNaming' },
};

export const NO_ITEM_SELECTION_FOR_COPY: ItemSelectionForCopy = {
    sourceItemUuid: null,
    nameItem: null,
    descriptionItem: null,
    parentDirectoryUuid: null,
    typeItem: null,
    specificTypeItem: null,
};
