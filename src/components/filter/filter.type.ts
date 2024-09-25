/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type SelectionForCopy = {
    sourceItemUuid: string | null;
    typeItem: string | null;
    nameItem: string | null;
    descriptionItem: string | null;
    parentDirectoryUuid: string | null;
    specificTypeItem: string | null;
};
