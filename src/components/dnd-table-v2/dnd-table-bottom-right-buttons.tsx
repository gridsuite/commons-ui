/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, IconButton, Tooltip } from '@mui/material';
import {
    AddCircle as AddCircleIcon,
    ArrowDownward as ArrowDownwardIcon,
    ArrowUpward as ArrowUpwardIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { SELECTED } from './dnd-table.type';

export interface DndTableBottomRightButtonsProps {
    arrayFormName: string;
    handleAddButton: () => void;
    handleDeleteButton: () => void;
    handleMoveUpButton: () => void;
    handleMoveDownButton: () => void;
    disableAddingRows?: boolean;
    showMoveArrow?: boolean;
    disabled?: boolean;
}

export function DndTableBottomRightButtons({
    arrayFormName,
    handleAddButton,
    handleDeleteButton,
    handleMoveUpButton,
    handleMoveDownButton,
    disableAddingRows,
    showMoveArrow,
    disabled,
}: Readonly<DndTableBottomRightButtonsProps>) {
    const intl = useIntl();

    const currentRows: ({ selected: boolean } & Record<string, any>)[] = useWatch({
        name: arrayFormName,
    });

    const noRowsSelected = currentRows ? !currentRows.some((row) => row[SELECTED]) : true;
    const firstRowSelected = noRowsSelected ? undefined : currentRows[0]?.[SELECTED];
    const lastRowSelected = noRowsSelected ? undefined : currentRows[currentRows.length - 1]?.[SELECTED];

    return (
        <Grid container item xs spacing={1} sx={{ justifyContent: 'flex-end' }}>
            <Grid item>
                <Tooltip
                    title={intl.formatMessage({
                        id: 'DndAddRows',
                    })}
                    placement="top"
                >
                    <span>
                        <IconButton
                            color="primary"
                            onClick={() => handleAddButton()}
                            disabled={disabled || disableAddingRows}
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Grid>
            <Grid item>
                <Tooltip
                    title={intl.formatMessage({
                        id: 'DndDeleteRows',
                    })}
                    placement="top"
                >
                    <span>
                        <IconButton
                            color="primary"
                            onClick={() => handleDeleteButton()}
                            disabled={disabled || noRowsSelected}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Grid>
            {showMoveArrow && (
                <>
                    <Grid item>
                        <Tooltip
                            title={intl.formatMessage({
                                id: 'MoveUpRows',
                            })}
                            placement="top"
                        >
                            <span>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleMoveUpButton()}
                                    disabled={disabled || noRowsSelected || firstRowSelected}
                                >
                                    <ArrowUpwardIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={intl.formatMessage({
                                id: 'MoveDownRows',
                            })}
                            placement="top"
                        >
                            <span>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleMoveDownButton()}
                                    disabled={disabled || noRowsSelected || lastRowSelected}
                                >
                                    <ArrowDownwardIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                </>
            )}
        </Grid>
    );
}
