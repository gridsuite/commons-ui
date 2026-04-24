/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, GridDirection, IconButton } from '@mui/material';
import { CustomTooltip } from '../../../tooltip/CustomTooltip';
import {
    ExploreOffOutlined as ExploreOffOutlinedIcon,
    ExploreOutlined as ExploreOutlinedIcon,
} from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { getConnectivityBusBarSectionData, getConnectivityVoltageLevelData } from './connectivityForm.utils';
import { ConnectablePositionFormInfos, ConnectivityNetworkProps } from './connectivity.type';
import { fetchBusBarSectionsForNewCoupler } from '../../../../services/networkModification';
import {
    areIdsEqual,
    CONNECTION_DIRECTIONS,
    FieldConstants,
    getConnectionDirectionLabel,
    getObjectId,
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

/**
 * Hook to handle a 'connectivity value' (voltage level, bus or bus bar section)
 * @param id optional id that has to be defined if the component is used more than once in a form
 * @param voltageLevelSelectLabel label to display for the voltage level auto complete component
 * @param direction direction of placement. Either 'row' or 'column', 'row' by default.
 * @param withDirectionsInfos
 * @param withPosition
 * @param onVoltageLevelChangeCallback callback to be called when the voltage level changes
 * @param isEquipmentModification connectivity form is used in a modification form or not
 * @param previousValues previous values of connectivity form's fields
 * @param voltageLevelOptions list of network voltage levels
 * @param PositionDiagramPane a component type to display current taken positions in the voltage level
 * @param fetchBusesOrBusbarSections a promise to retrieve bus bars for a given voltage level
 * @returns JSX.Element
 */

interface ConnectivityFormProps extends ConnectivityNetworkProps {
    id?: string;
    voltageLevelSelectLabel?: string;
    direction?: GridDirection;
    withDirectionsInfos?: boolean;
    withPosition: boolean;
    onVoltageLevelChangeCallback?: () => void;
    isEquipmentModification?: boolean;
    previousValues?: {
        connectablePosition?: ConnectablePositionFormInfos;
        voltageLevelId?: string;
        busOrBusbarSectionId?: string;
        terminalConnected?: boolean | null;
    };
}

export function ConnectivityForm({
    id = FieldConstants.CONNECTIVITY,
    voltageLevelSelectLabel = 'VOLTAGE_LEVEL',
    direction = 'row',
    withDirectionsInfos = true,
    withPosition = false,
    onVoltageLevelChangeCallback = undefined,
    isEquipmentModification = false,
    previousValues,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
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
                exist: item.exist,
            })),
        [voltageLevelOptions]
    );

    useEffect(() => {
        if (watchVoltageLevelId) {
            const selectedOption = voltageLevelOptions.find((option) => option.id === watchVoltageLevelId);
            if (selectedOption) {
                if (selectedOption.exist === false) {
                    fetchBusBarSectionsForNewCoupler(
                        watchVoltageLevelId,
                        selectedOption.busbarCount,
                        selectedOption.sectionCount,
                        selectedOption.switchKinds
                    )
                        .then((ids) => {
                            lastFetchedBusesVlIds.current = watchVoltageLevelId;
                            setBusOrBusbarSectionOptions(ids.map((bbsId) => ({ id: bbsId, label: '' })));
                        })
                        .catch((error) => {
                            console.error('Failed to fetch busbar sections for new coupler:', error);
                            setBusOrBusbarSectionOptions([]);
                        });
                } else if (fetchBusesOrBusbarSections) {
                    fetchBusesOrBusbarSections(watchVoltageLevelId)
                        .then((busesOrbusbarSections) => {
                            lastFetchedBusesVlIds.current = watchVoltageLevelId;
                            setBusOrBusbarSectionOptions(
                                busesOrbusbarSections?.map((busesOrbusbarSection) => ({
                                    id: busesOrbusbarSection.id,
                                    label: busesOrbusbarSection?.name ?? '',
                                })) || []
                            );
                        })
                        .catch((error) => {
                            console.error('Failed to fetch buses or busbar sections:', error);
                            setBusOrBusbarSectionOptions([]);
                        });
                }
            }
            if (watchVoltageLevelId !== lastFetchedBusesVlIds.current) {
                setBusOrBusbarSectionOptions([]);
            }
        } else {
            setBusOrBusbarSectionOptions([]);
        }
    }, [fetchBusesOrBusbarSections, voltageLevelOptions, watchVoltageLevelId]);

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
        if (!isEquipmentModification || previousValues?.terminalConnected == null) {
            return null;
        }
        return previousValues.terminalConnected
            ? intl.formatMessage({ id: 'connected' })
            : intl.formatMessage({ id: 'disconnected' });
    }, [intl, previousValues, isEquipmentModification]);

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

    const voltageLevelForPositionIcon = useMemo(
        () => watchVoltageLevelId ?? (isEquipmentModification ? previousValues?.voltageLevelId : undefined),
        [watchVoltageLevelId, isEquipmentModification, previousValues?.voltageLevelId]
    );

    const getPositionIconTooltipMessageId = useMemo(() => {
        if (!isNodeBuilt) {
            return 'NodeNotBuildPositionMessage';
        }
        if (voltageLevelForPositionIcon) {
            return 'DisplayTakenPositions';
        }
        return 'NoVoltageLevelPositionMessage';
    }, [isNodeBuilt, voltageLevelForPositionIcon]);

    const newPositionIconField = (
        <IconButton
            {...(isNodeBuilt && voltageLevelForPositionIcon && { onClick: handleClickOpenDiagramPane })}
            disableRipple={!isNodeBuilt || !voltageLevelForPositionIcon}
            edge="start"
        >
            <CustomTooltip
                title={intl.formatMessage({
                    id: getPositionIconTooltipMessageId,
                })}
            >
                {isNodeBuilt && voltageLevelForPositionIcon ? (
                    <ExploreOutlinedIcon color="action" />
                ) : (
                    <ExploreOffOutlinedIcon color="action" />
                )}
            </CustomTooltip>
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
                                {PositionDiagramPane && (
                                    <Grid xs={1} item sx={{ align: 'start' }}>
                                        {newPositionIconField}
                                    </Grid>
                                )}
                            </>
                        )}
                    </>
                )}
            </Grid>
            {PositionDiagramPane && (
                <PositionDiagramPane
                    open={isDiagramPaneOpen}
                    onClose={handleCloseDiagramPane}
                    voltageLevelId={voltageLevelForPositionIcon}
                />
            )}
        </>
    );
}
