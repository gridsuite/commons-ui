/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { Box, Button, Grid, Stack, TextField } from '@mui/material';
import { PublishedWithChanges } from '@mui/icons-material';
import { CustomAGGrid, SeparatorCellRenderer, useCustomFormContext } from '../../../../../components';
import { HeaderWithTooltip } from './HeaderWithTooltip';
import { ConnectionCellRenderer } from './ConnectionCellRender';
import { filledTextField } from '../../../common';
import { CURRENT_CONNECTION_STATUS, PREV_CONNECTION_STATUS, SWITCH_ID, TOPOLOGY_MODIFICATION_TABLE } from './constants';
import {
    SwitchDto,
    SwitchRowForm,
    TopologyVoltageLevelModificationDto,
} from './voltageLevelTopologyModification.types';
import { FieldConstants } from '../../../../../utils';

interface VoltageLevelTopologyModificationFormProps {
    voltageLevelToModify: TopologyVoltageLevelModificationDto | null | undefined;
    switchesToModify: SwitchDto[];
    isModification?: boolean;
}

export function VoltageLevelTopologyModificationForm({
    voltageLevelToModify,
    switchesToModify,
    isModification = false,
}: Readonly<VoltageLevelTopologyModificationFormProps>) {
    const intl = useIntl();
    const { setValue, isNodeBuilt } = useCustomFormContext();
    const equipmentId: string = useWatch({ name: FieldConstants.EQUIPMENT_ID }); //todo maybe simplifier et utiliser cette valeur
    const switchRowForms: SwitchRowForm[] = useWatch({ name: TOPOLOGY_MODIFICATION_TABLE });

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
                    disabledTooltip: !isModification && isNodeBuilt,
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
                    disabledTooltip: !isModification && isNodeBuilt,
                },
            },
            {
                field: CURRENT_CONNECTION_STATUS,
                flex: 1,
                cellRenderer: ({ data }: { data?: any }) => {
                    if (data.type === 'SEPARATOR') {
                        return null;
                    }
                    const watchTable = switchRowForms;
                    const formIndex = watchTable.findIndex((item) => item.switchId === data.switchId);
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
        [isNodeBuilt, intl, isModification, switchRowForms]
    );

    const copyPreviousToCurrentStatus = useCallback(() => {
        const formValues = switchRowForms; //todo renamee
        formValues.forEach((row, index) => {
            // if row.currentConnectionStatus is not null we want to keep the value
            if (row.type === 'SEPARATOR' || row.currentConnectionStatus !== null) {
                return;
            }
            // should revert because CURRENT_CONNECTION_STATUS presents 'close' while PREV_CONNECTION_STATUS presents 'open'
            const newValue = !row[PREV_CONNECTION_STATUS];
            setValue(`${TOPOLOGY_MODIFICATION_TABLE}[${index}].${CURRENT_CONNECTION_STATUS}`, newValue, {
                shouldDirty: true,
            });
        });
    }, [setValue, switchRowForms]);

    const isSwitchModified = useCallback(
        (switchId: string): boolean => {
            return (
                voltageLevelToModify?.equipmentAttributeModificationList?.some((mod) => mod.equipmentId === switchId) ??
                false
            );
        },
        [voltageLevelToModify]
    );
    const mergedRowData = useMemo(() => {
        const SEPARATOR_TYPE = 'SEPARATOR';
        const SWITCH_TYPE = 'SWITCH';
        const result = [];
        const watchTable = switchRowForms;
        if (watchTable?.length > 0) {
            const sortedWatchTable = [...watchTable].sort((a, b) => (a.switchId ?? '').localeCompare(b.switchId ?? ''));

            const modifiedSwitches = sortedWatchTable
                .filter((sw) => sw.switchId && isSwitchModified(sw.switchId))
                .sort((a, b) => a.switchId!.localeCompare(b.switchId!));

            const unmodifiedSwitches = sortedWatchTable
                .filter((sw) => sw.switchId && !isSwitchModified(sw.switchId))
                .sort((a, b) => a.switchId!.localeCompare(b.switchId!));

            if (modifiedSwitches.length > 0) {
                result.push({
                    type: SEPARATOR_TYPE,
                    id: 'modified-separator',
                    title:
                        intl.formatMessage({ id: 'modifiedSwitchesSeparatorTitle' }) + ` (${modifiedSwitches.length})`,
                    count: modifiedSwitches.length,
                    [SWITCH_ID]: '',
                    [PREV_CONNECTION_STATUS]: null,
                    [CURRENT_CONNECTION_STATUS]: null,
                });

                modifiedSwitches.forEach((sw) => {
                    const matchingSwitchInfos = switchesToModify?.find((attr) => attr.id === sw.switchId);
                    const matchingAttributeEditData = voltageLevelToModify?.equipmentAttributeModificationList?.find(
                        (attr) => attr.equipmentId === sw.switchId
                    );

                    const open = isNodeBuilt
                        ? matchingSwitchInfos?.open
                        : (matchingAttributeEditData?.equipmentAttributeValue ?? matchingSwitchInfos?.open);

                    // Note that 'open' should be inverted when initializing CURRENT_CONNECTION_STATUS which presents 'close'
                    result.push({
                        ...sw,
                        type: SWITCH_TYPE,
                        isModified: false,
                        [CURRENT_CONNECTION_STATUS]: !open,
                    });
                    const formValues = switchRowForms; //todo rename
                    const index = formValues?.findIndex((item) => item.switchId === sw.switchId);
                    if (index !== -1) {
                        setValue(`${TOPOLOGY_MODIFICATION_TABLE}.${index}.${CURRENT_CONNECTION_STATUS}`, !open);
                    }
                });

                if (unmodifiedSwitches.length > 0) {
                    result.push({
                        type: SEPARATOR_TYPE,
                        id: 'unmodified-separator',
                        title:
                            intl.formatMessage({ id: 'unModifiedSwitchesSeparatorTitle' }) +
                            ` (${unmodifiedSwitches.length})`,
                        count: unmodifiedSwitches.length,
                        [SWITCH_ID]: '',
                        [PREV_CONNECTION_STATUS]: null,
                        [CURRENT_CONNECTION_STATUS]: null,
                    });

                    unmodifiedSwitches.forEach((sw) => {
                        result.push({
                            ...sw,
                            type: SWITCH_TYPE,
                            isModified: false,
                        });
                    });
                }
            } else {
                unmodifiedSwitches.forEach((sw) => {
                    result.push({
                        ...sw,
                        type: SWITCH_TYPE,
                        isModified: false,
                    });
                });
            }
            return result;
        }
        return [];
    }, [
        isSwitchModified,
        intl,
        switchesToModify,
        isNodeBuilt,
        setValue,
        equipmentId,
        switchRowForms,
    ]);
    return (
        <Stack sx={{ height: '100%', minHeight: 0 }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={4}>
                    <TextField
                        fullWidth
                        label="ID"
                        value={equipmentId}
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
                    onGridReady={(params) => params.api.sizeColumnsToFit()}
                    onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
                />
            </Box>
        </Stack>
    );
}
