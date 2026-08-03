/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { getTabIndicatorStyle, getTabStyle } from '../../../parameters/parameters-style';
import { TwoWindingsTransformerDialogTab } from './twoWindingsTransformer.utils';
import { FieldConstants } from '../../../../utils';
import { useWatch } from 'react-hook-form';

interface TwoWindingsTransformerDialogProps {
    tabIndex: number;
    tabIndexesWithError: number[];
    setTabIndex: (newTabIndex: number) => void;
    isModification?: boolean;
}

export function TwoWindingsTransformerDialogTabs({
    tabIndex,
    tabIndexesWithError,
    setTabIndex,
    isModification = false,
}: Readonly<TwoWindingsTransformerDialogProps>) {
    const phaseTapChangerEnabledWatch = useWatch({
        name: `${FieldConstants.PHASE_TAP_CHANGER}.${FieldConstants.ENABLED}`,
    });
    const ratioTapChangerEnabledWatch = useWatch({
        name: `${FieldConstants.RATIO_TAP_CHANGER}.${FieldConstants.ENABLED}`,
    });
    return (
        <Tabs
            value={tabIndex}
            variant="scrollable"
            onChange={(event: React.SyntheticEvent, newValue: number) => setTabIndex(newValue)}
            slotProps={{
                indicator: { sx: getTabIndicatorStyle(tabIndexesWithError, tabIndex) },
            }}
        >
            <Tab
                value={TwoWindingsTransformerDialogTab.CONNECTIVITY_TAB}
                label={<FormattedMessage id="ConnectivityTab" />}
                sx={getTabStyle(tabIndexesWithError, TwoWindingsTransformerDialogTab.CONNECTIVITY_TAB)}
            />
            <Tab
                value={TwoWindingsTransformerDialogTab.CHARACTERISTICS_TAB}
                label={<FormattedMessage id="CharacteristicsTab" />}
                sx={getTabStyle(tabIndexesWithError, TwoWindingsTransformerDialogTab.CHARACTERISTICS_TAB)}
            />
            <Tab
                value={TwoWindingsTransformerDialogTab.LIMITS_TAB}
                label={<FormattedMessage id="LimitsTab" />}
                sx={getTabStyle(tabIndexesWithError, TwoWindingsTransformerDialogTab.LIMITS_TAB)}
            />
            {isModification && (
                <Tab
                    value={TwoWindingsTransformerDialogTab.STATE_ESTIMATION_TAB}
                    label={<FormattedMessage id="StateEstimationTab" />}
                    sx={getTabStyle(tabIndexesWithError, TwoWindingsTransformerDialogTab.STATE_ESTIMATION_TAB)}
                />
            )}
            <Tab
                value={TwoWindingsTransformerDialogTab.RATIO_TAP_TAB}
                label={<FormattedMessage id="TwoWindingsTransformerRatioTapChangerTab" />}
                sx={getTabStyle(tabIndexesWithError, TwoWindingsTransformerDialogTab.RATIO_TAP_TAB)}
                disabled={!ratioTapChangerEnabledWatch}
            />
            <Tab
                value={TwoWindingsTransformerDialogTab.PHASE_TAP_TAB}
                label={<FormattedMessage id="TwoWindingsTransformerPhaseTapChangerTab" />}
                sx={getTabStyle(tabIndexesWithError, TwoWindingsTransformerDialogTab.PHASE_TAP_TAB)}
                disabled={!phaseTapChangerEnabledWatch}
            />
        </Tabs>
    );
}
