/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ComponentType, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid2 as Grid, Slider, TextField, Tooltip, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { InfoOutlined } from '@mui/icons-material';
import { AutocompleteInput, SelectInput, SwitchInput, useCustomFormContext } from '../../../../components/ui';
import { GridSection } from '../../../../components/composite/grid/grid-section';
import { areIdsEqual, FieldConstants, getObjectId, Option } from '../../../../utils';
import { filledTextField } from '../../common';
import { BusBarSections, POSITION_NEW_SECTION_SIDE } from './voltageLevelSectionCreation.types';
import { SWITCH_TYPE } from '../creation/voltageLevelCreation.utils';

const getArrayPosition = (data: BusBarSections, selectedOptionId: string) => {
    if (!selectedOptionId || !data) {
        return { position: -1, length: 0 };
    }

    for (const array of Object.values(data)) {
        if (Array.isArray(array)) {
            const position = array.indexOf(selectedOptionId);
            if (position !== -1) {
                return { position, length: array.length };
            }
        }
    }
    return { position: -1, length: 0 };
};

type OptionWithDisabled = Option & { disabled?: boolean };

type PositionDiagramPaneType = ComponentType<{
    open: boolean;
    onClose: () => void;
    voltageLevelId: string;
}>;

export interface CreateVoltageLevelSectionFormProps {
    busBarSectionInfos?: BusBarSections;
    voltageLevelId: string;
    allBusbarSectionsList: string[];
    isUpdate?: boolean;
    isSymmetricalNbBusBarSections: boolean;
    isNotFoundOrNotSupported: boolean;
    PositionDiagramPane?: PositionDiagramPaneType;
}

