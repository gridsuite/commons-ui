/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { EquipmentType, Option } from '../../../../../utils';
import { Filter } from '../../commons/by-filter.type';

// --- types for the configuration, see the constants file --- //

export enum DataType {
    ENUM = 'ENUM',
    BOOLEAN = 'BOOLEAN',
    INTEGER = 'INTEGER',
    DOUBLE = 'DOUBLE',
    PROPERTY = 'PROPERTY',
    STRING = 'STRING',
}

export type FieldOptionType = {
    id: string;
    label: string;
    unit?: string;
    dataType: DataType;
    // if settableToNone is true it is possible to save an empty value which means "unset".
    // undefined means false ie. cannot be set to empty/null/none
    settableToNone?: boolean;
    values?: Option[];
    outputConverter?: (value: number) => number | undefined;
    inputConverter?: (value: number) => number | undefined;
};

export type Assignment = {
    filters: Filter[];
    editedField: string;
    value: string | number | boolean;
    propertyName?: string;
};

export type ModificationByAssignment = {
    equipmentType: EquipmentType;
    assignments: Assignment[];
};

export type FieldValue = string | number | boolean;
