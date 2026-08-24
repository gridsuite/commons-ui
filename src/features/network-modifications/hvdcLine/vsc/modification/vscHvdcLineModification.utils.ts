/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import {
    DeepNullable,
    FieldConstants,
    ModificationType,
    sanitizeString,
    toModificationOperation,
} from '../../../../../utils';
import {
    getFilledPropertiesFromModification,
    modificationPropertiesSchema,
    toModificationProperties,
} from '../../../common/properties/';
import {
    getVscHvdcLineCharacteristicsEmptyFormData,
    getVscHvdcLineCharacteristicsModificationDtoToForm,
    getVscHvdcLineCharacteristicsModificationSchema,
} from '../common/characteristics/vscHvdcLineCharacteristicsPane.utils';
import {
    converterStationModificationDtoToForm,
    converterStationModificationFormToDto,
    getVscConverterStationEmptyFormData,
    getVscConverterStationModificationSchema,
} from '../common/converterStation/vscConverterStationPane.utils';
import { VscHdvLineModificationDto } from './vscHvdcLineModification.types';

export const vscHvdcLineModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.HVDC_LINE]: getVscHvdcLineCharacteristicsModificationSchema(),
        [FieldConstants.CONVERTER_STATION_1]: getVscConverterStationModificationSchema(),
        [FieldConstants.CONVERTER_STATION_2]: getVscConverterStationModificationSchema(),
    })
    .concat(modificationPropertiesSchema)
    .required();

export type VscHvdcLineModificationFormData = InferType<typeof vscHvdcLineModificationFormSchema>;

export const vscHvdcLineModificationEmptyFormData: DeepNullable<VscHvdcLineModificationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: null,
    [FieldConstants.EQUIPMENT_NAME]: null,
    [FieldConstants.HVDC_LINE]: getVscHvdcLineCharacteristicsEmptyFormData(true),
    [FieldConstants.CONVERTER_STATION_1]: getVscConverterStationEmptyFormData(true),
    [FieldConstants.CONVERTER_STATION_2]: getVscConverterStationEmptyFormData(true),
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

export const vscHvdcLineModificationDtoToForm = (
    lineDto: VscHdvLineModificationDto
): VscHvdcLineModificationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: lineDto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: lineDto.equipmentName?.value,
        [FieldConstants.HVDC_LINE]: getVscHvdcLineCharacteristicsModificationDtoToForm(lineDto),
        [FieldConstants.CONVERTER_STATION_1]: converterStationModificationDtoToForm(lineDto.converterStation1),
        [FieldConstants.CONVERTER_STATION_2]: converterStationModificationDtoToForm(lineDto.converterStation2),
        [FieldConstants.ADDITIONAL_PROPERTIES]: getFilledPropertiesFromModification(lineDto.properties),
    };
};

export const vscHvdcLineModificationFormToDto = (
    lineForm: VscHvdcLineModificationFormData
): VscHdvLineModificationDto => {
    return {
        type: ModificationType.VSC_MODIFICATION,
        equipmentId: lineForm.equipmentID,
        equipmentName: toModificationOperation(sanitizeString(lineForm.equipmentName)),
        properties: toModificationProperties(lineForm),
        nominalV: toModificationOperation(lineForm.hvdcLine.nominalV),
        r: toModificationOperation(lineForm.hvdcLine.r),
        maxP: toModificationOperation(lineForm.hvdcLine.maxP),
        operatorActivePowerLimitFromSide1ToSide2: toModificationOperation(
            lineForm.hvdcLine.operatorActivePowerLimitSide1
        ),
        operatorActivePowerLimitFromSide2ToSide1: toModificationOperation(
            lineForm.hvdcLine.operatorActivePowerLimitSide1
        ),
        convertersMode: toModificationOperation(lineForm.hvdcLine.convertersMode),
        activePowerSetpoint: toModificationOperation(lineForm.hvdcLine.activePowerSetpoint),
        angleDroopActivePowerControl: toModificationOperation(lineForm.hvdcLine.angleDroopActivePowerControl),
        p0: toModificationOperation(lineForm.hvdcLine.p0),
        droop: toModificationOperation(lineForm.hvdcLine.droop),
        converterStation1: converterStationModificationFormToDto(lineForm.converterStation1),
        converterStation2: converterStationModificationFormToDto(lineForm.converterStation1),
    };
};
