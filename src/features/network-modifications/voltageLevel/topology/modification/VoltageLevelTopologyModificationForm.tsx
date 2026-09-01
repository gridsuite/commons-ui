/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { Box, Button, Grid, Stack, TextField } from '@mui/material';
import { PublishedWithChanges } from '@mui/icons-material';
import { ICellRendererParams } from 'ag-grid-community';
import { CustomAGGrid, SeparatorCellRenderer, useCustomFormContext } from '../../../../../components';
import { ConnectionCellRenderer } from './ConnectionCellRender';
import { filledTextField } from '../../../common';
import { CURRENT_CONNECTION_STATUS, PREV_CONNECTION_STATUS, SWITCH_ID, TOPOLOGY_MODIFICATION_TABLE } from './constants';
import {
    SwitchDto,
    SwitchRowForm,
    TopologyVoltageLevelModificationDto,
} from './voltageLevelTopologyModification.types';
import { FieldConstants } from '../../../../../utils';
import { HeaderWithTooltip } from '../../common';

interface VoltageLevelTopologyModificationFormProps {
    voltageLevelToModify: TopologyVoltageLevelModificationDto | null | undefined;
    switchesToModify?: SwitchDto[];
    isModification?: boolean;
    isPreviousStatusEnabled?: boolean;
}

const SEPARATOR_TYPE = 'SEPARATOR';
const SWITCH_TYPE = 'SWITCH';

function isSwitchModified(switchId: string, editData: TopologyVoltageLevelModificationDto | undefined | null): boolean {
    return editData?.equipmentAttributeModificationList?.some((mod) => mod.equipmentId === switchId) ?? false;
}

function addModifiedSeparator(result: SwitchRowForm[], intl: IntlShape, modifiedSwitches: SwitchRowForm[]) {
    result.push({
        type: SEPARATOR_TYPE,
        id: 'modified-separator',
        title: `${intl.formatMessage({ id: 'modifiedSwitchesSeparatorTitle' })} (${modifiedSwitches.length})`,
    });
}

function addUnmodifiedSeparator(result: SwitchRowForm[], intl: IntlShape, unmodifiedSwitches: SwitchRowForm[]) {
    result.push({
        type: SEPARATOR_TYPE,
        id: 'unmodified-separator',
        title: `${intl.formatMessage({ id: 'unModifiedSwitchesSeparatorTitle' })} (${unmodifiedSwitches.length})`,
    });
}

