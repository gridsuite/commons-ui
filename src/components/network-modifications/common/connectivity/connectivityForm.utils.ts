/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { bool, number, object, string } from 'yup';
import { VoltageLevelFormInfos } from '../../voltage-level';
import { FieldConstants } from '../../../../utils';

const getVoltageLevelAndBusOrBusBarSectionFieldsSchema = (
    isEquipmentModification: boolean,
    relatedFieldName: string
) => {
    return object()
        .nullable()
        .when({
            is: () => !isEquipmentModification,
            then: (schema) => schema.required(),
        })
        .shape({
            [FieldConstants.ID]: string().when([], {
                is: () => isEquipmentModification,
                then: (schema) => schema.nullable(),
            }),
        })
        .test('YupRequired', 'YupRequired', (value, context) => {
            const isEmpty =
                value?.[FieldConstants.ID] === null ||
                value?.[FieldConstants.ID] === undefined ||
                value?.[FieldConstants.ID] === '';
            const isEmptyRelatedField =
                context.parent?.[relatedFieldName] === null ||
                context.parent?.[relatedFieldName]?.[FieldConstants.ID] === '' ||
                context.parent?.[relatedFieldName]?.[FieldConstants.ID] === undefined;
            return !(isEmpty && !isEmptyRelatedField);
        });
};

export const getConnectivityPropertiesValidationSchema = (isEquipmentModification = false) => {
    return {
        [FieldConstants.VOLTAGE_LEVEL]: getVoltageLevelAndBusOrBusBarSectionFieldsSchema(
            isEquipmentModification,
            FieldConstants.BUS_OR_BUSBAR_SECTION
        ),
        [FieldConstants.BUS_OR_BUSBAR_SECTION]: getVoltageLevelAndBusOrBusBarSectionFieldsSchema(
            isEquipmentModification,
            FieldConstants.VOLTAGE_LEVEL
        ),
    };
};

export const getCon1andCon2WithPositionValidationSchema = (
    isEquipmentModification = false,
    id = FieldConstants.CONNECTIVITY
) => ({
    [id]: object().shape({
        ...getConnectivityWithPositionValidationSchema(isEquipmentModification, FieldConstants.CONNECTIVITY_1),
        ...getConnectivityWithPositionValidationSchema(isEquipmentModification, FieldConstants.CONNECTIVITY_2),
    }),
});

export const getConnectivityWithPositionSchema = (isEquipmentModification = false) =>
    object().shape({
        [FieldConstants.CONNECTION_DIRECTION]: string().nullable(),
        [FieldConstants.CONNECTION_NAME]: string(),
        [FieldConstants.CONNECTION_POSITION]: number().nullable(),
        [FieldConstants.CONNECTED]: bool()
            .nullable()
            .when([], {
                is: () => !isEquipmentModification,
                then: (schema) => schema.required(),
            }),
        ...getConnectivityPropertiesValidationSchema(isEquipmentModification),
    });

export const getConnectivityWithPositionValidationSchema = (
    isEquipmentModification = false,
    id = FieldConstants.CONNECTIVITY
) => ({
    [id]: getConnectivityWithPositionSchema(isEquipmentModification),
});

export const getConnectivityWithoutPositionValidationSchema = (id = FieldConstants.CONNECTIVITY) => {
    return {
        [id]: object().shape(getConnectivityPropertiesValidationSchema()),
    };
};

export const getConnectivityPropertiesEmptyFormData = (isEquipmentModification = false) => {
    return {
        [FieldConstants.VOLTAGE_LEVEL]: null,
        [FieldConstants.BUS_OR_BUSBAR_SECTION]: null,
        [FieldConstants.CONNECTED]: isEquipmentModification ? null : true,
    };
};

export const getCont1Cont2WithPositionEmptyFormData = (
    isEquipmentModification = false,
    id = FieldConstants.CONNECTIVITY
) => ({
    [id]: {
        ...getConnectivityWithPositionEmptyFormData(isEquipmentModification, FieldConstants.CONNECTIVITY_1),
        ...getConnectivityWithPositionEmptyFormData(isEquipmentModification, FieldConstants.CONNECTIVITY_2),
    },
});

