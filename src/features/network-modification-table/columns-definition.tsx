/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { ColumnDef, ColumnDefTemplate, HeaderContext } from '@tanstack/react-table';
import type { UUID } from 'node:crypto';
import { ComposedModificationMetadata } from '../../utils';
import { RootNetworkCellRenderer, RootNetworkHeaderRenderer } from './renderers/cell-renderers';
import { networkModificationTableStyles } from './network-modification-table-styles';

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
    SHARED: {
        id: 'shared',
        autoExtensible: false,
    },
};

export const AUTO_EXTENSIBLE_COLUMNS = Object.values(BASE_MODIFICATION_TABLE_COLUMNS)
    .filter((column) => column.autoExtensible)
    .map((column) => column.id);

const MIN_ROOT_NETWORK_COLUMN_SIZE = 56;

/**
 * One column per root network, to control the applicability of each modification on it. The column id is the root
 * network uuid, which the cells use to find the root network among those given to the table.
 * @param header by default, shows which root network is the visualized one
 */
export const createRootNetworksColumns = (
    rootNetworks: { rootNetworkUuid: UUID; tag?: string }[],
    header: ColumnDefTemplate<HeaderContext<ComposedModificationMetadata, unknown>> = RootNetworkHeaderRenderer
): ColumnDef<ComposedModificationMetadata>[] => {
    const tagMinSizes = rootNetworks.map((rootNetwork) => computeTagMinSize(rootNetwork.tag ?? ''));
    const sharedSize = Math.max(Math.min(...tagMinSizes), MIN_ROOT_NETWORK_COLUMN_SIZE);

    return rootNetworks.map((rootNetwork, index) => ({
        id: rootNetwork.rootNetworkUuid,
        header,
        cell: RootNetworkCellRenderer,
        size: sharedSize,
        minSize: tagMinSizes[index],
        meta: {
            cellStyle: networkModificationTableStyles.columnCell.rootNetworkChip,
        },
    }));
};
