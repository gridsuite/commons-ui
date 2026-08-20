/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { FormattedMessage, useIntl } from 'react-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import { useCallback, useMemo, useState } from 'react';
import { Box, Button, Grid, Stack, TextField } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { ICellRendererParams } from 'ag-grid-community';
import {
    AutocompleteInput,
    CustomAGGrid,
    CustomTooltip,
    GridItem,
    SeparatorCellRenderer,
    TextInput,
} from '../../../../components';
import { filledTextField, PositionDiagramPaneType } from '../../common';
import { FeederBayDirectionCellRenderer, FeederBayPositionCellRenderer } from './feederBay';
import { FieldConstants } from '../../../../utils';
import { FeederBays, FeederBaysFormInfos } from './moveVoltageLevelFeederBays.type';
import { HeaderWithTooltip } from '../common';

const defaultColDef = {
    sortable: false,
    resizable: true,
    editable: false,
    headerClass: 'centered-header',
    suppressMovable: true,
};

export interface MoveVoltageLevelFeederBaysFormProps {
    selectedId: string;
    feederBaysPreviousValues: FeederBays;
    isNodeBuilt?: boolean;
    isUpdate: boolean;
    isReady?: boolean;
    PositionDiagramPane?: PositionDiagramPaneType;
}

export function MoveVoltageLevelFeederBaysForm({
    isNodeBuilt,
    isUpdate,
    feederBaysPreviousValues,
    PositionDiagramPane,
    isReady = true,
}: Readonly<MoveVoltageLevelFeederBaysFormProps>) {
    const intl = useIntl();
    const { getValues } = useFormContext();
    const [isDiagramPaneOpen, setIsDiagramPaneOpen] = useState(false);
    const shouldDisableTooltip = useMemo(() => !isUpdate && isNodeBuilt, [isUpdate, isNodeBuilt]);
    const selectedId = useWatch({ name: FieldConstants.EQUIPMENT_ID });

    // build group
    const groupedRowData = useMemo(() => {
        if (!isReady || !selectedId) {
            return undefined;
        }

        const feederBaysFormInfosRows = getValues(
            FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE
        ) as FeederBaysFormInfos[];
        if (!Array.isArray(feederBaysFormInfosRows)) {
            return undefined;
        }
        // grouping by isRemove
        const groups: Record<string, FeederBaysFormInfos[]> = {};

        feederBaysFormInfosRows.forEach((row) => {
            const key = row[FieldConstants.IS_REMOVED] ? 'REMOVED' : 'ACTIVE';
            (groups[key] ??= []).push(row);
        });

        return Object.entries(groups).flatMap(([key, rows]) =>
            // do not show the ACTIVE group's header
            key === 'ACTIVE' ? [...rows] : [{ isGroup: true, key }, ...rows]
        );
    }, [isReady, getValues, selectedId]);

    const getGroupLabel = useCallback(
        (group: { key: string }) => {
            return group.key === 'REMOVED' ? intl.formatMessage({ id: 'MissingConnectionsInVoltageLevel' }) : undefined;
        },
        [intl]
    );

    const renderGroupCell = useCallback(
        ({ data }: ICellRendererParams) => {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        paddingLeft: 2,
                    }}
                >
                    <SeparatorCellRenderer value={getGroupLabel(data) ?? ''} sx={{ textAlign: 'center' }} />
                </Box>
            );
        },
        [getGroupLabel]
    );

    const voltageLevelIdField = useMemo(
        () => (
            <TextField
                fullWidth
                label="ID"
                value={selectedId ?? ''}
                size="small"
                slotProps={{
                    input: { readOnly: true },
                }}
                disabled
                {...filledTextField}
            />
        ),
        [selectedId]
    );

    const commonHeaderParams = useMemo(
        () => ({
            tooltipTitle: intl.formatMessage({
                id: isNodeBuilt ? 'builtNodeTooltipVlTopoModif' : 'notBuiltNodeTooltipVlTopoModif',
            }),
            isNodeBuilt,
            disabledTooltip: shouldDisableTooltip,
        }),
        [intl, isNodeBuilt, shouldDisableTooltip]
    );

    const renderEquipmentIdCell = useCallback(
        ({ data }: ICellRendererParams) => {
            const watchTable: FeederBaysFormInfos[] = getValues(FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE);
            const formIndex = watchTable?.findIndex((item) => item.rowId === data.rowId) ?? -1;

            return (
                <TextInput
                    name={`${FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE}[${formIndex}].${FieldConstants.EQUIPMENT_ID}`}
                    formProps={{
                        disabled: data.isRemoved,
                        size: 'small',
                        variant: 'outlined',
                        sx: {
                            paddingTop: '1rem',
                            '& input': {
                                textAlign: 'center',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'unset', // Remove the border
                            },
                        },
                    }}
                />
            );
        },
        [getValues]
    );

    const renderConnectionNameCell = useCallback(
        ({ data }: ICellRendererParams) => {
            const watchTable: FeederBaysFormInfos[] = getValues(FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE);
            const formIndex = watchTable?.findIndex((item) => item.rowId === data.rowId) ?? -1;
            const previousValue =
                feederBaysPreviousValues?.find((item) => item.rowId === data.rowId)?.connectablePositionInfos
                    .connectionName ?? '';
            return (
                <TextInput
                    name={`${FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE}[${formIndex}].${FieldConstants.CONNECTION_NAME}`}
                    formProps={{
                        disabled: data.isRemoved,
                        size: 'small',
                        variant: 'outlined',
                        sx: {
                            paddingTop: '1rem',
                            '& input': {
                                textAlign: 'center',
                            },
                        },
                    }}
                    previousValue={previousValue}
                />
            );
        },
        [feederBaysPreviousValues, getValues]
    );

    const renderBusbarSectionCell = useCallback(
        ({ data }: ICellRendererParams) => {
            const watchTable: FeederBaysFormInfos[] = getValues(FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE);
            const formIndex = watchTable?.findIndex((item) => item.rowId === data.rowId) ?? -1;
            const busBarSectionIds = getValues(
                `${FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE}[${formIndex}].${FieldConstants.BUSBAR_SECTION_IDS}`
            );
            const previousValue =
                feederBaysPreviousValues?.find((item) => item.rowId === data.rowId)?.busbarSectionId ?? undefined;
            return (
                <AutocompleteInput
                    name={`${FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE}[${formIndex}].${FieldConstants.BUSBAR_SECTION_ID}`}
                    forcePopupIcon={busBarSectionIds?.length > 0}
                    options={busBarSectionIds}
                    size="small"
                    sx={{ padding: '1rem' }}
                    disabled={data.isRemoved}
                    disableClearable
                    previousValue={previousValue}
                />
            );
        },
        [feederBaysPreviousValues, getValues]
    );

    const renderConnectionDirectionCell = useCallback(
        ({ data }: ICellRendererParams) => {
            const watchTable: FeederBaysFormInfos[] = getValues(FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE);
            const formIndex = watchTable?.findIndex((item) => item.rowId === data.rowId) ?? -1;
            return FeederBayDirectionCellRenderer({
                name: `${FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE}[${formIndex}].${FieldConstants.CONNECTION_DIRECTION}`,
                disabled: data.isRemoved,
            });
        },
        [getValues]
    );

    const renderConnectionPositionCell = useCallback(
        ({ data }: ICellRendererParams) => {
            const watchTable: FeederBaysFormInfos[] = getValues(FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE);
            const formIndex = watchTable?.findIndex((item) => item.rowId === data.rowId) ?? -1;
            return (
                <FeederBayPositionCellRenderer
                    key={data.rowId}
                    name={`${FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE}[${formIndex}].${FieldConstants.CONNECTION_POSITION}`}
                    disabled={data.isRemoved}
                />
            );
        },
        [getValues]
    );

    const columnDefs = useMemo(
        () => [
            {
                field: FieldConstants.EQUIPMENT_ID,
                filter: true,
                flex: 2,
                cellRenderer: renderEquipmentIdCell,
                headerComponent: HeaderWithTooltip,
                headerComponentParams: {
                    displayName: intl.formatMessage({ id: 'equipmentID' }),
                    ...commonHeaderParams,
                },
            },
            {
                field: FieldConstants.CONNECTION_NAME,
                filter: true,
                flex: 2,
                cellRenderer: renderConnectionNameCell,
                headerComponent: HeaderWithTooltip,
                headerComponentParams: {
                    displayName: intl.formatMessage({ id: 'Feeders' }),
                    ...commonHeaderParams,
                },
            },
            {
                field: FieldConstants.BUSBAR_SECTION_ID,
                filter: true,
                flex: 2,
                cellRenderer: renderBusbarSectionCell,
                headerComponent: HeaderWithTooltip,
                headerComponentParams: {
                    displayName: intl.formatMessage({ id: 'BusBarBus' }),
                    ...commonHeaderParams,
                },
            },
            {
                field: FieldConstants.CONNECTION_DIRECTION,
                filter: true,
                flex: 2,
                cellRenderer: renderConnectionDirectionCell,
                headerComponent: HeaderWithTooltip,
                headerComponentParams: {
                    displayName: intl.formatMessage({ id: 'connectionDirection' }),
                    ...commonHeaderParams,
                },
            },
            {
                field: FieldConstants.CONNECTION_POSITION,
                filter: true,
                flex: 2,
                cellRenderer: renderConnectionPositionCell,
                headerComponent: HeaderWithTooltip,
                headerComponentParams: {
                    displayName: intl.formatMessage({ id: FieldConstants.CONNECTION_POSITION }),
                    ...commonHeaderParams,
                },
            },
        ],
        [
            renderEquipmentIdCell,
            intl,
            renderConnectionNameCell,
            commonHeaderParams,
            renderBusbarSectionCell,
            renderConnectionDirectionCell,
            renderConnectionPositionCell,
        ]
    );

    const diagramToolTip =
        isNodeBuilt && PositionDiagramPane ? (
            <CustomTooltip sx={{ paddingLeft: 1 }} title={intl.formatMessage({ id: 'builtNodeTooltipForDiagram' })}>
                <InfoOutlined color="info" fontSize="medium" />
            </CustomTooltip>
        ) : null;

    return (
        <Stack sx={{ height: '100%', width: 'auto' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={4}>{voltageLevelIdField}</Grid>

                {isNodeBuilt && PositionDiagramPane && (
                    <GridItem size={3}>
                        <Button onClick={() => setIsDiagramPaneOpen(true)} variant="outlined">
                            <FormattedMessage id="CreateCouplingDeviceDiagramButton" />
                        </Button>
                        {diagramToolTip}
                    </GridItem>
                )}
            </Grid>
            <Grid paddingTop={2}>
                <FormattedMessage id="moveFeederBaysSections" />
            </Grid>
            <Box sx={{ pt: 1, flex: 1, minHeight: 0 }}>
                <CustomAGGrid
                    rowData={groupedRowData}
                    defaultColDef={defaultColDef}
                    columnDefs={columnDefs}
                    suppressMovableColumns
                    suppressCellFocus
                    animateRows={false}
                    domLayout="normal"
                    headerHeight={48}
                    rowHeight={85}
                    rowStyle={{ border: 'none' }}
                    suppressRowHoverHighlight
                    // group config
                    getRowHeight={(rowParam) => {
                        return rowParam.node.data?.isGroup ? 48 : undefined;
                    }}
                    isFullWidthRow={(rowParam) => {
                        return rowParam.rowNode.data?.isGroup;
                    }}
                    fullWidthCellRenderer={renderGroupCell}
                />
            </Box>
            {PositionDiagramPane && (
                <Box>
                    <PositionDiagramPane
                        open={isDiagramPaneOpen}
                        onClose={() => setIsDiagramPaneOpen(false)}
                        voltageLevelId={selectedId}
                    />
                </Box>
            )}
        </Stack>
    );
}
