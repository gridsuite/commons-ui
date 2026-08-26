/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PropsWithChildren, useState } from 'react';
import { useIntl } from 'react-intl';
import { Grid, IconButton } from '@mui/material';
import { Delete as DeleteIcon, RestoreFromTrash as RestoreFromTrashIcon } from '@mui/icons-material';
import { CustomTooltip } from '../../../ui/tooltip/CustomTooltip';

export interface DeletableRowProps extends PropsWithChildren {
    alignItems: string;
    onClick: () => void;
    deletionMark?: boolean | null;
    disabledDeletion?: boolean | null;
    dataTestId?: string;
}

export function DeletableRow({
    alignItems,
    onClick,
    deletionMark,
    disabledDeletion,
    dataTestId,
    children,
}: Readonly<DeletableRowProps>) {
    const intl = useIntl();
    const [isMouseHover, setIsMouseHover] = useState(false);

    return (
        <Grid
            container
            spacing={2}
            size={12}
            alignItems={alignItems}
            onMouseEnter={() => setIsMouseHover(true)}
            onMouseLeave={() => setIsMouseHover(false)}
            data-testid={dataTestId}
        >
            {children}
            <Grid size={1}>
                {isMouseHover && !disabledDeletion && (
                    <CustomTooltip
                        title={intl.formatMessage({
                            id: deletionMark ? 'button.restore' : 'DeleteRows',
                        })}
                    >
                        <IconButton onClick={onClick} data-testid="DeleteRowButton">
                            {deletionMark ? <RestoreFromTrashIcon /> : <DeleteIcon />}
                        </IconButton>
                    </CustomTooltip>
                )}
            </Grid>
        </Grid>
    );
}
