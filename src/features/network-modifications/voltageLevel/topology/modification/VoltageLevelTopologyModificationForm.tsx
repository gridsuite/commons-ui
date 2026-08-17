/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Box, Button, Grid, Stack, TextField } from '@mui/material';
import { PublishedWithChanges } from '@mui/icons-material';
import { CustomAGGrid, SeparatorCellRenderer, useCustomFormContext } from '../../../../../components';
import { HeaderWithTooltip } from './HeaderWithTooltip';
import { ConnectionCellRenderer } from './ConnectionCellRender';
import { filledTextField } from '../../../common';
import { CURRENT_CONNECTION_STATUS, PREV_CONNECTION_STATUS, SWITCH_ID, TOPOLOGY_MODIFICATION_TABLE } from './constants';
import { SwitchRowForm } from './voltageLevelTopologyModification.types';

interface VoltageLevelTopologyModificationFormProps {
    selectedId: string;
    mergedRowData: SwitchRowForm[];
    isUpdate: boolean;
}

export function VoltageLevelTopologyModificationForm({
    selectedId,
    mergedRowData,
    isUpdate,
}: Readonly<VoltageLevelTopologyModificationFormProps>) {
    const intl = useIntl();
    const { getValues, setValue, isNodeBuilt } = useCustomFormContext();

    const defaultColDef = useMemo(
        () => ({
            sortable: false,
            resizable: true,
            wrapHeaderText: true,
            editable: false,
            headerClass: 'centered-header',
            suppressMovable: true,
        }),
        []
    );

    const columnDefs = useMemo(
        () => [
            {
                field: SWITCH_ID,
                filter: true,
                flex: 2,
                cellRenderer: ({ data }: { data?: any }) => {
                    if (data.type === 'SEPARATOR') {
                        return SeparatorCellRenderer({
                            children: data.title,
                        });
                    } else {
                        return data[SWITCH_ID];
                    }
                },
                headerComponent: HeaderWithTooltip,
                headerComponentParams: {
                    displayName: intl.formatMessage({ id: 'switchId' }),
                    tooltipTitle: intl.formatMessage({
                        id: isNodeBuilt ? 'builtNodeTooltipVlTopoModif' : 'notBuiltNodeTooltipVlTopoModif',
                    }),
                    isNodeBuilt: isNodeBuilt,
                    disabledTooltip: !isUpdate && isNodeBuilt,
                },
            },
            {
                field: PREV_CONNECTION_STATUS,
                flex: 1,
                headerComponent: HeaderWithTooltip,
                cellRenderer: ({ data }: { data?: any }) => {
                    if (data.type === 'SEPARATOR') {
                        return null;
                    } else {
                        // PREV_CONNECTION_STATUS presents 'open'
                        return intl.formatMessage({
                            id: data[PREV_CONNECTION_STATUS] ? 'Open' : 'Closed',
                        });
                    }
                },
                headerComponentParams: {
                    displayName: intl.formatMessage({ id: 'previousStatus' }),
                    tooltipTitle: intl.formatMessage({
                        id: isNodeBuilt ? 'builtNodeTooltipVlTopoModif' : 'notBuiltNodeTooltipVlTopoModif',
                    }),
                    isNodeBuilt: isNodeBuilt,
                    disabledTooltip: !isUpdate && isNodeBuilt,
                },
            },
            {
                field: CURRENT_CONNECTION_STATUS,
                flex: 1,
                cellRenderer: ({ data }: { data?: any }) => {
                    if (data.type === 'SEPARATOR') {
                        return null;
                    }
                    const watchTable: SwitchRowForm[] = getValues(TOPOLOGY_MODIFICATION_TABLE);
                    const formIndex = watchTable.findIndex((item: SwitchRowForm) => item.switchId === data.switchId);
                    return ConnectionCellRenderer({
                        name: `${TOPOLOGY_MODIFICATION_TABLE}[${formIndex}].${CURRENT_CONNECTION_STATUS}`,
                    });
                },
                headerComponent: HeaderWithTooltip,
                headerComponentParams: {
                    displayName: intl.formatMessage({ id: 'currentStatus' }),
                    tooltipTitle: intl.formatMessage({
                        id: isNodeBuilt ? 'builtNodeTooltipVlTopoModif' : 'notBuiltNodeTooltipVlTopoModif',
                    }),
                    isNodeBuilt: isNodeBuilt,
                    disabledTooltip: true,
                },
                editable: false,
            },
        ],
        [isNodeBuilt, intl, isUpdate, getValues]
    );

    const copyPreviousToCurrentStatus = useCallback(() => {
        const formValues = getValues(TOPOLOGY_MODIFICATION_TABLE);
        formValues.forEach((row: SwitchRowForm, index: number) => {
            // if row.currentConnectionStatus is not null we want to keep the value
            if (row.type === 'SEPARATOR' || row.currentConnectionStatus !== null) {
                return;
            }
            // should revert because CURRENT_CONNECTION_STATUS presents 'close' while PREV_CONNECTION_STATUS presents 'open'
            const newValue = !row[PREV_CONNECTION_STATUS];
            setValue(
                `${TOPOLOGY_MODIFICATION_TABLE}[${index}].${CURRENT_CONNECTION_STATUS}`,
                newValue,
                {
                    shouldDirty: true,
                }
            );
        });
    }, [getValues, setValue]);

    return (
        <Stack sx={{ height: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={4}>
                    <TextField
                        fullWidth
                        label="ID"
                        value={selectedId}
                        size="small"
                        slotProps={{
                            input: { readOnly: true },
                        }}
                        disabled
                        {...filledTextField}
                    />
                </Grid>
                <Grid size={8} container justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={copyPreviousToCurrentStatus}
                        startIcon={
                            <PublishedWithChanges
                                style={{
                                    width: 24,
                                    height: 24,
                                }}
                            />
                        }
                    >
                        {intl.formatMessage({ id: 'copyPreviousTopologyStatus' })}
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ pt: 2, flex: 1, minHeight: 0 }}>
                <CustomAGGrid
                    rowData={mergedRowData}
                    defaultColDef={defaultColDef}
                    columnDefs={columnDefs}
                    suppressMovableColumns={true}
                    animateRows={false}
                    domLayout="normal"
                    headerHeight={48}
                />
            </Box>
        </Stack>
    );
}
