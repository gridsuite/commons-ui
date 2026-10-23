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
    // Shown but inactive, e.g. for the content of a shared modification the user can't write into
    isLocked?: boolean;
}

export function DragHandleCell({ isRowDragDisabled, isLocked = false }: Readonly<DragHandleCellProps>) {
    return (
        <Box
            sx={mergeSx(
                networkModificationTableStyles.dragHandle,
                isLocked ? networkModificationTableStyles.disabledDragHandle : undefined
            )}
        >
            {!isRowDragDisabled && (
                <DragIndicator fontSize="small" sx={networkModificationTableStyles.dragIndicatorIcon} />
            )}
        </Box>
    );
}
