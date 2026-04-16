/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ReactNode } from 'react';
import { Grid, LinearProgress, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { FieldErrors } from 'react-hook-form';
import { ProviderParam, TabPanel } from '../common';
import { useTabs } from '../common/hook/use-tabs';

import { getTabStyle, parametersStyles } from '../parameters-style';
import { VoltageLevelInfos } from '../../../utils/types/equipmentType';
import { mergeSx } from '../../../utils/styles';
import { TabValues } from './dynamic-simulation.type';
import { TimeDelayParameters } from './time-delay';
import { SolverParameters } from './solver';
import { MAPPING, MappingParameters } from './mapping';
import { NetworkParameters } from './network';
import CurveParameters from './curve/curve-parameters';
import { ExpertFilter, IdentifiableAttributes } from '../../filter';
import { UseComputationParametersFormReturn } from '../common/utils';

type DynamicSimulationFormProps = {
    dynamicSimulationMethods: UseComputationParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: (onSubmitError: (errors: FieldErrors) => void) => ReactNode;
    // fetchers for curve parameters
    voltageLevelsFetcher?: () => Promise<VoltageLevelInfos[]>;
    countriesFetcher?: () => Promise<string[]>;
    evaluateFilterFetcher?: (filter: ExpertFilter) => Promise<IdentifiableAttributes[]>;
};

export function DynamicSimulationForm({
    dynamicSimulationMethods,
    renderTitleFields,
    renderActions,
    // fetchers for curve parameters
    voltageLevelsFetcher,
    countriesFetcher,
    evaluateFilterFetcher,
}: Readonly<DynamicSimulationFormProps>) {
    const { paramsLoaded, formattedProviders } = dynamicSimulationMethods;

    const { selectedTab, tabsWithError, onTabChange, onError } = useTabs({
        defaultTab: TabValues.TAB_TIME_DELAY,
        tabEnum: TabValues,
    });

    return (
        <>
            {renderTitleFields?.()}
            {paramsLoaded ? (
                <Grid container sx={{ height: '100%' }} direction="column">
                    <Grid container>
                        <ProviderParam options={formattedProviders} />
                    </Grid>
                    <Grid>
                        <Tabs value={selectedTab} variant="scrollable" onChange={onTabChange} aria-label="parameters">
                            <Tab
                                label={<FormattedMessage id="DynamicSimulationTimeDelay" />}
                                value={TabValues.TAB_TIME_DELAY}
                                sx={getTabStyle(tabsWithError, TabValues.TAB_TIME_DELAY)}
                            />
                            <Tab
                                label={<FormattedMessage id="DynamicSimulationSolver" />}
                                value={TabValues.TAB_SOLVER}
                                sx={getTabStyle(tabsWithError, TabValues.TAB_SOLVER)}
                            />
                            <Tab
                                label={<FormattedMessage id="DynamicSimulationMapping" />}
                                value={TabValues.TAB_MAPPING}
                                sx={getTabStyle(tabsWithError, TabValues.TAB_MAPPING)}
                            />
                            <Tab
                                label={<FormattedMessage id="DynamicSimulationNetwork" />}
                                value={TabValues.TAB_NETWORK}
                                sx={getTabStyle(tabsWithError, TabValues.TAB_NETWORK)}
                            />
                            <Tab
                                label={<FormattedMessage id="DynamicSimulationCurve" />}
                                value={TabValues.TAB_CURVE}
                                sx={getTabStyle(tabsWithError, TabValues.TAB_CURVE)}
                            />
                        </Tabs>
                    </Grid>
                    <Grid
                        container
                        item
                        xs
                        key="dsParameters"
                        sx={mergeSx(parametersStyles.scrollableGrid, {
                            paddingTop: 0,
                            width: '100%',
                        })}
                    >
                        <TabPanel value={selectedTab} index={TabValues.TAB_TIME_DELAY}>
                            <TimeDelayParameters path={TabValues.TAB_TIME_DELAY} />
                        </TabPanel>
                        <TabPanel value={selectedTab} index={TabValues.TAB_SOLVER}>
                            <SolverParameters path={TabValues.TAB_SOLVER} />
                        </TabPanel>
                        <TabPanel value={selectedTab} index={TabValues.TAB_MAPPING}>
                            <MappingParameters path={TabValues.TAB_MAPPING} />
                        </TabPanel>
                        <TabPanel value={selectedTab} index={TabValues.TAB_NETWORK}>
                            <NetworkParameters path={TabValues.TAB_NETWORK} />
                        </TabPanel>
                        <TabPanel value={selectedTab} index={TabValues.TAB_CURVE}>
                            <CurveParameters
                                path={TabValues.TAB_CURVE}
                                mappingPath={`${TabValues.TAB_MAPPING}.${MAPPING}`}
                                voltageLevelsFetcher={voltageLevelsFetcher}
                                countriesFetcher={countriesFetcher}
                                evaluateFilterFetcher={evaluateFilterFetcher}
                            />
                        </TabPanel>
                    </Grid>
                    {renderActions?.(onError)}
                </Grid>
            ) : (
                <LinearProgress />
            )}
        </>
    );
}
