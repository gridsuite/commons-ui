import { FieldType } from './constants';

/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const GRIDSUITE_DEFAULT_PRECISION: number = 13;

export const roundToPrecision = (num: number, precision: number) => Number(num.toPrecision(precision));

export const roundToDefaultPrecision = (num: number) => roundToPrecision(num, GRIDSUITE_DEFAULT_PRECISION);

export function isBlankOrEmpty(value: unknown) {
    if (value === undefined || value === null) {
        return true;
    }
    if (typeof value === 'string') {
        return /^\s*$/.test(value);
    }
    return false;
}

export const unitToMicroUnit = (num: number) => (isBlankOrEmpty(num) ? undefined : roundToDefaultPrecision(num * 1e6));

export const microUnitToUnit = (num: number) => (isBlankOrEmpty(num) ? undefined : roundToDefaultPrecision(num / 1e6));

export const unitToKiloUnit = (num: number) => (isBlankOrEmpty(num) ? undefined : roundToDefaultPrecision(num / 1e3));

export const kiloUnitToUnit = (num: number) => (isBlankOrEmpty(num) ? undefined : roundToDefaultPrecision(num * 1e3));

const microUnits = [
    FieldType.SHUNT_CONDUCTANCE_1,
    FieldType.SHUNT_CONDUCTANCE_2,
    FieldType.SHUNT_SUSCEPTANCE_1,
    FieldType.SHUNT_SUSCEPTANCE_2,
    FieldType.G,
    FieldType.B,
    FieldType.G1,
    FieldType.B1,
    FieldType.G2,
    FieldType.B2,
];

const kiloUnits = [FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT, FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT];
export function convertInputValues(field: FieldType, value: any) {
    if (microUnits.includes(field)) {
        if (!Array.isArray(value)) {
            return value ? unitToMicroUnit(value) : value;
        }
        return value.map((a: number) => unitToMicroUnit(a));
    }
    if (kiloUnits.includes(field)) {
        if (!Array.isArray(value)) {
            return value ? unitToKiloUnit(value) : value;
        }
        return value.map((a: number) => unitToKiloUnit(a));
    }
    return value;
}

export function convertOutputValues(field: FieldType, value: any) {
    if (microUnits.includes(field)) {
        if (!Array.isArray(value)) {
            return value ? microUnitToUnit(value) : value;
        }
        return value.map((a: number) => microUnitToUnit(a));
    }
    if (kiloUnits.includes(field)) {
        if (!Array.isArray(value)) {
            return value ? kiloUnitToUnit(value) : value;
        }
        return value.map((a: number) => kiloUnitToUnit(a));
    }
    return value;
}
