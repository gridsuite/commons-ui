/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DragIndicator } from '@mui/icons-material';
import { Box } from '@mui/material';
import { networkModificationTableStyles } from '../network-modification-table-styles';
import { mergeSx } from '../../../utils';

interface DragHandleCellProps {
    isRowDragDisabled: boolean;
    isLocked?: boolean;
}

export function DragHandleCell({ isRowDragDisabled, isLocked = false }: Readonly<DragHandleCellProps>) {
    const isDragDisabled = isRowDragDisabled || isLocked;
    return (
        <Box
            sx={mergeSx(
                networkModificationTableStyles.dragHandle,
                isDragDisabled ? networkModificationTableStyles.disabledDragHandle : undefined
            )}
        >
            {!isDragDisabled && (
                <DragIndicator fontSize="small" sx={networkModificationTableStyles.dragIndicatorIcon} />
            )}
        </Box>
    );
}
