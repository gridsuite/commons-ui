/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { IconButton, TableCell, TableRow, TableRowProps } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { CustomTooltip } from '../tooltip/CustomTooltip';

type DeletableTableRowProps = TableRowProps & {
    onClick: () => void;
    disabledDeletion?: boolean | null;
};

export function DeletableTableRow({
    onClick,
    disabledDeletion,
    children,
    ...otherProps
}: Readonly<DeletableTableRowProps>) {
    const intl = useIntl();
    const [isMouseHover, setIsMouseHover] = useState<boolean>(false);
    return (
        <TableRow
            {...otherProps}
            onMouseEnter={() => setIsMouseHover(true)}
            onMouseLeave={() => setIsMouseHover(false)}
        >
            {children}
            {!disabledDeletion && (
                <TableCell sx={{ width: '5rem', textAlign: 'center' }}>
                    {isMouseHover && (
                        <CustomTooltip
                            title={intl.formatMessage({
                                id: 'DeleteRows',
                            })}
                        >
                            <IconButton onClick={onClick}>
                                <DeleteIcon />
                            </IconButton>
                        </CustomTooltip>
                    )}
                </TableCell>
            )}
        </TableRow>
    );
}
