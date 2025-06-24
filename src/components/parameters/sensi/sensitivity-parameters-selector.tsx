/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import { Box, Tab, Tabs, Theme, CircularProgress, Grid } from '@mui/material';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import * as sensiParam from './columns-definitions';
import {
    IColumnsDef,
    SensiHvdcs,
    SensiInjection,
    SensiInjectionsSet,
    SensiNodes,
    SensiPsts,
    SensiTabValues,
} from './columns-definitions';
import { SensitivityTable } from './sensitivity-table';
import { TabPanel } from '../common';
import { useCreateRowDataSensi } from '../../../hooks/use-create-row-data-sensi';

const styles = {
    circularProgress: (theme: Theme) => ({
        display: 'flex',
        marginRight: theme.spacing(1),
        color: theme.palette.primary.main,
    }),
    errorOutlineIcon: (theme: Theme) => ({
        marginRight: theme.spacing(1),
        color: theme.palette.error.main,
        display: 'flex',
    }),
    textInfo: (theme: Theme) => ({
        color: theme.palette.primary.main,
        display: 'flex',
    }),
    textInitial: {
        color: 'grey',
    },
    textAlert: (theme: Theme) => ({
        color: theme.palette.error.main,
        display: 'flex',
    }),
    boxContent: {
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'right',
        flex: 'auto',
        flexGrow: '1',
        whiteSpace: 'pre-wrap',
    },
};

interface SensitivityParametersSelectorProps {
    onFormChanged: (hasFormChanged: boolean) => void;
    onChangeParams: (a: any, b: any, c: number) => void; // fixing any on "b" here is not trivial, will need to fix SensitivityTable which is used in another unrelated component
    launchLoader: boolean;
    analysisComputeComplexity: number;
    enableDeveloperMode: boolean;
    isStudyLinked: boolean;
}

interface TabInfo {
    label: string;
    subTabs?: { label: string }[];
}

