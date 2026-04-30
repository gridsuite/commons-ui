/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Card, CardContent, Grid, Tab, Tabs } from '@mui/material';
import {
    COLUMNS_DEFINITIONS_HVDCS,
    COLUMNS_DEFINITIONS_INJECTIONS,
    COLUMNS_DEFINITIONS_INJECTIONS_SET,
    COLUMNS_DEFINITIONS_NODES,
    COLUMNS_DEFINITIONS_PSTS,
    SensiBranchesTabValues,
    SensiTabValues,
} from './columns-definitions';
import { TabPanel } from '../common';
import { SensitivityAnalysisParametersFactorCount } from './sensitivity-analysis-parameters-factor-count';
import {
    MAX_RESULTS_COUNT,
    MAX_VARIABLES_COUNT,
    PARAMETER_SENSI_HVDC,
    PARAMETER_SENSI_INJECTION,
    PARAMETER_SENSI_INJECTIONS_SET,
    PARAMETER_SENSI_NODES,
    PARAMETER_SENSI_PST,
} from './constants';
import { FactorsCount, MuiStyles } from '../../../utils';
import { isValidSensiParameterRow } from './utils';
import { BuildStatus, BuildStatusChip } from '../../node';
import { ParameterTableField } from '../common/parameter-table-field';
import { DndColumn } from '../../dnd-table-v2';

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
        alignItems: 'center',
        justifyContent: 'right',
        gap: 0.5,
        flex: 'auto',
        flexGrow: '1',
        paddingTop: 1,
    },
} as const satisfies MuiStyles;

interface SensitivityParametersSelectorProps {
    onFormChanged: () => void;
    isLoading: boolean;
    factorsCount: FactorsCount;
    isDeveloperMode: boolean;
    isStudyLinked: boolean;
    isRootNode: boolean;
    globalBuildStatus?: BuildStatus;
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
    isRootNode,
    globalBuildStatus,
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

    const getColumnsDefinition = useCallback(
        (sensiColumns: DndColumn[]) => {
            if (sensiColumns) {
                return sensiColumns.map(
                    (column) =>
                        ({
                            ...column,
                            label: intl.formatMessage({ id: column.label }),
                        }) satisfies DndColumn
                );
            }
            return [];
        },
        [intl]
    );

    const columnsDefinitionInjectionsSet = useMemo(
        () => getColumnsDefinition(COLUMNS_DEFINITIONS_INJECTIONS_SET),
        [getColumnsDefinition]
    );

    const columnsDefinitionInjections = useMemo(
        () => getColumnsDefinition(COLUMNS_DEFINITIONS_INJECTIONS),
        [getColumnsDefinition]
    );

    const columnsDefinitionHvdc = useMemo(
        () => getColumnsDefinition(COLUMNS_DEFINITIONS_HVDCS),
        [getColumnsDefinition]
    );

    const columnsDefinitionPst = useMemo(() => getColumnsDefinition(COLUMNS_DEFINITIONS_PSTS), [getColumnsDefinition]);

    const columnsDefinitionNodes = useMemo(
        () => getColumnsDefinition(COLUMNS_DEFINITIONS_NODES),
        [getColumnsDefinition]
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
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box sx={{ ...styles.boxContent }}>
                                    <BuildStatusChip
                                        buildStatus={globalBuildStatus}
                                        overrideLabel
                                        isRootNode={isRootNode}
                                    />
                                </Box>

                                <Box sx={{ ...styles.boxContent }}>
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
                                <Box sx={{ ...styles.boxContent }}>
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
                        </CardContent>
                    </Card>
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
                                <ParameterTableField
                                    name={PARAMETER_SENSI_INJECTIONS_SET}
                                    columnsDefinition={columnsDefinitionInjectionsSet}
                                    tableHeight={300}
                                    onChange={onFormChanged}
                                    isValidRow={isValidSensiParameterRow}
                                />
                            </TabPanel>
                            <TabPanel index={SensiBranchesTabValues.SensiInjection} value={subTabValue}>
                                <ParameterTableField
                                    name={PARAMETER_SENSI_INJECTION}
                                    columnsDefinition={columnsDefinitionInjections}
                                    tableHeight={300}
                                    onChange={onFormChanged}
                                    isValidRow={isValidSensiParameterRow}
                                />
                            </TabPanel>
                            <TabPanel index={SensiBranchesTabValues.SensiHVDC} value={subTabValue}>
                                <ParameterTableField
                                    name={PARAMETER_SENSI_HVDC}
                                    columnsDefinition={columnsDefinitionHvdc}
                                    tableHeight={300}
                                    onChange={onFormChanged}
                                    isValidRow={isValidSensiParameterRow}
                                />
                            </TabPanel>
                            <TabPanel index={SensiBranchesTabValues.SensiPST} value={subTabValue}>
                                <ParameterTableField
                                    name={PARAMETER_SENSI_PST}
                                    columnsDefinition={columnsDefinitionPst}
                                    tableHeight={300}
                                    onChange={onFormChanged}
                                    isValidRow={isValidSensiParameterRow}
                                />
                            </TabPanel>
                        </>
                    )}
                    {tabValue === SensiTabValues.SensitivityNodes && (
                        <ParameterTableField
                            name={PARAMETER_SENSI_NODES}
                            columnsDefinition={columnsDefinitionNodes}
                            tableHeight={367}
                            onChange={onFormChanged}
                            isValidRow={isValidSensiParameterRow}
                        />
                    )}
                </TabPanel>
            ))}
        </Grid>
    );
}

export default SensitivityParametersSelector;
