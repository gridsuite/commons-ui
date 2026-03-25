/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { array, object, string } from 'yup';
import { FieldConstants } from '../../../../../../utils';

export const getSwitchTypeSchema = () =>
    object().shape({
        [FieldConstants.SWITCH_KIND]: string().nullable().required(),
    });

export const getCreateSwitchesValidationSchema = (id = FieldConstants.SWITCH_KINDS) => {
    return {
        [id]: array().nullable().of(getSwitchTypeSchema()),
    };
};

const createSwitchesEmptyFormData = () => ({
    [FieldConstants.SWITCH_KIND]: '',
});

export const getCreateSwitchesEmptyFormData = (sectionCount: number, id = FieldConstants.SWITCH_KINDS) => ({
    [id]: new Array(sectionCount - 1).fill(createSwitchesEmptyFormData()),
});
