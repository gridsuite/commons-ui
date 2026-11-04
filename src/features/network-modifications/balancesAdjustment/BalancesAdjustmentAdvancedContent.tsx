/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, Stack } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { FieldConstants } from '../../../utils';
import { FloatInput, IntegerInput, SelectInput, SwitchInput } from '../../../components/ui';
import { GridSection } from '../../../components/composite/grid/grid-section';
import { balancesAdjustmentStyles } from './balancesAdjustment.styles';
import { CountriesAutocomplete } from './CountriesAutocomplete';

const BALANCE_TYPE_OPTIONS = [
    { id: 'PROPORTIONAL_TO_GENERATION_P', label: 'descLfBalanceTypeGenP' },
    { id: 'PROPORTIONAL_TO_GENERATION_P_MAX', label: 'descLfBalanceTypeGenPMax' },
    { id: 'PROPORTIONAL_TO_LOAD', label: 'descLfBalanceTypeLoad' },
    { id: 'PROPORTIONAL_TO_CONFORM_LOAD', label: 'descLfBalanceTypeConformLoad' },
];

export interface BalancesAdjustmentAdvancedContentProps {
    countryCodes: string[];
    translate: (countryCode: string) => string;
}

export function BalancesAdjustmentAdvancedContent({
    countryCodes,
    translate,
}: Readonly<BalancesAdjustmentAdvancedContentProps>) {
    const intl = useIntl();

    const withLoadFlow = useWatch({
        name: `${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ADVANCED}.${FieldConstants.BALANCES_ADJUSTMENT_WITH_LOAD_FLOW}`,
    });

    return (
        <Stack
            sx={{
                minWidth: '300px',
                width: '66%',
            }}
        >
            <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid>
                    <GridSection title="Loadflow" />
                </Grid>
                <Grid>
                    <SwitchInput
                        name={`${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ADVANCED}.${FieldConstants.BALANCES_ADJUSTMENT_WITH_LOAD_FLOW}`}
                        dataTestId="LoadFlowControlButton"
                    />
                </Grid>
            </Grid>

            <Stack spacing={2}>
                <Box sx={{ width: '100%' }}>
                    <CountriesAutocomplete
                        name={`${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ADVANCED}.${FieldConstants.BALANCES_ADJUSTMENT_COUNTRIES_TO_BALANCE}`}
                        limitTags={3}
                        label={intl.formatMessage({ id: 'descLfCountriesToBalance' })}
                        disabled={!withLoadFlow}
                        dataTestId="BalancingCountriesInput"
                        countryCodes={countryCodes}
                        translate={translate}
                    />
                </Box>
                <Box sx={{ width: '100%' }}>
                    <SelectInput
                        name={`${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ADVANCED}.${FieldConstants.BALANCES_ADJUSTMENT_BALANCE_TYPE}`}
                        label="descLfBalanceType"
                        options={BALANCE_TYPE_OPTIONS}
                        sx={balancesAdjustmentStyles.autocomplete}
                        disabled={!withLoadFlow}
                        disableClearable
                        dataTestId="BalanceTypeInput"
                    />
                </Box>
            </Stack>
            <Grid
                container
                sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: 1,
                    marginTop: 1,
                }}
            >
                <Grid>
                    <FormattedMessage id="LoadFlowWithRatioTapChangers" />
                </Grid>
                <Grid>
                    <SwitchInput
                        name={`${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ADVANCED}.${FieldConstants.BALANCES_ADJUSTMENT_WITH_RATIO_TAP_CHANGERS}`}
                        formProps={{ disabled: !withLoadFlow }}
                        dataTestId="LoadFlowRatioTapChangersControlButton"
                    />
                </Grid>
            </Grid>
            <GridSection title="Algorithm" />
            <Stack spacing={2}>
                <Box sx={{ width: '100%' }}>
                    <IntegerInput
                        name={`${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ADVANCED}.${FieldConstants.BALANCES_ADJUSTMENT_MAX_NUMBER_ITERATIONS}`}
                        label="maxNumberIterations"
                        formProps={{ disabled: !withLoadFlow }}
                        dataTestId="MaxNumberOfIterationsInput"
                    />
                </Box>
                <Box sx={{ width: '100%' }}>
                    <FloatInput
                        name={`${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ADVANCED}.${FieldConstants.BALANCES_ADJUSTMENT_THRESHOLD_NET_POSITION}`}
                        label="thresholdNetPosition"
                        formProps={{ disabled: !withLoadFlow }}
                        dataTestId="NetPositionMismatchThresholdInput"
                    />
                </Box>
                <Box sx={{ width: '100%' }}>
                    <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Grid>
                            <FormattedMessage id="subtractLoadFlowBalancing" />
                        </Grid>
                        <Grid>
                            <SwitchInput
                                name={`${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ADVANCED}.${FieldConstants.BALANCES_ADJUSTMENT_SUBTRACT_LOAD_FLOW_BALANCING}`}
                                formProps={{ disabled: !withLoadFlow }}
                                dataTestId="LoadFlowBalancingControlButton"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Stack>
        </Stack>
    );
}
