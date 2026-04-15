/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, IconButton, Tooltip } from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

interface GridButtonsProps {
    onAddButton: () => void;
    onDeleteButton: () => void;
    disabledAdd?: boolean;
    disabledDelete?: boolean;
}

export function GridButtons({ onAddButton, onDeleteButton, disabledAdd, disabledDelete }: Readonly<GridButtonsProps>) {
    const intl = useIntl();

    const handleAddButton = useCallback(() => {
        onAddButton();
    }, [onAddButton]);
    const handleDeleteButton = useCallback(() => {
        onDeleteButton();
    }, [onDeleteButton]);

    return (
        <Grid container item xs spacing={1} sx={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Grid item>
                <Tooltip
                    title={intl.formatMessage({
                        id: 'AddRows',
                    })}
                    placement="top"
                >
                    <span>
                        <IconButton color="primary" onClick={() => handleAddButton()} disabled={disabledAdd}>
                            <AddCircle />
                        </IconButton>
                    </span>
                </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip
                    title={intl.formatMessage({
                        id: 'DeleteRows',
                    })}
                    placement="top"
                >
                    <span>
                        <IconButton color="primary" onClick={() => handleDeleteButton()} disabled={disabledDelete}>
                            <Delete />
                        </IconButton>
                    </span>
                </Tooltip>
            </Grid>
        </Grid>
    );
}
