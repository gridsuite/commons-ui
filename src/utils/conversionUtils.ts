/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { AttributeModification, OperationType } from './types';
import { FieldType } from './types/fieldType';

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

export function unitToMicroUnit(num: number) {
    return isBlankOrEmpty(num) ? undefined : roundToDefaultPrecision(num * 1e6);
}

export function microUnitToUnit(num: number) {
    return isBlankOrEmpty(num) ? undefined : roundToDefaultPrecision(num / 1e6);
}

export function unitToKiloUnit(num: number) {
    return isBlankOrEmpty(num) ? undefined : roundToDefaultPrecision(num / 1e3);
}

export function kiloUnitToUnit(num: number) {
    return isBlankOrEmpty(num) ? undefined : roundToDefaultPrecision(num * 1e3);
}

const microToUnit = [
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

const kiloToUnit = [FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT, FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT];

export function convertInputValue(field: FieldType, value: any) {
    if (microToUnit.includes(field)) {
        if (!Array.isArray(value)) {
            return value ? unitToMicroUnit(value) : value;
        }
        return value.map((a: number) => unitToMicroUnit(a));
    }
    if (kiloToUnit.includes(field)) {
        if (!Array.isArray(value)) {
            return value ? unitToKiloUnit(value) : value;
        }
        return value.map((a: number) => unitToKiloUnit(a));
    }
    return value;
}

export function convertOutputValue(field: FieldType, value: any) {
    if (microToUnit.includes(field)) {
        if (!Array.isArray(value)) {
            return value ? microUnitToUnit(value) : value;
        }
        return value.map((a: number) => microUnitToUnit(a));
    }
    if (kiloToUnit.includes(field)) {
        if (!Array.isArray(value)) {
            return value ? kiloUnitToUnit(value) : value;
        }
        return value.map((a: number) => kiloUnitToUnit(a));
    }
    return value;
}

export function toModificationOperation<T>(
    value: T
): AttributeModification<Exclude<Exclude<T, null>, undefined>> | null {
    return value === 0 || value === false || value
        ? { value: value as Exclude<Exclude<T, null>, undefined>, op: OperationType.SET }
        : null;
}
