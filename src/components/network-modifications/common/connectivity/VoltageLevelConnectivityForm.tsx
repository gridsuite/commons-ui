/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { AutocompleteInput, useCustomFormContext } from '../../../inputs';
import { areIdsEqual, FieldConstants, getObjectId, Option } from '../../../../utils';
import { getConnectivityBusBarSectionData, getConnectivityVoltageLevelData } from './connectivityForm.utils';
import { ConnectivityNetworkProps } from './connectivity.type';
import { fetchBusBarSectionsForNewCoupler } from '../../../../services';

export interface VoltageLevelConnectivityFormPreviousValuesProps {
    voltageLevelId?: string;
    busOrBusbarSectionId?: string;
}

export interface VoltageLevelConnectivityFormProps extends ConnectivityNetworkProps {
    id?: string;
    voltageLevelSelectLabel?: string;
    onVoltageLevelChangeCallback?: () => void;
    isEquipmentModification?: boolean;
    previousValues?: VoltageLevelConnectivityFormPreviousValuesProps;
}

export function VoltageLevelConnectivityForm({
    id = FieldConstants.CONNECTIVITY,
    voltageLevelSelectLabel = 'VOLTAGE_LEVEL',
    onVoltageLevelChangeCallback = undefined,
    isEquipmentModification = false,
    previousValues,
    voltageLevelOptions = [],
    fetchBusesOrBusbarSections,
}: Readonly<VoltageLevelConnectivityFormProps>) {
    const [busOrBusbarSectionOptions, setBusOrBusbarSectionOptions] = useState<Option[]>([]);

    const { setValue, getValues } = useCustomFormContext();

    const lastFetchedBusesVlIds = useRef<string | null>(null);

    const watchVoltageLevelId = useWatch({
        name: `${id}.${FieldConstants.VOLTAGE_LEVEL}.${FieldConstants.ID}`,
    });

    const handleChangeVoltageLevel = useCallback(() => {
        onVoltageLevelChangeCallback?.();
        setValue(`${id}.${FieldConstants.BUS_OR_BUSBAR_SECTION}`, null);
    }, [id, onVoltageLevelChangeCallback, setValue]);

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
        const currentBusOrBusbarSection = getValues(`${id}.${FieldConstants.BUS_OR_BUSBAR_SECTION}`);
        if (busOrBusbarSectionOptions?.length > 0 && currentBusOrBusbarSection?.id !== null) {
            setValue(`${id}.${FieldConstants.BUS_OR_BUSBAR_SECTION}`, currentBusOrBusbarSection);
        }
    }, [busOrBusbarSectionOptions, setValue, id, getValues]);

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

    return (
        <Grid container spacing={2}>
            <Grid item xs>
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
            </Grid>
            <Grid item xs>
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
            </Grid>
        </Grid>
    );
}
