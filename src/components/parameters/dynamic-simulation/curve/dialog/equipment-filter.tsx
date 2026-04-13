/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, Grid, MenuItem, Select, type SelectChangeEvent, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { buildExpertFilter, CURVE_EQUIPMENT_TYPES, NOMINAL_VOLTAGE_UNIT } from './curve-selector-utils';
import { AGGRID_LOCALES } from '../../../../../translations/not-intl/aggrid-locales';
import { EquipmentType, VoltageLevelInfos } from '../../../../../utils/types/equipmentType';
import { useLocalizedCountries } from '../../../../../hooks/useLocalizedCountries';
import { GsLang } from '../../../../../utils/langs';
import { CheckboxAutocomplete } from '../../../../inputs/checkbox-autocomplete';
import { CustomAGGrid } from '../../../../customAGGrid';
import { useSnackMessage } from '../../../../../hooks/useSnackMessage';
import { snackWithFallback } from '../../../../../utils/error';
import { MuiStyles } from '../../../../../utils/styles';
import { ExpertFilter, IdentifiableAttributes } from '../../../../filter';

export type EquipmentFilterApi = {
    getSelectedEquipments: () => IdentifiableAttributes[];
};

const styles = {
    grid: {
        width: '100%',
        height: '100%',
    },
    criteria: {
        width: '100%',
        height: '56px',
    },
    equipment: {
        width: '100%',
        flexGrow: 1,
    },
    equipmentTitle: (theme) => ({
        marginBottom: theme.spacing(1),
    }),
} as const satisfies MuiStyles;

type EquipmentFilterProps = {
    equipmentType: EquipmentType;
    onChangeEquipmentType: (newEquipmentType: EquipmentType) => void;
    voltageLevelsFetcher?: () => Promise<VoltageLevelInfos[]>;
    countriesFetcher?: () => Promise<string[]>;
    evaluateFilterFetcher?: (filter: ExpertFilter) => Promise<IdentifiableAttributes[]>;
};

