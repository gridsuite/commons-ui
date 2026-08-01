/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from './constants/fieldConstants';
import { RunningStatus } from './running-status';
import { toNumber } from './validation-functions';

/**
 * Returns true when the given form rows contain at least one cell with a
 * non-empty value (excluding the AG_GRID_ROW_UUID identifier column).
 */
export const hasNonEmptyRows = (rows: unknown): boolean =>
    Array.isArray(rows) &&
    rows.some(
        (row: any) =>
            row &&
            Object.keys(row)
                .filter((key) => key !== FieldConstants.AG_GRID_ROW_UUID)
                .some((key) => row[key] !== undefined && row[key] !== null && String(row[key]).trim().length > 0)
    );

/**
 * function to generate a key
 * @returns {number} key
 */
export function keyGenerator() {
    let key = 1;
    return () => {
        key += 1;
        return key;
    };
}

/**
 * returns true if the two arrays contain exactly the same strings, regardless of the order
 */
export function arraysContainIdenticalStrings(array1: string[] | undefined, array2: string[] | undefined): boolean {
    return (
        array1 !== undefined &&
        array2 !== undefined &&
        JSON.stringify([...array1].sort((a, b) => a.localeCompare(b))) ===
            JSON.stringify([...array2].sort((a, b) => a.localeCompare(b)))
    );
}

export const areArrayElementsUnique = (array: unknown[]) => {
    const uniqueValues = [...new Set(array)];
    return uniqueValues.length === array.length;
};

/**
 * returns true if element is null or undefined
 * for string values return true if element is an empty string
 * for number values return true if element is NaN
 */
export function isEmpty(value: any): boolean {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'number' && Number.isNaN(value))
    );
}

export const isObjectEmpty = (object: object) => object && Object.keys(object).length === 0;

export function getRows(rows: any[] | undefined, status: string): any[] {
    return status === RunningStatus.SUCCEED && rows ? rows : [];
}

/**
 * Returns true if every element of this array is a number and they are ordered (ascending or descending)
 * @param array or numbers
 * @returns {boolean}
 */
export const areNumbersOrdered = (array?: unknown) => {
    if (!Array.isArray(array)) {
        return false;
    }
    if (array.length === 0) {
        return true;
    }
    if (array.length === 1) {
        return !Number.isNaN(toNumber(array[0]));
    }

    let current = toNumber(array[0]);
    if (Number.isNaN(current)) {
        return false;
    }
    let order = null;

    for (let i = 1; i < array.length; i++) {
        const nextOne = toNumber(array[i]);
        if (Number.isNaN(nextOne)) {
            return false;
        }
        if (current === nextOne) {
            continue;
        }
        if (order === null) {
            order = current < nextOne ? 'asc' : 'desc';
        }
        if ((order === 'asc' && current > nextOne) || (order === 'desc' && current < nextOne)) {
            return false;
        }
        current = nextOne;
    }
    return true;
};

export const addSelectedFieldToRows = <T>(rows?: T[]): (T & { selected: boolean })[] => {
    return (
        rows?.map((row) => {
            return { ...row, [FieldConstants.SELECTED]: false };
        }) ?? []
    );
};
