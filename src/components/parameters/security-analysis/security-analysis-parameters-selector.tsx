/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { FormattedMessage } from 'react-intl';

import { Grid, Tab, Tabs } from '@mui/material';
import { ILimitReductionsByVoltageLevel, LimitReductionsTableForm, TAB_INFO, TabPanel, TabValues } from '../common';
import { PARAM_PROVIDER_OPENLOADFLOW } from '../loadflow';
import { ViolationsHidingParameters } from './security-analysis-violations-hiding';
import { ISAParameters } from './type';

export function SecurityAnalysisParametersSelector({
    params,
    currentProvider,
    isDeveloperMode,
    defaultLimitReductions,
}: Readonly<{
    params: ISAParameters | null;
    currentProvider?: string;
    isDeveloperMode: boolean;
    defaultLimitReductions: ILimitReductionsByVoltageLevel[];
}>) {
    const [tabSelected, setTabSelected] = useState(TabValues.General);
    const handleTabChange = useCallback((event: SyntheticEvent, newValue: number) => {
        setTabSelected(newValue);
    }, []);

    const tabValue = useMemo(() => {
        return tabSelected === TabValues.LimitReductions && !params?.limitReductions ? TabValues.General : tabSelected;
    }, [params, tabSelected]);

    useEffect(() => {
        if (currentProvider !== PARAM_PROVIDER_OPENLOADFLOW) {
            setTabSelected(TabValues.General);
        }
    }, [currentProvider]);

    return (
        <Grid sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                {TAB_INFO.filter((t) => isDeveloperMode || !t.developerModeOnly).map(
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

            {TAB_INFO.filter((t) => isDeveloperMode || !t.developerModeOnly).map((tab, index) => (
                <TabPanel key={tab.label} value={tabValue} index={index}>
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
