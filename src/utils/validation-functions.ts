/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// TODO this is a partial migration from GridStudy

/*
 * Returns a Number corresponding to provided value, or NaN if not a valid number per
 * Gridsuite's standard (allows either coma or dots for decimal).
 */
export function toNumber(value: unknown) {
    if (typeof value === 'number') {
        return value;
    } else if (typeof value === 'string') {
        const sanitizedString = value.replace(',', '.').trim();
        if (value.length > 0) {
            return Number(sanitizedString);
        }
    }
    console.error('Error while trying to convert a value to Number. Value :', value);
    return NaN;
}

/*
 * Returns true if the value is a valid number, per Gridsuite's standard (allows either coma or dots for decimal).
 */
export function validateValueIsANumber(value?: string | number | null | boolean): value is number {
    if (value == null || value === '') {
        return false;
    }
    return !isNaN(toNumber(value));
}
