/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExploreOffOutlinedIcon from '@mui/icons-material/ExploreOffOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import { Grid, GridDirection, IconButton, Tooltip } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import { getConnectivityBusBarSectionData, getConnectivityVoltageLevelData } from './connectivityForm.utils';
import { ConnectablePositionFormInfos } from './connectivity.type';
import {
    areIdsEqual,
    CONNECTION_DIRECTIONS,
    FieldConstants,
    getConnectionDirectionLabel,
    getObjectId,
    Identifiable,
    Option,
} from '../../../../utils';
import {
    AutocompleteInput,
    IntegerInput,
    SelectInput,
    SwitchInput,
    TextInput,
    useCustomFormContext,
} from '../../../inputs';
import { CheckboxNullableInput } from '../../../inputs/reactHookForm/CheckboxNullableInput';
import { PositionDiagramPaneType } from '../../load/common/load.types';
import { fetchBusesOrBusbarSectionsForVoltageLevel } from '../../../../services';

/**
 * Hook to handle a 'connectivity value' (voltage level, bus or bus bar section)
 * @param id optional id that has to be defined if the component is used more than once in a form
 * @param voltageLevelSelectLabel label to display for the voltage level auto complete component
 * @param direction direction of placement. Either 'row' or 'column', 'row' by default.
 * @param withDirectionsInfos
 * @param withPosition
 * @param voltageLevelOptions list of network voltage levels
 * @param newBusOrBusbarSectionOptions list of bus or bus bar sections for the newly created voltage level
 * @param studyUuid the study we are currently working on
 * @param nodeUuid the currently selected tree node
 * @param rootNetworkUuid The root network uuid we are currently working on
 * @param onVoltageLevelChangeCallback callback to be called when the voltage level changes
 * @param isEquipmentModification connectivity form is used in a modification form or not
 * @param previousValues previous values of connectivity form's fields
 * @param PositionDiagramPane a component type to display current taken positions in the voltage level
 * @returns JSX.Element
 */

interface ConnectivityFormProps {
    id?: string;
    voltageLevelSelectLabel?: string;
    direction?: GridDirection;
    withDirectionsInfos?: boolean;
    withPosition: boolean;
    voltageLevelOptions?: Identifiable[];
    newBusOrBusbarSectionOptions?: Option[];
    studyUuid: UUID;
    nodeUuid: UUID;
    rootNetworkUuid: UUID;
    onVoltageLevelChangeCallback?: () => void;
    isEquipmentModification?: boolean;
    previousValues?: {
        connectablePosition?: ConnectablePositionFormInfos;
        voltageLevelId?: string;
        busOrBusbarSectionId?: string;
        terminalConnected?: boolean | null;
    };
    PositionDiagramPane?: PositionDiagramPaneType;
}