const EquipmentFilter = forwardRef<EquipmentFilterApi, EquipmentFilterProps>(
    (
        {
            equipmentType: initialEquipmentType,
            onChangeEquipmentType,
            voltageLevelsFetcher,
            countriesFetcher,
            evaluateFilterFetcher,
        },
        ref
    ) => {
        const { snackError } = useSnackMessage();
        const [gridReady, setGridReady] = useState(false);
        const [isFetching, setIsFetching] = useState<boolean>();

        const intl = useIntl();
        const [equipmentRowData, setEquipmentRowData] = useState<IdentifiableAttributes[]>();
        const equipmentsRef = useRef<AgGridReact<IdentifiableAttributes>>(null);

        // --- Equipment types --- //
        const [equipmentType, setEquipmentType] = useState(initialEquipmentType);

        const handleEquipmentTypeChange = useCallback(
            (event: SelectChangeEvent) => {
                const selectedEquipmentType = event.target.value as EquipmentType;
                setEquipmentType(selectedEquipmentType);
                onChangeEquipmentType(selectedEquipmentType);
            },
            [onChangeEquipmentType]
        );

        // Map of VL names by ID
        const [voltageLevelsMap, setVoltageLevelsMap] = useState(new Map<string, string | undefined>());
        const [voltageLevelIds, setVoltageLevelIds] = useState<string[]>([]);
        const [selectedVoltageLevelIds, setSelectedVoltageLevelIds] = useState<string[]>([]);

        const [nominalVoltages, setNominalVoltages] = useState<number[]>([]);
        const [selectedNominalVoltages, setSelectedNominalVoltages] = useState<number[]>([]);

        // --- country (i.e. countryCode) => fetch from network-map-server --- //
        const [countries, setCountries] = useState<string[]>([]);
        const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
        const { translate } = useLocalizedCountries(intl.locale as GsLang);

        // fetching options in different criterias
        useEffect(() => {
            // Load voltage level IDs
            voltageLevelsFetcher?.()
                .then((voltageLevels) => {
                    const vlMap = new Map<string, string | undefined>();
                    const nvSet = new Set<number>();
                    voltageLevels.forEach((vl) => {
                        vlMap.set(vl.id, vl.name);
                        nvSet.add(vl.nominalV);
                    });
                    setVoltageLevelsMap(vlMap);
                    setNominalVoltages([...nvSet.values()].sort((nv1, nv2) => nv1 - nv2));
                    setVoltageLevelIds([...vlMap.keys()]);
                })
                .catch((error: Error) => {
                    snackWithFallback(snackError, error, { headerId: 'FetchVoltageLevelsError' });
                });

            // load countries
            countriesFetcher?.()
                .then((countryCodes: string[]) => setCountries(countryCodes))
                .catch((error: Error) => {
                    snackWithFallback(snackError, error, { headerId: 'FetchCountryError' });
                });
        }, [voltageLevelsFetcher, countriesFetcher, snackError]);

        // build fetcher which filters equipments
        const filteringEquipmentsFetcher = useMemo(() => {
            const expertFilter = buildExpertFilter(
                equipmentType,
                selectedVoltageLevelIds,
                selectedCountries,
                selectedNominalVoltages
            );
            // the fetcher which evaluates a filter by filter-server
            return evaluateFilterFetcher?.(expertFilter);
        }, [equipmentType, selectedVoltageLevelIds, selectedCountries, selectedNominalVoltages, evaluateFilterFetcher]);

        const [selectedRowsLength, setSelectedRowsLength] = useState(0);
        // fetching filtered equipments
        useEffect(() => {
            let ignore = false;
            if (gridReady && filteringEquipmentsFetcher !== undefined) {
                setIsFetching(true);
                setEquipmentRowData([]);
                setSelectedRowsLength(0);
                filteringEquipmentsFetcher
                    .then((equipments) => {
                        // using ignore flag to cancel fetches that do not return in order
                        if (!ignore) {
                            setEquipmentRowData(equipments);
                        }
                    })
                    .catch((error: Error) => {
                        if (!ignore) {
                            snackWithFallback(snackError, error, { headerId: 'FilterEvaluationError' });
                        }
                    })
                    .finally(() => {
                        if (!ignore) {
                            setIsFetching(false);
                        }
                    });
            }
            return () => {
                ignore = true;
            };
        }, [filteringEquipmentsFetcher, gridReady, snackError]);
        // grid configuration
        const columnDefs = useMemo(() => {
            return [
                {
                    field: 'id',
                    checkboxSelection: true,
                    headerCheckboxSelection: true,
                    headerCheckboxSelectionFilteredOnly: true,
                    minWidth: 80,
                    headerName: intl.formatMessage({
                        id: 'DynamicSimulationCurveDynamicModelHeader',
                    }),
                },
            ];
        }, [intl]);
        const defaultColDef = useMemo(() => {
            return {
                flex: 1,
                minWidth: 100,
                filter: true,
                sortable: true,
                resizable: true,
                lockPinned: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
            };
        }, []);

        const onGridReady = useCallback(() => {
            setGridReady(true);
        }, []);

        const handleEquipmentSelectionChanged = useCallback(() => {
            const selectedRows = equipmentsRef.current?.api.getSelectedRows();
            setSelectedRowsLength(selectedRows?.length ?? 0);
        }, []);

        // expose some api for the component by using ref
        useImperativeHandle(
            ref,
            () => ({
                getSelectedEquipments: () => {
                    return equipmentsRef.current?.api.getSelectedRows() ?? [];
                },
            }),
            []
        );

        return (
            <>
                {/* Equipment type */}
                <Grid item container sx={styles.criteria}>
                    <Grid item xs={4}>
                        <Typography>
                            <FormattedMessage id="DynamicSimulationCurveEquipmentType" />
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Select
                            labelId="DynamicSimulationCurveEquipmentType"
                            value={equipmentType}
                            onChange={handleEquipmentTypeChange}
                            size="small"
                            sx={{ width: '100%' }}
                        >
                            {CURVE_EQUIPMENT_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {intl.formatMessage({ id: type })}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                {/* Post */}
                <Grid item container sx={styles.criteria}>
                    <Grid item xs={4}>
                        <Typography>
                            <FormattedMessage id="DynamicSimulationCurvePost" />
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <CheckboxAutocomplete
                            id="voltage-level"
                            virtualize
                            maxSelection={10}
                            options={voltageLevelIds}
                            value={selectedVoltageLevelIds}
                            getOptionLabel={(value) => voltageLevelsMap.get(value) ?? value}
                            onChange={setSelectedVoltageLevelIds}
                        />
                    </Grid>
                </Grid>
                {/* Country */}
                <Grid item container sx={styles.criteria}>
                    <Grid item xs={4}>
                        <Typography>
                            <FormattedMessage id="DynamicSimulationCurveCountry" />
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <CheckboxAutocomplete
                            id="country"
                            options={countries}
                            value={selectedCountries}
                            getOptionLabel={(value) => translate(value)}
                            onChange={setSelectedCountries}
                        />
                    </Grid>
                </Grid>
                {/* Tension */}
                <Grid item container sx={styles.criteria}>
                    <Grid item xs={4}>
                        <Typography>
                            <FormattedMessage id="DynamicSimulationCurveTension" />
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <CheckboxAutocomplete
                            id="nominal-voltage"
                            options={nominalVoltages}
                            value={selectedNominalVoltages}
                            getOptionLabel={(value) => `${value} ${NOMINAL_VOLTAGE_UNIT}`}
                            onChange={setSelectedNominalVoltages}
                        />
                    </Grid>
                </Grid>
                {/* Equipments */}
                <Grid item container sx={styles.equipment} direction="column">
                    <Grid item>
                        <Typography sx={styles.equipmentTitle} variant="subtitle1">
                            <FormattedMessage id="DynamicSimulationCurveEquipment" />
                            {` (${selectedRowsLength} / ${equipmentRowData?.length ?? 0})`}
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Box sx={styles.grid}>
                            <CustomAGGrid
                                ref={equipmentsRef}
                                rowData={equipmentRowData}
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                rowSelection="multiple"
                                onGridReady={onGridReady}
                                onSelectionChanged={handleEquipmentSelectionChanged}
                                loading={isFetching}
                                overlayLoadingTemplate={intl.formatMessage({ id: 'LoadingRemoteData' })}
                                overrideLocales={AGGRID_LOCALES}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </>
        );
    }
);

export default EquipmentFilter;