export function CreateVoltageLevelSectionForm({
    busBarSectionInfos,
    voltageLevelId,
    allBusbarSectionsList,
    isUpdate,
    isSymmetricalNbBusBarSections,
    isNotFoundOrNotSupported,
    PositionDiagramPane,
}: Readonly<CreateVoltageLevelSectionFormProps>) {
    const intl = useIntl();
    const [isDiagramPaneOpen, setIsDiagramPaneOpen] = useState(false);
    const [busBarSectionsIdOptions, setBusBarSectionsIdOptions] = useState<Option[]>([]);
    const [isNotRequiredSwitchBefore, setIsNotRequiredSwitchBefore] = useState(false);
    const [isNotRequiredSwitchAfter, setIsNotRequiredSwitchAfter] = useState(false);
    const { setValue, isNodeBuilt } = useCustomFormContext();
    const busbarIndex = useWatch({ name: FieldConstants.BUS_BAR_INDEX });
    const selectedOption = useWatch({ name: FieldConstants.BUSBAR_SECTION_ID });
    const selectedPositionOption = useWatch({ name: FieldConstants.IS_AFTER_BUSBAR_SECTION_ID });
    const voltageLevelIdField = (
        <TextField
            size="small"
            fullWidth
            label={intl.formatMessage({ id: 'VoltageLevelId' })}
            value={voltageLevelId}
            InputProps={{
                readOnly: true,
            }}
            disabled
            {...filledTextField}
        />
    );
    const switchValue = useWatch({ name: FieldConstants.NEW_SWITCH_STATES });

    useEffect(() => {
        if (busBarSectionInfos && busbarIndex) {
            const selectedKey = busbarIndex?.id;
            setValue(FieldConstants.ALL_BUS_BAR_SECTIONS, false);
            if (selectedKey === 'all') {
                setValue(FieldConstants.ALL_BUS_BAR_SECTIONS, true);
                if (allBusbarSectionsList && Array.isArray(allBusbarSectionsList)) {
                    const options = allBusbarSectionsList
                        .filter((id): id is string => Boolean(id))
                        .map((id) => ({
                            id: id,
                            label: id,
                        }));
                    setBusBarSectionsIdOptions(options);
                } else {
                    setBusBarSectionsIdOptions([]);
                }
                return;
            }
            const sections = busBarSectionInfos[selectedKey];
            if (!sections || !Array.isArray(sections)) {
                setBusBarSectionsIdOptions([]);
                return;
            }
            const options = sections
                .filter((id): id is string => Boolean(id))
                .map((id) => ({
                    id: id,
                    label: id,
                }));
            setBusBarSectionsIdOptions(options);
        } else {
            setBusBarSectionsIdOptions([]);
        }
    }, [allBusbarSectionsList, busBarSectionInfos, intl, busbarIndex, setValue]);

    const arrayPosition = useMemo(
        () => busBarSectionInfos && getArrayPosition(busBarSectionInfos, selectedOption?.id),
        [busBarSectionInfos, selectedOption?.id]
    );

    useEffect(() => {
        if (selectedOption && selectedPositionOption && busBarSectionInfos && arrayPosition) {
            const selectedSectionIndex = arrayPosition.position;
            const busBarSections = arrayPosition.length - 1;
            if (selectedSectionIndex === 0 && selectedPositionOption === POSITION_NEW_SECTION_SIDE.BEFORE.id) {
                setValue(FieldConstants.SWITCH_BEFORE_NOT_REQUIRED, true);
                setIsNotRequiredSwitchBefore(true);
            } else {
                setValue(FieldConstants.SWITCH_BEFORE_NOT_REQUIRED, false);
                setIsNotRequiredSwitchBefore(false);
            }
            if (
                busBarSections === selectedSectionIndex &&
                selectedPositionOption === POSITION_NEW_SECTION_SIDE.AFTER.id
            ) {
                setValue(FieldConstants.SWITCH_AFTER_NOT_REQUIRED, true);
                setIsNotRequiredSwitchAfter(true);
            } else {
                setValue(FieldConstants.SWITCH_AFTER_NOT_REQUIRED, false);
                setIsNotRequiredSwitchAfter(false);
            }
        }
        if (isUpdate && isNodeBuilt) {
            setValue(FieldConstants.SWITCH_AFTER_NOT_REQUIRED, true);
            setValue(FieldConstants.SWITCH_BEFORE_NOT_REQUIRED, true);
        }
    }, [selectedOption, setValue, busBarSectionInfos, selectedPositionOption, arrayPosition, isUpdate, isNodeBuilt]);

    const busBarIndexOptions = useMemo((): OptionWithDisabled[] => {
        if (busBarSectionInfos) {
            const sortedOptions = Object.keys(busBarSectionInfos || {})
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((key) => ({
                    id: key,
                    label: key,
                }));
            const allOption = {
                id: 'all',
                label: intl.formatMessage({ id: 'allBusbarSections' }),
                disabled: !isSymmetricalNbBusBarSections,
            } as Option & { disabled?: boolean };

            return [...sortedOptions, allOption];
        }
        return [];
    }, [busBarSectionInfos, intl, isSymmetricalNbBusBarSections]);

    const getOptionLabel = (object: string | { id: string | number; label: string | number }) => {
        if (typeof object === 'string') {
            return object;
        }
        if (object?.id === 'all') {
            return intl.formatMessage({ id: 'allBusbarSections' }) ?? '';
        }
        return String(object?.id ?? '');
    };

    const isOptionEqualToValue = (val1: Option, val2: Option) => {
        const getId = (option: Option) => {
            return typeof option === 'string' ? option : String(option?.id ?? '');
        };

        return getId(val1) === getId(val2);
    };

    const handleChangeBusbarIndex = useCallback(() => {
        setValue(FieldConstants.BUSBAR_SECTION_ID, null);
    }, [setValue]);

    const busbarCountField = (
        <AutocompleteInput
            name={FieldConstants.BUS_BAR_INDEX}
            label="Busbar"
            onChangeCallback={handleChangeBusbarIndex}
            options={busBarIndexOptions as Option[]}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            renderOption={(props, option) => {
                const allOptionsDisabled = (option as any).id === 'all' && (option as any)?.disabled;
                const { key, ...otherProps } = props;
                return (
                    <li key={key} {...otherProps}>
                        <div>
                            <div>{getOptionLabel(option)}</div>
                            {allOptionsDisabled && (
                                <div
                                    style={{
                                        fontSize: '0.85rem',
                                        color: 'red',
                                        marginTop: '2px',
                                    }}
                                >
                                    {intl.formatMessage({ id: 'allOptionHelperText' })}
                                </div>
                            )}
                        </div>
                    </li>
                );
            }}
            getOptionDisabled={(option) => (option as any)?.disabled}
            size={'small'}
            disabled={isNotFoundOrNotSupported}
        />
    );

    const busbarSectionsField = (
        <AutocompleteInput
            name={FieldConstants.BUSBAR_SECTION_ID}
            label="BusBarSectionsReference"
            options={busBarSectionsIdOptions}
            getOptionLabel={getObjectId}
            isOptionEqualToValue={areIdsEqual}
            size={'small'}
            disabled={!busbarIndex || isNotFoundOrNotSupported}
        />
    );

    const positionSideNewSectionField = (
        <SelectInput
            name={FieldConstants.IS_AFTER_BUSBAR_SECTION_ID}
            label="isAfterBusBarSectionId"
            options={Object.values(POSITION_NEW_SECTION_SIDE)}
            size={'small'}
            disabled={!busbarIndex || isNotFoundOrNotSupported}
        />
    );

    const switchBeforeField = (
        <SelectInput
            name={FieldConstants.SWITCHES_BEFORE_SECTIONS}
            label={'switchesBeforeSections'}
            options={Object.values(SWITCH_TYPE)}
            size={'small'}
            disabled={!busbarIndex || isNotRequiredSwitchBefore || isNotFoundOrNotSupported}
        />
    );
    const switchAfterField = (
        <SelectInput
            name={FieldConstants.SWITCHES_AFTER_SECTIONS}
            label={'switchesAfterSections'}
            options={Object.values(SWITCH_TYPE)}
            size={'small'}
            disabled={!busbarIndex || isNotRequiredSwitchAfter || isNotFoundOrNotSupported}
        />
    );
    const newSwitchState = (
        <SwitchInput
            name={FieldConstants.NEW_SWITCH_STATES}
            label={switchValue ? 'areSwitchesClosed' : 'areSwitchesOpen'}
        />
    );
    const getLabelDescription = useCallback(() => {
        return intl.formatMessage({ id: 'newSection' });
    }, [intl]);
    const newSectionField = (
        <Slider
            min={0}
            max={3}
            step={0.1}
            value={1.5}
            track={false}
            valueLabelFormat={getLabelDescription}
            valueLabelDisplay="on"
            size="medium"
            disabled
            sx={{
                '& .MuiSlider-thumb': {
                    backgroundColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                        backgroundColor: '#1976d2',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: '#1976d2',
                        color: '#1976d2',
                    },
                },
            }}
        />
    );
    const handleCloseDiagramPane = useCallback(() => {
        setIsDiagramPaneOpen(false);
    }, []);
    const handleClickOpenDiagramPane = useCallback(() => {
        setIsDiagramPaneOpen(true);
    }, []);
    const diagramToolTip = (
        <Tooltip sx={{ paddingLeft: 1 }} title={intl.formatMessage({ id: 'builtNodeTooltipForDiagram' })}>
            <InfoOutlined color="info" fontSize="medium" />
        </Tooltip>
    );
    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>{voltageLevelIdField}</Grid>
                        {PositionDiagramPane && isNodeBuilt && (
                            <Grid size={{ xs: 12, md: 3 }}>
                                <Button onClick={handleClickOpenDiagramPane} variant="outlined" size="small">
                                    <FormattedMessage id={'CreateCouplingDeviceDiagramButton'} />
                                </Button>
                                {diagramToolTip}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                {isNotFoundOrNotSupported && (
                    <Grid size={12}>
                        <Typography variant="body1" color="red">
                            <FormattedMessage id={'notValidVoltageLevel'} />
                        </Typography>
                    </Grid>
                )}
                <Grid size={12}>
                    <GridSection title="SectionPosition" />
                </Grid>

                <Grid size={4}>{busbarCountField}</Grid>
                <Grid size={4}>{busbarSectionsField}</Grid>
                <Grid size={4}>{positionSideNewSectionField}</Grid>

                <Grid size={12}>
                    <GridSection title="Switch" />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>{switchBeforeField}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{newSectionField}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{switchAfterField}</Grid>
                <Grid size={12}>{newSwitchState}</Grid>
            </Grid>
            {PositionDiagramPane && (
                <PositionDiagramPane
                    open={isDiagramPaneOpen}
                    onClose={handleCloseDiagramPane}
                    voltageLevelId={voltageLevelId}
                />
            )}
        </Box>
    );
}
