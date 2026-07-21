/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent, useCallback, useEffect, useMemo, useState, ForwardedRef } from 'react';

import { FormattedMessage } from 'react-intl';

import { Tab, Tabs } from '@mui/material';
import type { UUID } from 'node:crypto';
import {
    ILimitReductionsByVoltageLevel,
    LimitReductionsTableForm,
    TabPanel,
    CONTINGENCY_LISTS_INFOS,
    ContingencyTableApi,
} from '../common';
import { ContingencyTable } from '../common/contingency-table';
import { ContingencyCount } from '../common/contingency-table/types';
import { PARAM_PROVIDER_OPENLOADFLOW } from '../loadflow';
import { ViolationsHidingParameters } from './security-analysis-violations-hiding';
import { SAParametersEnriched } from '../../../utils/types';
import { TabValues } from './constants';
import type { MuiStyles } from '../../../utils/styles';

const styles = {
    tab: {
        fontSize: 17,
        fontWeight: 'bold',
    },
} as const satisfies MuiStyles;

export function SecurityAnalysisParametersContent({
    params,
    currentProvider,
    defaultLimitReductions,
    showContingencyCount,
    fetchContingencyCount,
    contingencyTableApiRef,
    isBuiltCurrentNode,
}: Readonly<{
    params: SAParametersEnriched | null;
    currentProvider?: string;
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

    return (
        <>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab
                    label={<FormattedMessage id={TabValues[TabValues.Contingencies]} />}
                    value={TabValues.Contingencies}
                    sx={styles.tab}
                />
                <Tab
                    label={<FormattedMessage id={TabValues[TabValues.Aggravation]} />}
                    value={TabValues.Aggravation}
                    sx={styles.tab}
                />
                {currentProvider === PARAM_PROVIDER_OPENLOADFLOW && params?.limitReductions && (
                    <Tab
                        label={<FormattedMessage id={TabValues[TabValues.LimitReductions]} />}
                        value={TabValues.LimitReductions}
                        sx={styles.tab}
                    />
                )}
            </Tabs>

            <TabPanel value={tabValue} index={TabValues.Contingencies} keepState>
                <ContingencyTable
                    name={CONTINGENCY_LISTS_INFOS}
                    showContingencyCount={showContingencyCount}
                    fetchContingencyCount={fetchContingencyCount}
                    isBuiltCurrentNode={isBuiltCurrentNode}
                    ref={contingencyTableApiRef}
                />
            </TabPanel>
            <TabPanel value={tabValue} index={TabValues.Aggravation}>
                <ViolationsHidingParameters />
            </TabPanel>
            <TabPanel value={tabValue} index={TabValues.LimitReductions}>
                {currentProvider === PARAM_PROVIDER_OPENLOADFLOW && params?.limitReductions && (
                    <LimitReductionsTableForm limits={params.limitReductions ?? defaultLimitReductions} />
                )}
            </TabPanel>
        </>
    );
}
