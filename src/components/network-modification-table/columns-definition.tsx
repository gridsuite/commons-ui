/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    NetworkModificationEditorNameHeaderProps,
} from './renderers';

const CHIP_PADDING_PX = 24;
const CHAR_WIDTH_PX = 8;
const COLUMN_PADDING_PX = 12;
const MIN_COLUMN_SIZE = 40;

export const computeTagMinSize = (tag: string): number => {
    const chipContentWidth = tag.length * CHAR_WIDTH_PX + CHIP_PADDING_PX;
    return Math.max(chipContentWidth + COLUMN_PADDING_PX, MIN_COLUMN_SIZE);
};

export const BASE_MODIFICATION_TABLE_COLUMNS = {
    DRAG_HANDLE: {
        id: 'dragHandle',
        autoExtensible: false,
    },
    SELECT: {
        id: 'select',
        autoExtensible: false,
    },
    NAME: {
        id: 'modificationName',
        autoExtensible: true,
    },
    DESCRIPTION: {
        id: 'modificationDescription',
        autoExtensible: false,
    },
    SWITCH: {
        id: 'switch',
        autoExtensible: false,
    },
};

export const AUTO_EXTENSIBLE_COLUMNS = Object.values(BASE_MODIFICATION_TABLE_COLUMNS)
    .filter((column) => column.autoExtensible)
    .map((column) => column.id);

export type NameHeaderProps = Omit<NetworkModificationEditorNameHeaderProps, 'modificationCount'>;
