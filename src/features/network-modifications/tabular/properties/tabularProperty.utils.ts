/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as yup from 'yup';
import { DUPLICATED_PROPS_ERROR, FieldConstants } from '../../../../utils';
import { TabularFieldConstants } from '../tabular.constants';

export type TabularProperty = {
    [FieldConstants.NAME]: string;
    [TabularFieldConstants.PREDEFINED]: boolean;
    [FieldConstants.SELECTED]: boolean;
};

export type TabularProperties = {
    [TabularFieldConstants.TABULAR_PROPERTIES]?: TabularProperty[];
};

export const emptyTabularProperties: TabularProperties = {
    [TabularFieldConstants.TABULAR_PROPERTIES]: [] as TabularProperty[],
};

export const buildPredefinedTabularProperties = (names: string[]) => {
    const properties: TabularProperty[] = names.map((name) => ({
        [FieldConstants.NAME]: name,
        [TabularFieldConstants.PREDEFINED]: true,
        [FieldConstants.SELECTED]: false,
    }));
    return {
        [TabularFieldConstants.TABULAR_PROPERTIES]: properties,
    };
};

export const initializedTabularProperty = (): TabularProperty => {
    return {
        [FieldConstants.NAME]: '',
        [TabularFieldConstants.PREDEFINED]: false,
        [FieldConstants.SELECTED]: true,
    };
};

const checkUniquePropertyNames = (properties: { name: string }[] | undefined) => {
    if (properties === undefined) {
        return true;
    }
    const validValues = properties.filter((v) => v.name);
    return validValues.length === new Set(validValues.map((v) => v.name)).size;
};

export const tabularPropertiesSchema = yup.object({
    [TabularFieldConstants.TABULAR_PROPERTIES]: yup
        .array()
        .of(
            yup.object().shape({
                [FieldConstants.NAME]: yup.string().required(),
                [TabularFieldConstants.PREDEFINED]: yup.boolean().required(),
                [FieldConstants.SELECTED]: yup.boolean().required(),
            })
        )
        .test('checkUniqueProperties', DUPLICATED_PROPS_ERROR, (values) => checkUniquePropertyNames(values)),
});

export type TabularPropertiesFormType = yup.InferType<typeof tabularPropertiesSchema>;