export const getConnectivityWithPositionEmptyFormData = (
    isEquipmentModification = false,
    id = FieldConstants.CONNECTIVITY
) => ({
    [id]: {
        ...getConnectivityPropertiesEmptyFormData(isEquipmentModification),
        [FieldConstants.CONNECTION_DIRECTION]: null,
        [FieldConstants.CONNECTION_NAME]: '',
        [FieldConstants.CONNECTION_POSITION]: null,
    },
});

export const getConnectivityWithoutPositionEmptyFormData = (id = FieldConstants.CONNECTIVITY) => ({
    [id]: getConnectivityPropertiesEmptyFormData(),
});

export const getConnectivityVoltageLevelData = ({ voltageLevelId }: { voltageLevelId?: string | null }) => {
    if (!voltageLevelId) {
        return null;
    }

    return {
        [FieldConstants.ID]: voltageLevelId,
    };
};

export const getConnectivityBusBarSectionData = ({ busbarSectionId }: { busbarSectionId?: string | null }) => {
    if (!busbarSectionId) {
        return null;
    }

    return {
        [FieldConstants.ID]: busbarSectionId,
    };
};

export const getConnectivityPropertiesData = ({
    voltageLevelId,
    busbarSectionId,
}: {
    voltageLevelId?: string | null;
    busbarSectionId?: string | null;
}) => {
    return {
        [FieldConstants.VOLTAGE_LEVEL]: getConnectivityVoltageLevelData({
            voltageLevelId,
        }),
        [FieldConstants.BUS_OR_BUSBAR_SECTION]: getConnectivityBusBarSectionData({
            busbarSectionId,
        }),
    };
};

export const getNewVoltageLevelData = (newVoltageLevel: VoltageLevelFormInfos) => ({
    id: newVoltageLevel.equipmentId,
    name: newVoltageLevel.equipmentName ?? '',
    substationId: newVoltageLevel.substationId,
    topologyKind: newVoltageLevel.topologyKind,
});

export const getConnectivityData = (
    { voltageLevelId, busbarSectionId }: { voltageLevelId?: string | null; busbarSectionId?: string | null },
    id = FieldConstants.CONNECTIVITY
) => {
    return {
        [id]: getConnectivityPropertiesData({
            voltageLevelId,
            busbarSectionId,
        }),
    };
};

export const getConnectivityFormData = (
    {
        voltageLevelId,
        busbarSectionId,
        connectionDirection,
        connectionName,
        connectionPosition,
        terminalConnected,
        isEquipmentModification = false,
    }: {
        voltageLevelId?: string | null;
        busbarSectionId?: string | null;
        connectionDirection?: string | null;
        connectionName?: string | null;
        connectionPosition?: number | null;
        terminalConnected?: boolean | null;
        isEquipmentModification?: boolean;
    },
    id = FieldConstants.CONNECTIVITY
) => {
    return {
        [id]: {
            ...getConnectivityPropertiesData({
                voltageLevelId,
                busbarSectionId,
            }),
            [FieldConstants.CONNECTION_DIRECTION]: connectionDirection ?? null,
            [FieldConstants.CONNECTION_NAME]: connectionName ?? '',
            [FieldConstants.CONNECTION_POSITION]: connectionPosition ?? null,
            [FieldConstants.CONNECTED]: terminalConnected ?? (isEquipmentModification ? null : true),
        },
    };
};

export const createConnectivityData = (equipmentToModify: any, index: number) => ({
    busbarSectionId: equipmentToModify?.[`busOrBusbarSectionId${index}`]?.value ?? null,
    connectionDirection: equipmentToModify?.[`connectionDirection${index}`]?.value ?? null,
    connectionName: equipmentToModify?.[`connectionName${index}`]?.value ?? '',
    connectionPosition: equipmentToModify?.[`connectionPosition${index}`]?.value ?? null,
    voltageLevelId: equipmentToModify?.[`voltageLevelId${index}`]?.value ?? null,
    terminalConnected: equipmentToModify?.[`terminal${index}Connected`]?.value ?? null,
    isEquipmentModification: true,
});
