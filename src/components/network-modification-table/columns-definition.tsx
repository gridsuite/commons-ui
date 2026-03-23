/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { SetStateAction } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
    NetworkModificationEditorNameHeader,
    NetworkModificationEditorNameHeaderProps,
} from './renderers/network-modification-node-editor-name-header';
import NameCell from './renderers/name-cell';
import { styles } from './styles';
import { NetworkModificationMetadata } from '../../hooks';

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

// TODO : ceci devrait probablement être à la fois dans gridexplore et gridstudy avec uniquement les constantses en commun
// à séparer à la fin
export const createBaseColumns = (
    isRowDragDisabled: boolean,
    modificationsCount: number,
    nameHeaderProps: NameHeaderProps,
    setModifications: React.Dispatch<SetStateAction<NetworkModificationMetadata[]>>
): ColumnDef<NetworkModificationMetadata>[] => [
    {
        id: BASE_MODIFICATION_TABLE_COLUMNS.NAME.id,
        header: () => (
            <NetworkModificationEditorNameHeader modificationCount={modificationsCount} {...nameHeaderProps} />
        ),
        cell: ({ row }) => <NameCell row={row} />,
        meta: {
            cellStyle: styles.columnCell.modificationName,
        },
        minSize: 160,
    },
];
