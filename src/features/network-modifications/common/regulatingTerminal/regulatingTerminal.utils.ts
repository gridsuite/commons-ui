/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../../../../utils';

const regulatingTerminalEmptyFormData = () => ({
    [FieldConstants.VOLTAGE_LEVEL]: null,
    [FieldConstants.EQUIPMENT]: null,
});

export const getRegulatingTerminalEmptyFormData = () => regulatingTerminalEmptyFormData();

export const getRegulatingTerminalVoltageLevelData = ({
    voltageLevelId,
    voltageLevelName = '',
    voltageLevelSubstationId = '',
    voltageLevelNominalVoltage = '',
    voltageLevelTopologyKind = '',
}: {
    voltageLevelId?: string | null;
    voltageLevelName?: string;
    voltageLevelSubstationId?: string;
    voltageLevelNominalVoltage?: string;
    voltageLevelTopologyKind?: string;
}) => {
    if (!voltageLevelId) {
        return null;
    }

    return {
        [FieldConstants.ID]: voltageLevelId,
        [FieldConstants.NAME]: voltageLevelName,
        [FieldConstants.SUBSTATION_ID]: voltageLevelSubstationId,
        [FieldConstants.NOMINAL_VOLTAGE]: voltageLevelNominalVoltage,
        [FieldConstants.TOPOLOGY_KIND]: voltageLevelTopologyKind,
    };
};

export const getRegulatingTerminalEquipmentData = ({
    equipmentId,
    equipmentName = '',
    equipmentType = '',
}: {
    equipmentId?: string | null;
    equipmentName?: string | null;
    equipmentType?: string | null;
}) => {
    if (!equipmentId) {
        return null;
    }

    return {
        [FieldConstants.ID]: equipmentId,
        [FieldConstants.NAME]: equipmentName,
        [FieldConstants.TYPE]: equipmentType,
    };
};

export const getRegulatingTerminalFormData = ({
    voltageLevelId = null,
    voltageLevelName,
    voltageLevelNominalVoltage,
    voltageLevelSubstationId,
    voltageLevelTopologyKind,
    equipmentId = null,
    equipmentName,
    equipmentType,
}: {
    voltageLevelId?: string | null;
    voltageLevelName?: string;
    voltageLevelSubstationId?: string;
    voltageLevelNominalVoltage?: string;
    voltageLevelTopologyKind?: string;
    equipmentId?: string | null;
    equipmentName?: string | null;
    equipmentType?: string | null;
}) => ({
    [FieldConstants.VOLTAGE_LEVEL]: getRegulatingTerminalVoltageLevelData({
        voltageLevelId,
        voltageLevelName,
        voltageLevelNominalVoltage,
        voltageLevelSubstationId,
        voltageLevelTopologyKind,
    }),
    [FieldConstants.EQUIPMENT]: getRegulatingTerminalEquipmentData({
        equipmentId,
        equipmentName,
        equipmentType,
    }),
});
