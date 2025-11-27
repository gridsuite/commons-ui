/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Checkbox, TableCell } from '@mui/material';
import { OverflowableText, OverflowableTextProps } from '../overflowableText';

export interface OverflowableTableCellProps extends OverflowableTextProps {
    checked: boolean;
}

export function OverflowableTableCellWithCheckbox({
    checked,
    ...overflowableTextProps
}: Readonly<OverflowableTableCellProps>) {
    return (
        <TableCell padding="checkbox" sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Checkbox checked={checked} />
            <OverflowableText sx={{ flex: '1 1 0', width: 0, display: 'block' }} {...overflowableTextProps} />
        </TableCell>
    );
}

export default OverflowableTableCellWithCheckbox;
