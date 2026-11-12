/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LccHvdcLineFormInfos } from './lccHvdcLine.types';

import { FieldConstants } from '../../../../../utils';
import { copyEquipmentPropertiesForCreation, emptyProperties } from '../../../common';

export enum LccHvdcLineDialogTab {
    HVDC_LINE_TAB = 0,
    CONVERTER_STATION_1_TAB = 1,
    CONVERTER_STATION_2_TAB = 2,
}

export const HVDC_LCC_LINE_TAB_FIELDS: Readonly<Partial<Record<LccHvdcLineDialogTab, FieldConstants[]>>> = {
    [LccHvdcLineDialogTab.HVDC_LINE_TAB]: [FieldConstants.HVDC_LINE_TAB, FieldConstants.ADDITIONAL_PROPERTIES],
    [LccHvdcLineDialogTab.CONVERTER_STATION_1_TAB]: [FieldConstants.CONVERTER_STATION_1],
    [LccHvdcLineDialogTab.CONVERTER_STATION_2_TAB]: [FieldConstants.CONVERTER_STATION_2],
};

export const getEmptyShuntCompensatorOnSideFormData = () => ({
    [FieldConstants.SHUNT_COMPENSATOR_ID]: null,
    [FieldConstants.SHUNT_COMPENSATOR_NAME]: '',
    [FieldConstants.MAX_Q_AT_NOMINAL_V]: null,
    [FieldConstants.SHUNT_COMPENSATOR_SELECTED]: true,
});

export function getLccHvdcLineEmptyFormData() {
    return {
        [FieldConstants.NOMINAL_V]: null,
        [FieldConstants.R]: null,
        [FieldConstants.MAX_P]: null,
        [FieldConstants.CONVERTERS_MODE]: null,
        [FieldConstants.ACTIVE_POWER_SET_POINT]: null,
        ...emptyProperties,
    };
}

export function getLccHvdcLineFromSearchCopy(hvdcLine: LccHvdcLineFormInfos) {
    return {
        [FieldConstants.NOMINAL_V]: hvdcLine.nominalV,
        [FieldConstants.R]: hvdcLine.r,
        [FieldConstants.MAX_P]: hvdcLine.maxP,
        [FieldConstants.CONVERTERS_MODE]: hvdcLine.convertersMode,
        [FieldConstants.ACTIVE_POWER_SET_POINT]: hvdcLine.activePowerSetpoint,
        ...copyEquipmentPropertiesForCreation(hvdcLine),
    };
}