export function ConnectivityForm({
    id = FieldConstants.CONNECTIVITY,
    voltageLevelSelectLabel = 'FieldConstants.VOLTAGE_LEVEL',
    direction = 'row',
    withDirectionsInfos = true,
    withPosition = false,
    voltageLevelOptions = [],
    newBusOrBusbarSectionOptions = [],
    studyUuid,
    nodeUuid,
    rootNetworkUuid,
    onVoltageLevelChangeCallback = undefined,
    isEquipmentModification = false,
    previousValues,
    PositionDiagramPane,
}: Readonly<ConnectivityFormProps>) {
    const [busOrBusbarSectionOptions, setBusOrBusbarSectionOptions] = useState<Option[]>([]);

    const [isDiagramPaneOpen, setIsDiagramPaneOpen] = useState(false);

    const lastFetchedBusesVlIds = useRef<string | null>(null);
    const intl = useIntl();

    const { getValues, isNodeBuilt, setValue } = useCustomFormContext();

    const watchVoltageLevelId = useWatch({
        name: `${id}.${FieldConstants.VOLTAGE_LEVEL}.${FieldConstants.ID}`,
    });

    const vlOptions = useMemo(
        () =>
            voltageLevelOptions.map((item) => ({
                id: item.id,
                label: item.name ?? '',
            })),
        [voltageLevelOptions]
    );

    useEffect(() => {
        if (watchVoltageLevelId) {
            const existingVoltageLevelOption = voltageLevelOptions.find((option) => option.id === watchVoltageLevelId);
            if (existingVoltageLevelOption) {
                fetchBusesOrBusbarSectionsForVoltageLevel(
                    studyUuid,
                    nodeUuid,
                    rootNetworkUuid,
                    watchVoltageLevelId
                ).then((busesOrbusbarSections) => {
                    lastFetchedBusesVlIds.current = watchVoltageLevelId;
                    setBusOrBusbarSectionOptions(
                        busesOrbusbarSections?.map((busesOrbusbarSection) => ({
                            id: busesOrbusbarSection.id,
                            label: busesOrbusbarSection?.name ?? '',
                        })) || []
                    );
                });
            }
            if (watchVoltageLevelId !== lastFetchedBusesVlIds.current) {
                setBusOrBusbarSectionOptions([]);
            }
        } else {
            setBusOrBusbarSectionOptions([]);
        }
    }, [watchVoltageLevelId, studyUuid, nodeUuid, rootNetworkUuid, voltageLevelOptions, id]);

    useEffect(() => {
        if (newBusOrBusbarSectionOptions?.length > 0) {
            setBusOrBusbarSectionOptions(newBusOrBusbarSectionOptions);
        }
    }, [newBusOrBusbarSectionOptions]);

    const handleChangeVoltageLevel = useCallback(() => {
        onVoltageLevelChangeCallback?.();
        setValue(`${id}.${FieldConstants.BUS_OR_BUSBAR_SECTION}`, null);
    }, [id, onVoltageLevelChangeCallback, setValue]);

    useEffect(() => {
        const currentBusOrBusbarSection = getValues(`${id}.${FieldConstants.BUS_OR_BUSBAR_SECTION}`);
        if (busOrBusbarSectionOptions?.length > 0 && currentBusOrBusbarSection?.id !== null) {
            setValue(`${id}.${FieldConstants.BUS_OR_BUSBAR_SECTION}`, currentBusOrBusbarSection);
        }
    }, [busOrBusbarSectionOptions, setValue, id, getValues]);

    const newVoltageLevelField = (
        <AutocompleteInput
            isOptionEqualToValue={areIdsEqual}
            outputTransform={(value) => {
                if (typeof value === 'string') {
                    const data = getConnectivityVoltageLevelData({ voltageLevelId: value });
                    return { id: data?.id ?? '', label: '' };
                }
                return value;
            }}
            previousValue={isEquipmentModification ? previousValues?.voltageLevelId : undefined}
            onChangeCallback={handleChangeVoltageLevel}
            allowNewValue
            forcePopupIcon
            selectOnFocus
            name={`${id}.${FieldConstants.VOLTAGE_LEVEL}`}
            label={voltageLevelSelectLabel}
            options={vlOptions}
            getOptionLabel={getObjectId}
            size="small"
        />
    );

    const previousConnectedField = useMemo(() => {
        if (!isEquipmentModification) {
            return null;
        }
        return previousValues?.terminalConnected
            ? intl.formatMessage({ id: 'connected' })
            : intl.formatMessage({ id: 'disconnected' });
    }, [intl, previousValues, isEquipmentModification]);

    const getTooltipMessageId = useMemo(() => {
        if (!isNodeBuilt) {
            return 'NodeNotBuildPositionMessage';
        }
        if (watchVoltageLevelId) {
            return 'DisplayTakenPositions';
        }
        return 'NoVoltageLevelPositionMessage';
    }, [isNodeBuilt, watchVoltageLevelId]);

    const connectedField = isEquipmentModification ? (
        <CheckboxNullableInput
            name={`${id}.${FieldConstants.CONNECTED}`}
            label="connected"
            previousValue={previousConnectedField ?? undefined}
        />
    ) : (
        <SwitchInput name={`${id}.${FieldConstants.CONNECTED}`} label="connected" />
    );

    const newBusOrBusbarSectionField = (
        <AutocompleteInput
            allowNewValue
            forcePopupIcon
            // hack to work with freesolo autocomplete
            // setting null programatically when freesolo is enable wont empty the field
            name={`${id}.${FieldConstants.BUS_OR_BUSBAR_SECTION}`}
            label="BusBarBus"
            options={busOrBusbarSectionOptions}
            previousValue={isEquipmentModification ? previousValues?.busOrBusbarSectionId : undefined}
            getOptionLabel={getObjectId}
            isOptionEqualToValue={areIdsEqual}
            inputTransform={(value) => value ?? ''}
            outputTransform={(value) => {
                if (typeof value === 'string') {
                    const data = getConnectivityBusBarSectionData({ busbarSectionId: value });
                    return { id: data?.id ?? '', label: '' };
                }
                return value;
            }}
            size="small"
        />
    );

    const newConnectionNameField = (
        <TextInput
            name={`${id}.${FieldConstants.CONNECTION_NAME}`}
            label="ConnectionName"
            previousValue={
                isEquipmentModification ? (previousValues?.connectablePosition?.connectionName ?? undefined) : undefined
            }
        />
    );

    const previousConnectionDirectionLabel = isEquipmentModification
        ? (getConnectionDirectionLabel(previousValues?.connectablePosition?.connectionDirection) ?? null)
        : null;

    const newConnectionDirectionField = (
        <SelectInput
            name={`${id}.${FieldConstants.CONNECTION_DIRECTION}`}
            label="ConnectionDirection"
            options={Object.values(CONNECTION_DIRECTIONS)}
            previousValue={
                (previousConnectionDirectionLabel &&
                    intl.formatMessage({
                        id: previousConnectionDirectionLabel,
                    })) ??
                undefined
            }
            fullWidth
            size="small"
        />
    );

    const handleClickOpenDiagramPane = useCallback(() => {
        setIsDiagramPaneOpen(true);
    }, []);

    const handleCloseDiagramPane = useCallback(() => {
        setIsDiagramPaneOpen(false);
    }, []);

    const newConnectionPositionField = (
        <IntegerInput
            name={`${id}.${FieldConstants.CONNECTION_POSITION}`}
            label="ConnectionPosition"
            previousValue={
                isEquipmentModification
                    ? (previousValues?.connectablePosition?.connectionPosition ?? undefined)
                    : undefined
            }
            clearable
        />
    );

    const newPositionIconField = (
        <IconButton
            {...(isNodeBuilt && watchVoltageLevelId && { onClick: handleClickOpenDiagramPane })}
            disableRipple={!isNodeBuilt || !watchVoltageLevelId}
            edge="start"
        >
            <Tooltip
                title={intl.formatMessage({
                    id: getTooltipMessageId,
                })}
            >
                {isNodeBuilt && watchVoltageLevelId ? (
                    <ExploreOutlinedIcon color="action" />
                ) : (
                    <ExploreOffOutlinedIcon color="action" />
                )}
            </Tooltip>
        </IconButton>
    );

    const gridSize = direction && (direction === 'column' || direction === 'column-reverse') ? 24 : 12;
    const conditionalSize = withPosition && withDirectionsInfos ? 8 : gridSize;
    return (
        <>
            <Grid container direction={direction || 'row'} spacing={2} columns={24}>
                <Grid item xs={conditionalSize} sx={{ align: 'start' }}>
                    {newVoltageLevelField}
                </Grid>
                <Grid item xs={conditionalSize} sx={{ align: 'start' }}>
                    {newBusOrBusbarSectionField}
                </Grid>

                {withDirectionsInfos && (
                    <>
                        <Grid item xs={conditionalSize} sx={{ align: 'start' }}>
                            {connectedField}
                        </Grid>
                        <Grid item xs={conditionalSize} sx={{ align: 'start' }}>
                            {newConnectionNameField}
                        </Grid>
                        <Grid item xs={conditionalSize} sx={{ align: 'start' }}>
                            {newConnectionDirectionField}
                        </Grid>
                        {withPosition && (
                            <>
                                <Grid xs={conditionalSize - 1} item sx={{ align: 'start' }}>
                                    {newConnectionPositionField}
                                </Grid>
                                <Grid xs={1} item sx={{ align: 'start' }}>
                                    {newPositionIconField}
                                </Grid>
                            </>
                        )}
                    </>
                )}
            </Grid>
            {PositionDiagramPane && (
                <PositionDiagramPane
                    open={isDiagramPaneOpen}
                    onClose={handleCloseDiagramPane}
                    voltageLevelId={watchVoltageLevelId}
                    studyUuid={studyUuid}
                    currentNodeUuid={nodeUuid}
                    currentRootNetworkUuid={rootNetworkUuid}
                />
            )}
        </>
    );
}
