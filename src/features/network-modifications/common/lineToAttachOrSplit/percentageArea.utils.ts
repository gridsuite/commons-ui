/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { FieldConstants, Input, OUT_OF_BOUNDS_PERCENTAGE } from '../../../../utils';

const percentageAreaValidationSchema = () => ({
    [FieldConstants.SLIDER_PERCENTAGE]: yup.number(),
    [FieldConstants.LEFT_SIDE_PERCENTAGE]: yup
        .number()
        .min(0.1, OUT_OF_BOUNDS_PERCENTAGE)
        .max(99.9, OUT_OF_BOUNDS_PERCENTAGE),
    [FieldConstants.RIGHT_SIDE_PERCENTAGE]: yup
        .number()
        .min(0.1, OUT_OF_BOUNDS_PERCENTAGE)
        .max(99.9, OUT_OF_BOUNDS_PERCENTAGE),
});
export const getPercentageAreaValidationSchema = () => {
    return percentageAreaValidationSchema();
};

const percentageAreaEmptyFormData = () => ({
    [FieldConstants.SLIDER_PERCENTAGE]: 50,
    [FieldConstants.LEFT_SIDE_PERCENTAGE]: 50,
    [FieldConstants.RIGHT_SIDE_PERCENTAGE]: 50,
});

export const getPercentageAreaEmptyFormData = () => {
    return percentageAreaEmptyFormData();
};

// used to format subtraction of two percentages (avoid having more than one decimal)
export function sanitizeSplitPercentageValue(value: number) {
    return Math.round(value * 10) / 10;
}

export const getPercentageAreaData = ({ percent }: { percent: number }) => {
    return {
        [FieldConstants.SLIDER_PERCENTAGE]: percent,
        [FieldConstants.LEFT_SIDE_PERCENTAGE]: percent,
        [FieldConstants.RIGHT_SIDE_PERCENTAGE]: sanitizeSplitPercentageValue(100 - percent),
    };
};

export const isValidPercentage = (val: string) => {
    return /^\d*[.,]?\d?$/.test(val);
};

export function formatPercentageValue(value: string): Input {
    // @ts-ignore
    if (!value || value < 0) {
        return 0;
    }
    // @ts-ignore
    if (value > 100) {
        return 100;
    }
    const tmp = value?.replace(',', '.');
    if (tmp.endsWith('.')) {
        return tmp;
    }
    return Number.parseFloat(value);
}
