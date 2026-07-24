/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CellContext, HeaderContext } from '@tanstack/react-table';
import { Badge, Box, Tooltip } from '@mui/material';
import { RemoveRedEye as RemoveRedEyeIcon } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { DragHandleCell } from './drag-handle-cell';
import { NameCell } from './name-cell';
import { NetworkModificationEditorNameHeader } from './network-modification-node-editor-name-header';
import { SelectCell } from './select-cell';
import { SelectHeaderCell } from './select-header-cell';
import { DescriptionCell } from './description-cell';
import { SwitchCell } from './switch-cell';
import { RootNetworkChipCell } from './root-network-chip-cell';
import { createRootNetworkChipCellSx, networkModificationTableStyles } from '../network-modification-table-styles';
import { ComposedModificationMetadata } from '../../../utils';
import { isSharedModification } from '../utils';
import { ReferenceLinkCell } from './reference-link-cell';

/**
 * Cell/header renderers must keep a stable reference across renders to avoid
 * unmounting/remounting cells and resetting local states. The renderers below are
 * hoisted because they're reused by `createBaseColumns` and `createRootNetworksColumns`,
 * factories called inside a hook — defining them inline there would produce fresh references.
 *
 * Dynamic values are routed via react-table's `meta`: table-wide via `table.options.meta`,
 * per-column via `column.columnDef.meta`.
 */

type CCtx = CellContext<ComposedModificationMetadata, unknown>;
type HCtx = HeaderContext<ComposedModificationMetadata, unknown>;

export function DragHandleRenderer({ table }: CCtx) {
    return <DragHandleCell isRowDragDisabled={table.options.meta?.interaction.isRowDragDisabled ?? false} />;
}

export function SelectHeaderRenderer({ table }: HCtx) {
    return <SelectHeaderCell table={table} />;
}

export function SelectCellRenderer({ row, table }: CCtx) {
    return <SelectCell row={row} table={table} />;
}

export function NameHeaderRenderer({ table }: HCtx) {
    const { meta } = table.options;
    return (
        <NetworkModificationEditorNameHeader
            modificationCount={meta?.modifications.count ?? 0}
            isImpactedByNotification={meta?.status.isImpactedByNotification ?? (() => false)}
            notificationMessageId={meta?.status.notificationMessageId}
            isFetchingModifications={meta?.status.isFetchingModifications ?? false}
            pendingState={meta?.status.pendingState ?? false}
        />
    );
}

export function NameCellRenderer({ row, table, column }: CCtx) {
    return <NameCell row={row} table={table} onChange={column.columnDef.meta?.onChange} />;
}

export function DescriptionCellRenderer({ row, table }: CCtx) {
    const { meta } = table.options;
    return (
        <DescriptionCell
            data={row.original}
            studyUuid={meta?.context.studyUuid ?? null}
            currentNodeId={meta?.context.currentNodeId}
            isDisabled={meta?.status.isDisabled}
        />
    );
}

export function ReferenceCellRenderer({ row, table }: CCtx) {
    const { meta } = table.options;

    // A reference to a shared-modification row shows a "copy link" action
    if (isSharedModification(row.original)) {
        return <ReferenceLinkCell data={row.original} disabled={meta?.status.isDisabled} />;
    }
    return null;
}
export function SwitchCellRenderer({ row, table }: CCtx) {
    const { meta } = table.options;
    return (
        <SwitchCell
            data={row.original}
            studyUuid={meta?.context.studyUuid ?? null}
            currentNodeId={meta?.context.currentNodeId}
            isDisabled={meta?.status.isDisabled}
        />
    );
}

export function RootNetworkHeaderRenderer({ column, table }: HCtx) {
    const { meta } = table.options;
    // `column.id` is the rootNetworkUuid (set in createRootNetworksColumns).
    const isCurrentRootNetwork =
        !!meta?.context.currentRootNetworkUuid && column.id === meta.context.currentRootNetworkUuid;
    if (!isCurrentRootNetwork || (meta?.modifications.count ?? 0) < 1) {
        return null;
    }
    const currentRootNetworkTag = meta?.context.rootNetworks?.find(
        (r) => r.rootNetworkUuid === meta.context.currentRootNetworkUuid
    )?.tag;
    return (
        <Box sx={networkModificationTableStyles.rootNetworkHeader}>
            <Tooltip title={<FormattedMessage id="visualizedRootNetwork" values={{ tag: currentRootNetworkTag }} />}>
                <Badge overlap="circular" color="primary" variant="dot">
                    <RemoveRedEyeIcon />
                </Badge>
            </Tooltip>
        </Box>
    );
}

export function RootNetworkCellRenderer({ row, column, table }: CCtx) {
    const { meta } = table.options;
    // `column.id` is the rootNetworkUuid (set in createRootNetworksColumns).
    const rootNetwork = meta?.context.rootNetworks?.find((r) => r.rootNetworkUuid === column.id);
    if (!rootNetwork || !meta?.modifications.toExclude || !meta.modifications.setToExclude) {
        return null;
    }
    return (
        <Box sx={createRootNetworkChipCellSx(row.original.activated)}>
            <RootNetworkChipCell
                data={row.original}
                studyUuid={meta?.context.studyUuid ?? null}
                currentNodeId={meta?.context.currentNodeId}
                rootNetwork={rootNetwork}
                modificationsToExclude={meta.modifications.toExclude}
                setModificationsToExclude={meta.modifications.setToExclude}
                isDisabled={meta?.status.isDisabled}
            />
        </Box>
    );
}
