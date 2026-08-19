/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import { VscHdvLineCreationDto } from './vscHvdcLineCreation.types';
import { DeepNullable, FieldConstants, ModificationType, sanitizeString } from '../../../../../utils';
import {
    creationPropertiesSchema,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../../common/properties';
import {
    converterStationCreationDtoToForm,
    converterStationCreationFormToDto,
    getVscConverterStationCreationSchema,
    getVscConverterStationEmptyFormData,
    getVscHvdcLineCharacteristicsCreationSchema,
    getVscHvdcLineCharacteristicsDtoToForm,
    getVscHvdcLineCharacteristicsEmptyFormData,
} from '../common';

export const vscHvdcLineCreationFormSchema = () =>
    object()
        .shape({
            [FieldConstants.EQUIPMENT_ID]: string().required(),
            [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
            [FieldConstants.HVDC_LINE]: getVscHvdcLineCharacteristicsCreationSchema(),
            [FieldConstants.CONVERTER_STATION_1]: getVscConverterStationCreationSchema(),
            [FieldConstants.CONVERTER_STATION_2]: getVscConverterStationCreationSchema(),
        })
        .concat(creationPropertiesSchema)
        .required();

export type VscHvdcLineCreationFormData = InferType<ReturnType<typeof vscHvdcLineCreationFormSchema>>;

export const vscHvdcLineCreationEmptyFormData: DeepNullable<VscHvdcLineCreationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: null,
    [FieldConstants.EQUIPMENT_NAME]: null,
    [FieldConstants.HVDC_LINE]: getVscHvdcLineCharacteristicsEmptyFormData(false),
    [FieldConstants.CONVERTER_STATION_1]: getVscConverterStationEmptyFormData(false),
    [FieldConstants.CONVERTER_STATION_2]: getVscConverterStationEmptyFormData(false),
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

export const vscHvdcLineCreationDtoToForm = (lineDto: VscHdvLineCreationDto): VscHvdcLineCreationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: lineDto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: lineDto.equipmentName ?? '',
        [FieldConstants.HVDC_LINE]: getVscHvdcLineCharacteristicsDtoToForm(lineDto),
        [FieldConstants.CONVERTER_STATION_1]: converterStationCreationDtoToForm(lineDto.converterStation1),
        [FieldConstants.CONVERTER_STATION_2]: converterStationCreationDtoToForm(lineDto.converterStation2),
        [FieldConstants.ADDITIONAL_PROPERTIES]: getFilledPropertiesFromModification(lineDto.properties),
    };
};

export const vscHvdcLineCreationFormToDto = (lineForm: VscHvdcLineCreationFormData): VscHdvLineCreationDto => {
    return {
        type: ModificationType.VSC_CREATION,
        equipmentId: lineForm.equipmentID,
        equipmentName: sanitizeString(lineForm.equipmentName),
        properties: toModificationProperties(lineForm),
        nominalV: lineForm.hvdcLine.nominalV,
        r: lineForm.hvdcLine.r,
        maxP: lineForm.hvdcLine.maxP,
        operatorActivePowerLimitFromSide1ToSide2: lineForm.hvdcLine.operatorActivePowerLimitSide1 ?? null,
        operatorActivePowerLimitFromSide2ToSide1: lineForm.hvdcLine.operatorActivePowerLimitSide1 ?? null,
        convertersMode: lineForm.hvdcLine.convertersMode,
        activePowerSetpoint: lineForm.hvdcLine.activePowerSetpoint,
        angleDroopActivePowerControl: lineForm.hvdcLine.angleDroopActivePowerControl ?? null,
        p0: lineForm.hvdcLine.p0 ?? null,
        droop: lineForm.hvdcLine.droop ?? null,
        converterStation1: converterStationCreationFormToDto(lineForm.converterStation1),
        converterStation2: converterStationCreationFormToDto(lineForm.converterStation1),
    };
};
