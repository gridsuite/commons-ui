/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getEquipmentsInfosForSearchBar } from '../../src';

const NETWORK_UUID = '00000000-1111-2222-3333-444444444444';
const EQUIPMENTS = [
    {
        id: 'ident1',
        name: 'name1',
        type: 'LOAD',
        voltageLevels: [{ id: 'POSTEP7', name: 'POSTEP7' }],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident12',
        name: 'name12',
        type: 'LOAD',
        voltageLevels: [{ id: 'POSTEP6', name: 'POSTEP6' }],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident13',
        name: 'name13',
        type: 'LOAD',
        voltageLevels: [{ id: 'POSTEP5', name: 'POSTEP5' }],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident14',
        name: 'name14',
        type: 'LOAD',
        voltageLevels: [
            {
                id: '_1ef0715a-d5a9-477b-b6e7-b635529ac140_1ef0715a-d5a9-477b-vlid4',
                name: 'VL14',
            },
        ],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident15veryveryveryveryveryveryveryveryveryveryveryveryveryverylongid',
        name: '_1ef0715a-d5a9-477b-b6e7-b635529ac140_1ef0715a-d5a9-477b-b6eax',
        type: 'LOAD',
        voltageLevels: [
            {
                id: '_1ef0715a-d5a9-477b-b6e7-b635529ac140_1ef0715a-d5a9-477b-b6eax',
                name: 'VL15',
            },
        ],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident2',
        name: 'name2',
        type: 'GENERATOR',
        voltageLevels: [{ id: 'vl2', name: 'vl2' }],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident3 with spaces',
        name: 'name3 with spaces',
        type: 'SWITCH',
        voltageLevels: [{ id: 'vl3', name: 'vl3' }],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident4',
        name: 'name4',
        type: 'HVDC_LINE',
        voltageLevels: [
            { id: 'vl41', name: 'vl41' },
            { id: 'vl42', name: 'vl42' },
        ],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident5',
        name: 'name5',
        type: 'SUBSTATION',
        voltageLevels: [
            { id: 'vl51', name: 'vl51' },
            { id: 'vl52', name: 'vl52' },
        ],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident6',
        name: 'name6',
        type: 'VOLTAGE_LEVEL',
        voltageLevels: [{ id: 'vl6', name: 'vl6' }],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident7',
        name: 'name7',
        type: 'LINE',
        voltageLevels: [
            { id: 'vl71', name: 'vl71' },
            { id: 'vl72', name: 'vl72' },
        ],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident8',
        name: 'name8',
        type: 'TWO_WINDINGS_TRANSFORMER',
        voltageLevels: [
            { id: 'vl81', name: 'vl81' },
            { id: 'vl82', name: 'vl82' },
        ],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident9',
        name: 'name9',
        type: 'THREE_WINDINGS_TRANSFORMER',
        voltageLevels: [
            { id: 'vl91', name: 'vl91' },
            { id: 'vl92', name: 'vl92' },
        ],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident10',
        name: 'name10',
        type: 'BUS',
        voltageLevels: [{ id: 'vl10', name: 'vl10' }],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident11',
        name: '',
        type: 'BUS',
        voltageLevels: [{ id: 'vl10', name: 'vl10' }],
        networkUuid: NETWORK_UUID,
    },
    {
        id: 'ident15',
        // no name for testing
        type: 'BUS',
        voltageLevels: [{ id: 'vl10', name: 'vl10' }],
        networkUuid: NETWORK_UUID,
    },
];

const searchEquipments = (searchTerm, equipmentLabelling) => {
    if (searchTerm) {
        return getEquipmentsInfosForSearchBar(
            equipmentLabelling
                ? EQUIPMENTS.filter((equipment) =>
                      (equipment.name || equipment.id).includes(searchTerm)
                  )
                : EQUIPMENTS.filter((equipment) =>
                      equipment.id.includes(searchTerm)
                  ),
            equipmentLabelling ? (e) => e.name || e.id : (e) => e.id
        );
    }
    return [];
};

export default searchEquipments;