export function VoltageLevelTopologyModificationForm({
    voltageLevelToModify,
    switchesToModify = [],
    isModification = false,
    isPreviousStatusEnabled = false,
}: Readonly<VoltageLevelTopologyModificationFormProps>) {
    const intl = useIntl();
    const { setValue, getValues, isNodeBuilt } = useCustomFormContext();
    const equipmentId: string = useWatch({ name: FieldConstants.EQUIPMENT_ID });

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
                cellRenderer: ({ data }: ICellRendererParams<SwitchRowForm>) => {
                    if (!data) return null;
                    if (data.type === SEPARATOR_TYPE) {
                        return SeparatorCellRenderer({
                            value: data.title ?? '',
                        });
                    }
                    return data[SWITCH_ID];
                },
                headerComponent: HeaderWithTooltip,
                headerComponentParams: {
                    displayName: intl.formatMessage({ id: 'switchId' }),
                    tooltipTitle: intl.formatMessage({
                        id: isNodeBuilt ? 'builtNodeTooltipVlTopoModif' : 'notBuiltNodeTooltipVlTopoModif',
                    }),
                    isNodeBuilt,
                    disabledTooltip: !isPreviousStatusEnabled || (!isModification && isNodeBuilt),
                },
            },
            ...(isPreviousStatusEnabled
                ? [
                      {
                          field: PREV_CONNECTION_STATUS,
                          flex: 1,
                          headerComponent: HeaderWithTooltip,
                          cellRenderer: ({ data }: ICellRendererParams<SwitchRowForm>) => {
                              if (!data) return null;
                              if (data.type === SEPARATOR_TYPE) {
                                  return null;
                              }
                              // PREV_CONNECTION_STATUS presents 'open'
                              return intl.formatMessage({
                                  id: data[PREV_CONNECTION_STATUS] ? 'Open' : 'Closed',
                              });
                          },
                          headerComponentParams: {
                              displayName: intl.formatMessage({ id: 'previousStatus' }),
                              tooltipTitle: intl.formatMessage({
                                  id: isNodeBuilt ? 'builtNodeTooltipVlTopoModif' : 'notBuiltNodeTooltipVlTopoModif',
                              }),
                              isNodeBuilt,
                              disabledTooltip: !isModification && isNodeBuilt,
                          },
                      },
                  ]
                : []),
            {
                field: CURRENT_CONNECTION_STATUS,
                flex: 1,
                cellRenderer: ({ data }: ICellRendererParams<SwitchRowForm>) => {
                    if (!data) return null;
                    if (data.type === SEPARATOR_TYPE) {
                        return null;
                    }
                    const formValues: SwitchRowForm[] = getValues(TOPOLOGY_MODIFICATION_TABLE);
                    const formIndex = formValues.findIndex((item) => item.switchId === data.switchId);
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
                    isNodeBuilt,
                    disabledTooltip: true,
                },
                editable: false,
            },
        ],
        [isNodeBuilt, intl, isModification, isPreviousStatusEnabled, getValues]
    );

    const copyPreviousToCurrentStatus = useCallback(() => {
        const formValues: SwitchRowForm[] = getValues(TOPOLOGY_MODIFICATION_TABLE);
        formValues.forEach((row, index) => {
            // if row.currentConnectionStatus is not null we want to keep the value
            if (row.type === SEPARATOR_TYPE || row.currentConnectionStatus !== null) {
                return;
            }
            // should revert because CURRENT_CONNECTION_STATUS presents 'close' while PREV_CONNECTION_STATUS presents 'open'
            const newValue = !row[PREV_CONNECTION_STATUS];
            setValue(`${TOPOLOGY_MODIFICATION_TABLE}[${index}].${CURRENT_CONNECTION_STATUS}`, newValue, {
                shouldDirty: true,
            });
        });
    }, [getValues, setValue]);

    const mergedRowData: SwitchRowForm[] = useMemo(() => {
        const result: SwitchRowForm[] = [];
        const watchTable: SwitchRowForm[] = getValues(TOPOLOGY_MODIFICATION_TABLE);

        if (!watchTable?.length) {
            return result;
        }
        const sortedWatchTable = [...watchTable].sort((a, b) => (a.switchId ?? '').localeCompare(b.switchId ?? ''));
        const modifiedSwitches = sortedWatchTable.filter(
            (sw) => sw.switchId && isSwitchModified(sw.switchId, voltageLevelToModify)
        );
        if (modifiedSwitches.length > 0) {
            addModifiedSeparator(result, intl, modifiedSwitches);
            modifiedSwitches.forEach((sw) => {
                result.push({
                    ...sw,
                    type: SWITCH_TYPE,
                });
            });
        }
        const unmodifiedSwitches = sortedWatchTable.filter(
            (sw) =>
                sw.switchId &&
                !isSwitchModified(sw.switchId, voltageLevelToModify) &&
                switchesToModify.some((item) => item.id === sw.switchId)
        );
        if (unmodifiedSwitches.length > 0) {
            addUnmodifiedSeparator(result, intl, unmodifiedSwitches);
            unmodifiedSwitches.forEach((sw) => {
                result.push({
                    ...sw,
                    type: SWITCH_TYPE,
                });
            });
        }
        return result;
    }, [voltageLevelToModify, switchesToModify, intl, getValues]); // Recompute when voltageLevelToModify or switchesToModify changes

    return (
        <Stack sx={{ height: '100%', minHeight: 0 }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={4}>
                    <TextField
                        fullWidth
                        label="ID"
                        value={equipmentId ?? ''}
                        size="small"
                        slotProps={{
                            input: { readOnly: true },
                        }}
                        disabled
                        {...filledTextField}
                    />
                </Grid>
                <Grid size={8} container justifyContent="flex-end">
                    {isPreviousStatusEnabled && (
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
                    )}
                </Grid>
            </Grid>
            <Box sx={{ pt: 2, flex: 1, minHeight: 0 }}>
                <CustomAGGrid
                    rowData={mergedRowData}
                    defaultColDef={defaultColDef}
                    columnDefs={columnDefs}
                    suppressMovableColumns
                    animateRows={false}
                    domLayout="normal"
                    headerHeight={48}
                />
            </Box>
        </Stack>
    );
}
