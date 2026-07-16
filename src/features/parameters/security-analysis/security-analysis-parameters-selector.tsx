/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent, useCallback, useEffect, useMemo, useState, ForwardedRef } from 'react';

import { FormattedMessage } from 'react-intl';

import { Grid2 as Grid, Tab, Tabs } from '@mui/material';
import type { UUID } from 'node:crypto';
import {
    ILimitReductionsByVoltageLevel,
    LimitReductionsTableForm,
    TAB_INFO,
    TabPanel,
    TabValues,
    CONTINGENCY_LISTS_INFOS,
    ContingencyTableApi,
} from '../common';
import { ContingencyTable } from '../common/contingency-table';
import { ContingencyCount } from '../common/contingency-table/types';
import { PARAM_PROVIDER_OPENLOADFLOW } from '../loadflow';
import { ViolationsHidingParameters } from './security-analysis-violations-hiding';
import { SAParametersEnriched } from '../../../utils/types';

export function SecurityAnalysisParametersSelector({
    params,
    currentProvider,
    isDeveloperMode,
    defaultLimitReductions,
    showContingencyCount,
    fetchContingencyCount,
    contingencyTableApiRef,
    isBuiltCurrentNode,
}: Readonly<{
    params: SAParametersEnriched | null;
    currentProvider?: string;
    isDeveloperMode: boolean;
    defaultLimitReductions: ILimitReductionsByVoltageLevel[];
    showContingencyCount: boolean;
    fetchContingencyCount?: (contingencyListIds: UUID[] | null, abortSignal: AbortSignal) => Promise<ContingencyCount>;
    contingencyTableApiRef?: ForwardedRef<ContingencyTableApi>;
    isBuiltCurrentNode?: boolean;
}>) {
    const [tabSelected, setTabSelected] = useState(TabValues.Contingencies);

    const handleTabChange = useCallback((event: SyntheticEvent, newValue: number) => {
        setTabSelected(newValue);
    }, []);

    const tabValue = useMemo(() => {
        return tabSelected === TabValues.LimitReductions && !params?.limitReductions
            ? TabValues.Contingencies
            : tabSelected;
    }, [params, tabSelected]);

    useEffect(() => {
        if (currentProvider !== PARAM_PROVIDER_OPENLOADFLOW && tabSelected === TabValues.LimitReductions) {
            setTabSelected(TabValues.Contingencies);
        }
    }, [currentProvider, tabSelected]);

    const visibleTabs = TAB_INFO.filter((t) => isDeveloperMode || !t.developerModeOnly);

    return (
        <Grid sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                {visibleTabs.map(
                    (tab, index) =>
                        (tab.label !== TabValues[TabValues.LimitReductions] ||
                            (currentProvider === PARAM_PROVIDER_OPENLOADFLOW && params?.limitReductions)) && (
                            <Tab
                                key={tab.label}
                                label={<FormattedMessage id={tab.label} />}
                                value={index}
                                sx={{
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                }}
                            />
                        )
                )}
            </Tabs>

            {visibleTabs.map((tab, index) => (
                <TabPanel key={tab.label} value={tabValue} index={index}>
                    {tabValue === TabValues.Contingencies && (
                        <ContingencyTable
                            name={CONTINGENCY_LISTS_INFOS}
                            showContingencyCount={showContingencyCount}
                            fetchContingencyCount={fetchContingencyCount}
                            isBuiltCurrentNode={isBuiltCurrentNode}
                            ref={contingencyTableApiRef}
                        />
                    )}

                    {tabValue === TabValues.General && <ViolationsHidingParameters />}

                    {tabValue === TabValues.LimitReductions &&
                        currentProvider === PARAM_PROVIDER_OPENLOADFLOW &&
                        params?.limitReductions && (
                            <Grid sx={{ width: '100%' }}>
                                <LimitReductionsTableForm limits={params?.limitReductions ?? defaultLimitReductions} />
                            </Grid>
                        )}
                </TabPanel>
            ))}
        </Grid>
    );
}
