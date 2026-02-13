/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import * as sensiParam from './columns-definitions';
import {
    SensiBranchesTabValues,
    SensiHvdcs,
    SensiInjection,
    SensiInjectionsSet,
    SensiNodes,
    SensiPsts,
    SensiTabValues,
} from './columns-definitions';
import { TabPanel } from '../common';
import { useCreateRowData } from '../../../hooks/use-create-row-data';
import type { MuiStyles } from '../../../utils/styles';
import { SensitivityAnalysisParametersFactorCount } from './sensitivity-analysis-parameters-factor-count';
import { MAX_RESULTS_COUNT, MAX_VARIABLES_COUNT } from './constants';
import { FactorsCount } from '../../../utils';
import { isValidSensiParameterRow } from './utils';
import { IColumnsDef, ParameterTable } from '../common/parameter-table';

const styles = {
    circularProgress: (theme) => ({
        display: 'flex',
        marginRight: theme.spacing(1),
        color: theme.palette.primary.main,
    }),
    errorOutlineIcon: (theme) => ({
        marginRight: theme.spacing(1),
        color: theme.palette.error.main,
        display: 'flex',
    }),
    textInfo: (theme) => ({
        color: theme.palette.primary.main,
        display: 'flex',
    }),
    textInitial: {
        color: 'grey',
    },
    textAlert: (theme) => ({
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
} as const satisfies MuiStyles;

interface SensitivityParametersSelectorProps {
    onFormChanged: () => void;
    isLoading: boolean;
    factorsCount: FactorsCount;
    isDeveloperMode: boolean;
    isStudyLinked: boolean;
}

interface TabInfo {
    label: string;
    subTabs?: { label: string }[];
}

function SensitivityParametersSelector({
    onFormChanged,
    isLoading,
    factorsCount,
    isDeveloperMode,
    isStudyLinked,
}: Readonly<SensitivityParametersSelectorProps>) {
    const intl = useIntl();

    const [tabValue, setTabValue] = useState(SensiTabValues.SensitivityBranches);
    const [subTabValue, setSubTabValue] = useState(SensiBranchesTabValues.SensiInjectionsSet);
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
        ...((isDeveloperMode && [{ label: 'SensitivityNodes' }]) || []),
    ];

    const [rowDataInjectionsSet, useFieldArrayOutputInjectionsSet] = useCreateRowData(sensiParam.SensiInjectionsSet);

    const [rowDataInjections, useFieldArrayOutputInjections] = useCreateRowData(sensiParam.SensiInjection);

    const [rowDataHvdc, useFieldArrayOutputHvdc] = useCreateRowData(sensiParam.SensiHvdcs);

    const [rowDataPst, useFieldArrayOutputPst] = useCreateRowData(sensiParam.SensiPsts);

    const [rowDataNodes, useFieldArrayOutputNodes] = useCreateRowData(sensiParam.SensiNodes);

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

    useEffect(() => {
        if (!isDeveloperMode) {
            setTabValue(SensiTabValues.SensitivityBranches);
        }
    }, [isDeveloperMode]);

    return (
        <Grid sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
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
                {isStudyLinked && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ ...styles.boxContent, minWidth: 300 }}>
                            <SensitivityAnalysisParametersFactorCount
                                count={factorsCount.variableCount}
                                maxCount={MAX_VARIABLES_COUNT}
                                messageId="sensitivityAnalysis.simulatedVariables"
                                isLoading={isLoading}
                            />
                            <FormattedMessage id="sensitivityAnalysis.separator" />
                            <FormattedMessage
                                id="sensitivityAnalysis.maximumFactorsCount"
                                values={{
                                    maxFactorsCount: MAX_VARIABLES_COUNT.toLocaleString(),
                                }}
                            />
                        </Box>
                        <Box sx={{ ...styles.boxContent, minWidth: 300 }}>
                            <SensitivityAnalysisParametersFactorCount
                                count={factorsCount.resultCount}
                                maxCount={MAX_RESULTS_COUNT}
                                messageId="sensitivityAnalysis.simulatedResults"
                                isLoading={isLoading}
                            />
                            <FormattedMessage id="sensitivityAnalysis.separator" />
                            <FormattedMessage
                                id="sensitivityAnalysis.maximumFactorsCount"
                                values={{
                                    maxFactorsCount: MAX_RESULTS_COUNT.toLocaleString(),
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
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

                            <TabPanel index={SensiBranchesTabValues.SensiInjectionsSet} value={subTabValue}>
                                <ParameterTable
                                    arrayFormName={`${SensiInjectionsSet.name}`}
                                    columnsDefinition={getColumnsDefinition(
                                        sensiParam.COLUMNS_DEFINITIONS_INJECTIONS_SET
                                    )}
                                    useFieldArrayOutput={useFieldArrayOutputInjectionsSet}
                                    createRows={rowDataInjectionsSet}
                                    tableHeight={300}
                                    onFormChanged={onFormChanged}
                                    isValidParameterRow={isValidSensiParameterRow}
                                />
                            </TabPanel>
                            <TabPanel index={SensiBranchesTabValues.SensiInjection} value={subTabValue}>
                                <ParameterTable
                                    arrayFormName={`${SensiInjection.name}`}
                                    columnsDefinition={getColumnsDefinition(sensiParam.COLUMNS_DEFINITIONS_INJECTIONS)}
                                    useFieldArrayOutput={useFieldArrayOutputInjections}
                                    createRows={rowDataInjections}
                                    tableHeight={300}
                                    onFormChanged={onFormChanged}
                                    isValidParameterRow={isValidSensiParameterRow}
                                />
                            </TabPanel>
                            <TabPanel index={SensiBranchesTabValues.SensiHVDC} value={subTabValue}>
                                <ParameterTable
                                    arrayFormName={`${SensiHvdcs.name}`}
                                    columnsDefinition={getColumnsDefinition(sensiParam.COLUMNS_DEFINITIONS_HVDCS)}
                                    useFieldArrayOutput={useFieldArrayOutputHvdc}
                                    createRows={rowDataHvdc}
                                    tableHeight={300}
                                    onFormChanged={onFormChanged}
                                    isValidParameterRow={isValidSensiParameterRow}
                                />
                            </TabPanel>
                            <TabPanel index={SensiBranchesTabValues.SensiPST} value={subTabValue}>
                                <ParameterTable
                                    arrayFormName={`${SensiPsts.name}`}
                                    columnsDefinition={getColumnsDefinition(sensiParam.COLUMNS_DEFINITIONS_PSTS)}
                                    useFieldArrayOutput={useFieldArrayOutputPst}
                                    createRows={rowDataPst}
                                    tableHeight={300}
                                    onFormChanged={onFormChanged}
                                    isValidParameterRow={isValidSensiParameterRow}
                                />
                            </TabPanel>
                        </>
                    )}
                    {tabValue === SensiTabValues.SensitivityNodes && (
                        <ParameterTable
                            arrayFormName={`${SensiNodes.name}`}
                            columnsDefinition={getColumnsDefinition(sensiParam.COLUMNS_DEFINITIONS_NODES)}
                            useFieldArrayOutput={useFieldArrayOutputNodes}
                            createRows={rowDataNodes}
                            tableHeight={367}
                            onFormChanged={onFormChanged}
                            isValidParameterRow={isValidSensiParameterRow}
                        />
                    )}
                </TabPanel>
            ))}
        </Grid>
    );
}

export default SensitivityParametersSelector;
