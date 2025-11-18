/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ALL_EQUIPMENTS, BASE_EQUIPMENTS, EquipmentType } from '../../../utils';

export type ContingencyListEquipment = {
    id: string;
    label: string;
};

export const CONTINGENCY_LIST_EQUIPMENTS: Record<
    | EquipmentType.BUSBAR_SECTION
    | EquipmentType.LINE
    | EquipmentType.TWO_WINDINGS_TRANSFORMER
    | EquipmentType.THREE_WINDINGS_TRANSFORMER
    | EquipmentType.GENERATOR
    | EquipmentType.BATTERY
    | EquipmentType.LOAD
    | EquipmentType.SHUNT_COMPENSATOR
    | EquipmentType.STATIC_VAR_COMPENSATOR
    | EquipmentType.HVDC_LINE
    | EquipmentType.DANGLING_LINE,
    ContingencyListEquipment
> = {
    BUSBAR_SECTION: {
        id: 'BUSBAR_SECTION',
        label: 'BusBarSections',
    },
    LINE: {
        id: 'LINE',
        label: 'Lines',
    },
    TWO_WINDINGS_TRANSFORMER: {
        id: 'TWO_WINDINGS_TRANSFORMER',
        label: 'TwoWindingsTransformers',
    },
    THREE_WINDINGS_TRANSFORMER: {
        id: 'THREE_WINDINGS_TRANSFORMER',
        label: 'ThreeWindingsTransformers',
    },
    GENERATOR: {
        id: 'GENERATOR',
        label: 'Generators',
    },
    BATTERY: {
        id: 'BATTERY',
        label: 'Batteries',
    },
    LOAD: {
        id: 'LOAD',
        label: 'Loads',
    },
    SHUNT_COMPENSATOR: {
        id: 'SHUNT_COMPENSATOR',
        label: 'ShuntCompensators',
    },
    STATIC_VAR_COMPENSATOR: {
        id: 'STATIC_VAR_COMPENSATOR',
        label: 'StaticVarCompensators',
    },
    HVDC_LINE: {
        id: 'HVDC_LINE',
        label: 'HvdcLines',
    },
    DANGLING_LINE: {
        id: 'DANGLING_LINE',
        label: 'DanglingLines',
    },
};

export const FILTER_EQUIPMENTS: typeof ALL_EQUIPMENTS = {
    ...BASE_EQUIPMENTS,
    [EquipmentType.HVDC_LINE]: ALL_EQUIPMENTS[EquipmentType.HVDC_LINE],
};
