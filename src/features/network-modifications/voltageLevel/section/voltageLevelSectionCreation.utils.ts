/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { DeepNullable, FieldConstants, ModificationType } from '../../../../utils';
import {
    BusBarSections,
    CreateVoltageLevelSectionDialogSchemaForm,
    CreateVoltageLevelSectionInfos,
    POSITION_NEW_SECTION_SIDE,
} from './voltageLevelSectionCreation.types';

const getBusBarIndexValue = ({ busbarIndex, allBusbars }: { busbarIndex: string | null; allBusbars: boolean }) => {
    if (!busbarIndex) {
        return null;
    }
    if (allBusbars) {
        return {
            [FieldConstants.ID]: 'all',
        };
    }
    return {
        [FieldConstants.ID]: busbarIndex,
    };
};

const getBusBarSectionValue = ({ busbarSectionId }: { busbarSectionId: string | null }) => {
    if (!busbarSectionId) {
        return null;
    }
    return {
        [FieldConstants.ID]: busbarSectionId,
    };
};

export const createVoltageLevelSectionEmptyFormData: DeepNullable<CreateVoltageLevelSectionDialogSchemaForm> = {
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

export const createVoltageLevelSectionFormSchema = yup
    .object()
    .shape({
        [FieldConstants.BUS_BAR_INDEX]: yup
            .object()
            .nullable()
            .required()
            .shape({
                [FieldConstants.ID]: yup.string().nullable().required(),
            }),
        [FieldConstants.BUSBAR_SECTION_ID]: yup
            .object()
            .nullable()
            .required()
            .shape({
                [FieldConstants.ID]: yup.string().nullable().required(),
            }),
        [FieldConstants.IS_AFTER_BUSBAR_SECTION_ID]: yup.string().nullable().required(),
        [FieldConstants.SWITCHES_BEFORE_SECTIONS]: yup
            .string()
            .nullable()
            .when([FieldConstants.IS_AFTER_BUSBAR_SECTION_ID, FieldConstants.SWITCH_BEFORE_NOT_REQUIRED], {
                is: (isAfterBusBarSectionId: string, switchBeforeNotRequired: boolean) =>
                    isAfterBusBarSectionId === POSITION_NEW_SECTION_SIDE.BEFORE.id && switchBeforeNotRequired,
                then: (schema) => schema.notRequired(),
                otherwise: (schema) => schema.required(),
            }),
        [FieldConstants.SWITCHES_AFTER_SECTIONS]: yup
            .string()
            .nullable()
            .when([FieldConstants.IS_AFTER_BUSBAR_SECTION_ID, FieldConstants.SWITCH_AFTER_NOT_REQUIRED], {
                is: (isAfterBusBarSectionId: string, switchAfterNotRequired: boolean) =>
                    isAfterBusBarSectionId === POSITION_NEW_SECTION_SIDE.AFTER.id && switchAfterNotRequired,
                then: (schema) => schema.notRequired(),
                otherwise: (schema) => schema.required(),
            }),
        [FieldConstants.ALL_BUS_BAR_SECTIONS]: yup.boolean(),
        [FieldConstants.NEW_SWITCH_STATES]: yup.boolean(),
        [FieldConstants.SWITCH_BEFORE_NOT_REQUIRED]: yup.boolean(),
        [FieldConstants.SWITCH_AFTER_NOT_REQUIRED]: yup.boolean(),
    })
    .required();

export const createVoltageLevelSectionDtoToForm = (
    editData?: CreateVoltageLevelSectionInfos
): DeepNullable<CreateVoltageLevelSectionDialogSchemaForm> => ({
    [FieldConstants.BUS_BAR_INDEX]:
        getBusBarIndexValue({
            busbarIndex: editData?.busbarIndex ?? null,
            allBusbars: editData?.allBusbars ?? false,
        }) ?? null,
    [FieldConstants.ALL_BUS_BAR_SECTIONS]: editData?.allBusbars ?? false,
    [FieldConstants.BUSBAR_SECTION_ID]:
        getBusBarSectionValue({ busbarSectionId: editData?.busbarSectionId ?? null }) ?? null,
    [FieldConstants.IS_AFTER_BUSBAR_SECTION_ID]: editData?.afterBusbarSectionId
        ? POSITION_NEW_SECTION_SIDE.AFTER.id
        : POSITION_NEW_SECTION_SIDE.BEFORE.id,
    [FieldConstants.SWITCHES_BEFORE_SECTIONS]: editData?.leftSwitchKind ?? null,
    [FieldConstants.SWITCHES_AFTER_SECTIONS]: editData?.rightSwitchKind ?? null,
    [FieldConstants.NEW_SWITCH_STATES]: !(editData?.switchOpen ?? true),
});

const findBusbarKeyForSection = (busBarSectionInfos: BusBarSections | undefined, sectionId?: string | null) => {
    if (!sectionId) {
        return null;
    }
    return Object.keys(busBarSectionInfos || {}).find((key) => busBarSectionInfos?.[key]?.includes(sectionId)) || null;
};

export const createVoltageLevelSectionFormToDto = (
    voltageLevelSection: CreateVoltageLevelSectionDialogSchemaForm,
    voltageLevelId: string,
    busBarSectionInfos?: BusBarSections
): CreateVoltageLevelSectionInfos =>
    ({
        type: ModificationType.CREATE_VOLTAGE_LEVEL_SECTION,
        voltageLevelId: voltageLevelId,
        busbarIndex: voltageLevelSection?.allBusbarSections
            ? findBusbarKeyForSection(busBarSectionInfos, voltageLevelSection?.busbarSectionId?.id)
            : voltageLevelSection?.busbarIndex?.id || null,
        busbarSectionId: voltageLevelSection?.busbarSectionId?.id || null,
        allBusbars: voltageLevelSection?.allBusbarSections || false,
        afterBusbarSectionId: voltageLevelSection?.isAfterBusBarSectionId === POSITION_NEW_SECTION_SIDE.AFTER.id,
        leftSwitchKind: voltageLevelSection?.switchesBeforeSections || null,
        rightSwitchKind: voltageLevelSection?.switchesAfterSections || null,
        switchOpen: !voltageLevelSection?.newSwitchStates,
    }) satisfies CreateVoltageLevelSectionInfos;