function SensitivityParametersSelector({
    onFormChanged,
    onChangeParams,
    launchLoader,
    analysisComputeComplexity,
    enableDeveloperMode,
    isStudyLinked,
}: Readonly<SensitivityParametersSelectorProps>) {
    const intl = useIntl();

    const [tabValue, setTabValue] = useState(SensiTabValues.SensitivityBranches);
    const [subTabValue, setSubTabValue] = useState(SensiTabValues.SensiInjectionsSet);
    const handleTabChange = useCallback((event: React.SyntheticEvent<Element, Event>, newValue: number) => {
        setTabValue(newValue);
    }, []);
    const handleSubTabChange = useCallback((event: React.SyntheticEvent<Element, Event>, newValue: number) => {
        setSubTabValue(newValue);
    }, []);

    const tabInfo: TabInfo[] = [
        {
            label: 'SensitivityBranches',
            subTabs: [
                { label: 'SensiInjectionsSet' },
                { label: 'SensiInjection' },
                { label: 'SensiHVDC' },
                { label: 'SensiPST' },
            ],
        },
        ...((enableDeveloperMode && [{ label: 'SensitivityNodes' }]) || []),
    ];

    const [rowDataInjectionsSet, useFieldArrayOutputInjectionsSet] = useCreateRowDataSensi(
        sensiParam.SensiInjectionsSet
    );

    const [rowDataInjections, useFieldArrayOutputInjections] = useCreateRowDataSensi(sensiParam.SensiInjection);

    const [rowDataHvdc, useFieldArrayOutputHvdc] = useCreateRowDataSensi(sensiParam.SensiHvdcs);

    const [rowDataPst, useFieldArrayOutputPst] = useCreateRowDataSensi(sensiParam.SensiPsts);

    const [rowDataNodes, useFieldArrayOutputNodes] = useCreateRowDataSensi(sensiParam.SensiNodes);

    const getColumnsDefinition = useCallback(
        (sensiColumns: IColumnsDef[]) => {
            if (sensiColumns) {
                return sensiColumns.map((column) => ({
                    ...column,
                    label: intl.formatMessage({ id: column.label }),
                }));
            }
            return [];
        },
        [intl]
    );

    const renderComputingEventLoading = () => {
        return (
            <Box sx={styles.textInfo}>
                <CircularProgress size="1em" sx={styles.circularProgress} />
                <FormattedMessage id="loadingComputing" />
            </Box>
        );
    };

    useEffect(() => {
        if (!enableDeveloperMode) {
            setTabValue(SensiTabValues.SensitivityBranches);
        }
    }, [enableDeveloperMode]);

    const ComputingEvent = useMemo(() => {
        const renderComputingEvent = () => {
            if (analysisComputeComplexity < 999999 && analysisComputeComplexity > 500000) {
                return (
                    <Box sx={styles.textAlert}>
                        <ErrorOutlineIcon sx={styles.errorOutlineIcon} />
                        <FormattedMessage
                            id="sensitivityAnalysis.simulatedComputations"
                            values={{
                                count: analysisComputeComplexity.toString(),
                            }}
                        />
                    </Box>
                );
            }
            if (analysisComputeComplexity > 999999) {
                return (
                    <Box sx={styles.textAlert}>
                        <ErrorOutlineIcon sx={styles.errorOutlineIcon} />
                        <FormattedMessage id="sensitivityAnalysis.moreThanOneMillionComputations" />
                    </Box>
                );
            }
            if (analysisComputeComplexity === 0) {
                return (
                    <Box sx={styles.textInitial}>
                        <FormattedMessage
                            id="sensitivityAnalysis.simulatedComputations"
                            values={{
                                count: analysisComputeComplexity.toString(),
                            }}
                        />
                    </Box>
                );
            }
            return (
                <Box sx={styles.textInfo}>
                    <FormattedMessage
                        id="sensitivityAnalysis.simulatedComputations"
                        values={{
                            count: analysisComputeComplexity.toString(),
                        }}
                    />
                </Box>
            );
        };

        return launchLoader ? renderComputingEventLoading() : renderComputingEvent();
    }, [analysisComputeComplexity, launchLoader]);

    return (
        <Grid sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                {tabInfo.map((tab, index) => (
                    <Tab
                        key={tab.label}
                        label={<FormattedMessage id={tab.label} />}
                        value={index}
                        sx={{
                            fontSize: 17,
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                        }}
                    />
                ))}
            </Tabs>
            {tabInfo.map((tab, index) => (
                <TabPanel key={tab.label} value={tabValue} index={index} sx={{ paddingTop: 1 }}>
                    {tabValue === SensiTabValues.SensitivityBranches && tab.subTabs && (
                        <>
                            <Tabs value={subTabValue} onChange={handleSubTabChange}>
                                {tab.subTabs.map((subTab, subIndex) => (
                                    <Tab
                                        key={subTab.label}
                                        value={subIndex}
                                        sx={{
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize',
                                        }}
                                        label={<FormattedMessage id={subTab.label} />}
                                    />
                                ))}
                            </Tabs>
                            {isStudyLinked && (
                                <Box sx={styles.boxContent}>
                                    {ComputingEvent}
                                    <FormattedMessage id="sensitivityAnalysis.separator" />
                                    <FormattedMessage id="sensitivityAnalysis.maximumSimulatedComputations" />
                                </Box>
                            )}

                            <TabPanel index={SensiTabValues.SensiInjectionsSet} value={subTabValue}>
                                <SensitivityTable
                                    arrayFormName={`${SensiInjectionsSet.name}`}
                                    columnsDefinition={getColumnsDefinition(
                                        sensiParam.COLUMNS_DEFINITIONS_INJECTIONS_SET
                                    )}
                                    useFieldArrayOutput={useFieldArrayOutputInjectionsSet}
                                    createRows={rowDataInjectionsSet}
                                    tableHeight={300}
                                    onFormChanged={onFormChanged}
                                    onChangeParams={onChangeParams}
                                />
                            </TabPanel>
                            <TabPanel index={SensiTabValues.SensiInjection} value={subTabValue}>
                                <SensitivityTable
                                    arrayFormName={`${SensiInjection.name}`}
                                    columnsDefinition={getColumnsDefinition(sensiParam.COLUMNS_DEFINITIONS_INJECTIONS)}
                                    useFieldArrayOutput={useFieldArrayOutputInjections}
                                    createRows={rowDataInjections}
                                    tableHeight={300}
                                    onFormChanged={onFormChanged}
                                    onChangeParams={onChangeParams}
                                />
                            </TabPanel>
                            <TabPanel index={SensiTabValues.SensiHVDC} value={subTabValue}>
                                <SensitivityTable
                                    arrayFormName={`${SensiHvdcs.name}`}
                                    columnsDefinition={getColumnsDefinition(sensiParam.COLUMNS_DEFINITIONS_HVDCS)}
                                    useFieldArrayOutput={useFieldArrayOutputHvdc}
                                    createRows={rowDataHvdc}
                                    tableHeight={300}
                                    onFormChanged={onFormChanged}
                                    onChangeParams={onChangeParams}
                                />
                            </TabPanel>
                            <TabPanel index={SensiTabValues.SensiPST} value={subTabValue}>
                                <SensitivityTable
                                    arrayFormName={`${SensiPsts.name}`}
                                    columnsDefinition={getColumnsDefinition(sensiParam.COLUMNS_DEFINITIONS_PSTS)}
                                    useFieldArrayOutput={useFieldArrayOutputPst}
                                    createRows={rowDataPst}
                                    tableHeight={300}
                                    onFormChanged={onFormChanged}
                                    onChangeParams={onChangeParams}
                                />
                            </TabPanel>
                        </>
                    )}
                    {tabValue === SensiTabValues.SensitivityNodes && (
                        <SensitivityTable
                            arrayFormName={`${SensiNodes.name}`}
                            columnsDefinition={getColumnsDefinition(sensiParam.COLUMNS_DEFINITIONS_NODES)}
                            useFieldArrayOutput={useFieldArrayOutputNodes}
                            createRows={rowDataNodes}
                            tableHeight={367}
                            onFormChanged={onFormChanged}
                            onChangeParams={onChangeParams}
                        />
                    )}
                </TabPanel>
            ))}
        </Grid>
    );
}

export default SensitivityParametersSelector;
