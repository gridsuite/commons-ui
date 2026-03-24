/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { networkTableStyles } from '../network-table-styles';

interface DragHandleCellProps {
    isRowDragDisabled: boolean;
}

export const DragHandleCell = ({
       isRowDragDisabled,
    }:Readonly<DragHandleCellProps>) => {
    return (
        isRowDragDisabled ? undefined:
        <Box sx={networkTableStyles.dragHandle}>
            <DragIndicatorIcon fontSize="small" sx={networkTableStyles.dragIndicatorIcon} />
        </Box>
    );
};
