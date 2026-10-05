/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Input, FieldConstants, PercentageAdornment } from '../../../../utils';
import { SliderInput, TextInput } from '../../../../components/ui';
import { standardTextField } from '../form.utils';
import { formatPercentageValue, isValidPercentage, sanitizeSplitPercentageValue } from './percentageArea.utils';

/**
 * Component to handle a 'percentage area' (slider , left and right percentage fields)
 * @param upperLeftText text to diplays on the top left of the slider
 * @param upperRightText text to diplays on the top right of the slider
 */

export interface PercentageAreaProps {
    upperLeftText: string;
    upperRightText: string;
}
export function PercentageArea({ upperLeftText, upperRightText }: Readonly<PercentageAreaProps>) {
    const { setValue } = useFormContext();

    const handleLeftPercentageValueChange = (value: string): Input => {
        const leftPercentageValue = formatPercentageValue(value);
        const rightPercentageValue = sanitizeSplitPercentageValue(100 - +leftPercentageValue);
        setValue(FieldConstants.SLIDER_PERCENTAGE, +leftPercentageValue);
        setValue(FieldConstants.LEFT_SIDE_PERCENTAGE, leftPercentageValue, {
            shouldValidate: true,
        });
        setValue(FieldConstants.RIGHT_SIDE_PERCENTAGE, rightPercentageValue, {
            shouldValidate: true,
        });
        return leftPercentageValue;
    };

    const handleRightPercentageValueChange = (value: string): Input => {
        const rightPercentageValue = formatPercentageValue(value);
        const leftPercentageValue = sanitizeSplitPercentageValue(100 - +rightPercentageValue);
        setValue(FieldConstants.SLIDER_PERCENTAGE, leftPercentageValue);
        setValue(FieldConstants.LEFT_SIDE_PERCENTAGE, leftPercentageValue, {
            shouldValidate: true,
        });
        setValue(FieldConstants.RIGHT_SIDE_PERCENTAGE, rightPercentageValue, {
            shouldValidate: true,
        });
        return rightPercentageValue;
    };

    const onSliderChange = (value: number | number[]) => {
        if (typeof value === 'number') {
            const rightPercentageValue = sanitizeSplitPercentageValue(100 - value);
            setValue(FieldConstants.RIGHT_SIDE_PERCENTAGE, rightPercentageValue, {
                shouldValidate: true,
            });
            setValue(FieldConstants.LEFT_SIDE_PERCENTAGE, value, { shouldValidate: true });
        }
    };

    const leftSidePercentageField = (
        <TextInput
            name={FieldConstants.LEFT_SIDE_PERCENTAGE}
            adornment={PercentageAdornment}
            acceptValue={isValidPercentage}
            outputTransform={handleLeftPercentageValueChange}
            formProps={standardTextField}
            dataTestId="Line1PercentageInput"
        />
    );

    const rightSidePercentageField = (
        <TextInput
            name={FieldConstants.RIGHT_SIDE_PERCENTAGE}
            adornment={PercentageAdornment}
            acceptValue={isValidPercentage}
            outputTransform={handleRightPercentageValueChange}
            formProps={standardTextField}
            dataTestId="Line2PercentageInput"
        />
    );

    const slider = (
        <SliderInput
            name={FieldConstants.SLIDER_PERCENTAGE}
            min={0.0}
            max={100.0}
            step={0.1}
            onValueChanged={onSliderChange}
        />
    );
    return (
        <Grid container>
            <Grid
                container
                size={12}
                spacing={2}
                sx={{
                    justifyContent: 'space-between',
                }}
            >
                {upperLeftText && (
                    <Grid>
                        <Typography>
                            <FormattedMessage id={upperLeftText} />
                        </Typography>
                    </Grid>
                )}
                {upperRightText && (
                    <Grid sx={{ ml: 'auto' }}>
                        <Typography>
                            <FormattedMessage id={upperRightText} />
                        </Typography>
                    </Grid>
                )}
            </Grid>
            {slider}
            <Grid
                container
                size={12}
                spacing={2}
                sx={{
                    justifyContent: 'space-between',
                }}
            >
                <Grid size={3}>{leftSidePercentageField}</Grid>
                <Grid size={3}>{rightSidePercentageField}</Grid>
            </Grid>
        </Grid>
    );
}
