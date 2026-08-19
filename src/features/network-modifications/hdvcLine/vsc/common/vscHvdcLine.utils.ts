/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldConstants } from '../../../../../utils';

export const enum VscHvdcLineDialogTab {
    HVDC_LINE_TAB = 0,
    CONVERTER_STATION_1_TAB = 1,
    CONVERTER_STATION_2_TAB = 2,
    STATE_ESTIMATION_TAB = 3,
}

export const LINE_TAB_FIELDS: Readonly<Partial<Record<VscHvdcLineDialogTab, FieldConstants[]>>> = {
    [VscHvdcLineDialogTab.HVDC_LINE_TAB]: [FieldConstants.HVDC_LINE, FieldConstants.ADDITIONAL_PROPERTIES],
    [VscHvdcLineDialogTab.CONVERTER_STATION_1_TAB]: [FieldConstants.CONVERTER_STATION_1],
    [VscHvdcLineDialogTab.CONVERTER_STATION_2_TAB]: [FieldConstants.CONVERTER_STATION_2],
    [VscHvdcLineDialogTab.STATE_ESTIMATION_TAB]: [FieldConstants.STATE_ESTIMATION],
};
