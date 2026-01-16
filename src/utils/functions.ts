/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
        JSON.stringify([...array1].sort()) === JSON.stringify([...array2].sort())
    );
}

export const areArrayElementsUnique = (array: unknown[]) => {
    const uniqueValues = [...new Set(array)];
    return uniqueValues.length === array.length;
};

export const isObjectEmpty = (object: object) => object && Object.keys(object).length === 0;
