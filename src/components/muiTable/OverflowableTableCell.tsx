/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TableCell } from '@mui/material';
import { OverflowableText, OverflowableTextProps } from '../overflowableText';

export function OverflowableTableCell(overflowableTextProps: Readonly<OverflowableTextProps>) {
    return (
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            <OverflowableText sx={{ flex: '1 1 0', width: 0, display: 'block' }} {...overflowableTextProps} />
        </TableCell>
    );
}

export default OverflowableTableCell;
