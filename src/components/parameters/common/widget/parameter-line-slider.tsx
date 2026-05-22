/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import type { Mark } from '@mui/material/Slider/useSlider.types'; // eslint-disable-line no-restricted-imports
import { parametersStyles } from '../../parameters-style';
import { SliderInput } from '../../../inputs';
import type { MuiStyles } from '../../../../utils/styles';

export function sanitizePercentageValue(value: number) {
    return Math.round(value * 10) / 10;
}

type SliderParameterLineProps = {
    name: string;
    disabled?: boolean;
    label: string;
    marks: boolean | Mark[];
    minValue?: number; // default = 0;
    maxValue?: number; // default = 100;
};

const styles = {
    container: {
        ...parametersStyles.controlItem,
        paddingTop: 3,
        paddingRight: 3,
    },
} as const satisfies MuiStyles;

export function ParameterLineSlider({
    name,
    label,
    marks,
    disabled = false,
    minValue = 0,
    maxValue = 100,
}: Readonly<SliderParameterLineProps>) {
    return (
        <Grid container sx={styles.container}>
            <Grid item xs={8} sx={parametersStyles.parameterName}>
                <FormattedMessage id={label} />
            </Grid>
            <Grid item xs={4}>
                <SliderInput
                    name={name}
                    min={minValue}
                    max={maxValue}
                    valueLabelDisplay="auto"
                    step={0.01}
                    size="medium"
                    disabled={disabled ?? false}
                    marks={marks}
                    valueLabelFormat={(value) => sanitizePercentageValue(value * 100)}
                />
            </Grid>
        </Grid>
    );
}
