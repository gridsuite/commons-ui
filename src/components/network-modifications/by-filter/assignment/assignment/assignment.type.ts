/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Option } from '../../../../../utils';
import { BY_FILTER_FIELDS } from '../../commons/byFilterFields';
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

// --- types for the form model --- //

export type Assignment = {
    [BY_FILTER_FIELDS.FILTERS]: Filter[];
    [BY_FILTER_FIELDS.EDITED_FIELD]: string;
    [BY_FILTER_FIELDS.VALUE]: string | number | boolean;
    [BY_FILTER_FIELDS.PROPERTY_NAME]?: string;
};

export type ModificationByAssignment = {
    [BY_FILTER_FIELDS.EQUIPMENT_TYPE]: string;
    [BY_FILTER_FIELDS.ASSIGNMENTS]: Assignment[];
};

export type FieldValue = string | number | boolean;
