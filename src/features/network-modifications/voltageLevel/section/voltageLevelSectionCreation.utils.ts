/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { boolean, InferType, object, string } from 'yup';
import { DeepNullable, FieldConstants, ModificationType } from '../../../../utils';
import { BusBarSections, VoltageLevelSectionCreationDto } from './voltageLevelSectionCreation.types';

export const POSITION_NEW_SECTION_SIDE = {
    BEFORE: { id: 'BEFORE', label: 'Before' },
    AFTER: { id: 'AFTER', label: 'After' },
} as const;

export const voltageLevelSectionCreationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.BUS_BAR_INDEX]: object()
            .nullable()
            .required()
            .shape({
                [FieldConstants.ID]: string().nullable().required(),
            }),
        [FieldConstants.BUSBAR_SECTION_ID]: object()
            .nullable()
            .required()
            .shape({
                [FieldConstants.ID]: string().nullable().required(),
            }),
        [FieldConstants.IS_AFTER_BUSBAR_SECTION_ID]: string().nullable().required(),
        [FieldConstants.SWITCHES_BEFORE_SECTIONS]: string()
            .nullable()
            .when([FieldConstants.IS_AFTER_BUSBAR_SECTION_ID, FieldConstants.SWITCH_BEFORE_NOT_REQUIRED], {
                is: (isAfterBusBarSectionId: string, switchBeforeNotRequired: boolean) =>
                    isAfterBusBarSectionId === POSITION_NEW_SECTION_SIDE.BEFORE.id && switchBeforeNotRequired,
                then: (schema) => schema.notRequired(),
                otherwise: (schema) => schema.required(),
            }),
        [FieldConstants.SWITCHES_AFTER_SECTIONS]: string()
            .nullable()
            .when([FieldConstants.IS_AFTER_BUSBAR_SECTION_ID, FieldConstants.SWITCH_AFTER_NOT_REQUIRED], {
                is: (isAfterBusBarSectionId: string, switchAfterNotRequired: boolean) =>
                    isAfterBusBarSectionId === POSITION_NEW_SECTION_SIDE.AFTER.id && switchAfterNotRequired,
                then: (schema) => schema.notRequired(),
                otherwise: (schema) => schema.required(),
            }),
        [FieldConstants.ALL_BUS_BAR_SECTIONS]: boolean(),
        [FieldConstants.NEW_SWITCH_STATES]: boolean(),
        [FieldConstants.SWITCH_BEFORE_NOT_REQUIRED]: boolean(),
        [FieldConstants.SWITCH_AFTER_NOT_REQUIRED]: boolean(),
    })
    .required();

export type VoltageLevelSectionCreationFormData = InferType<typeof voltageLevelSectionCreationFormSchema>;

export const voltageLevelSectionCreationEmptyFormData: DeepNullable<VoltageLevelSectionCreationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.BUS_BAR_INDEX]: null,
    [FieldConstants.BUSBAR_SECTION_ID]: null,
    [FieldConstants.IS_AFTER_BUSBAR_SECTION_ID]: null,
    [FieldConstants.SWITCHES_BEFORE_SECTIONS]: null,
    [FieldConstants.SWITCHES_AFTER_SECTIONS]: null,
    [FieldConstants.ALL_BUS_BAR_SECTIONS]: false,
    [FieldConstants.NEW_SWITCH_STATES]: true,
    [FieldConstants.SWITCH_BEFORE_NOT_REQUIRED]: false,
    [FieldConstants.SWITCH_AFTER_NOT_REQUIRED]: false,
};

const getBusBarIndexValue = ({
    busbarIndex,
    allBusbars,
}: {
    busbarIndex: string | null;
    allBusbars: boolean;
}): { id: string } => {
    if (allBusbars) {
        return { id: 'all' };
    }
    return { id: busbarIndex ?? '' };
};

const getBusBarSectionValue = ({ busbarSectionId }: { busbarSectionId: string | null }): { id: string } => {
    return { id: busbarSectionId ?? '' };
};

const findBusbarKeyForSection = (
    busBarSectionInfos: BusBarSections | undefined,
    sectionId: string | null | undefined
): string | null => {
    if (!sectionId) {
        return null;
    }
    return Object.keys(busBarSectionInfos || {}).find((key) => busBarSectionInfos?.[key]?.includes(sectionId)) ?? null;
};

export const voltageLevelSectionCreationDtoToForm = (
    dto: VoltageLevelSectionCreationDto
): VoltageLevelSectionCreationFormData => {
    return {
        equipmentID: dto.voltageLevelId,
        busbarIndex: getBusBarIndexValue({
            busbarIndex: dto.busbarIndex,
            allBusbars: dto.allBusbars,
        }),
        allBusbarSections: dto.allBusbars ?? false,
        busbarSectionId: getBusBarSectionValue({ busbarSectionId: dto.busbarSectionId }),
        isAfterBusBarSectionId: dto.afterBusbarSectionId
            ? POSITION_NEW_SECTION_SIDE.AFTER.id
            : POSITION_NEW_SECTION_SIDE.BEFORE.id,
        switchesBeforeSections: dto.leftSwitchKind ?? null,
        switchesAfterSections: dto.rightSwitchKind ?? null,
        newSwitchStates: !(dto.switchOpen ?? true),
    };
};

export const voltageLevelSectionCreationFormToDto = (
    form: VoltageLevelSectionCreationFormData,
    busBarSectionInfos?: BusBarSections
): VoltageLevelSectionCreationDto => {
    return {
        type: ModificationType.CREATE_VOLTAGE_LEVEL_SECTION,
        voltageLevelId: form.equipmentID,
        busbarIndex: form.allBusbarSections
            ? findBusbarKeyForSection(busBarSectionInfos, form.busbarSectionId?.id)
            : (form.busbarIndex?.id ?? null),
        busbarSectionId: form.busbarSectionId?.id ?? null,
        allBusbars: form.allBusbarSections ?? false,
        afterBusbarSectionId: form.isAfterBusBarSectionId === POSITION_NEW_SECTION_SIDE.AFTER.id,
        leftSwitchKind: form.switchesBeforeSections ?? null,
        rightSwitchKind: form.switchesAfterSections ?? null,
        switchOpen: !form.newSwitchStates,
    };
};
