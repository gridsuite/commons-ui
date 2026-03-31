/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const BY_FILTER_FIELDS = {
    ASSIGNMENTS: 'assignments',
    EDITED_FIELD: 'editedField',
    EQUIPMENT_TYPE: 'equipmentType',
    FILTERS: 'filters',
    PROPERTY_NAME: 'propertyName',
    VALUE: 'value',
} as const;

export const { ASSIGNMENTS } = BY_FILTER_FIELDS;
export const { EDITED_FIELD } = BY_FILTER_FIELDS;
export const EQUIPMENT_TYPE_FIELD = BY_FILTER_FIELDS.EQUIPMENT_TYPE;
export const { FILTERS } = BY_FILTER_FIELDS;
export const PROPERTY_NAME_FIELD = BY_FILTER_FIELDS.PROPERTY_NAME;
export const VALUE_FIELD = BY_FILTER_FIELDS.VALUE;
