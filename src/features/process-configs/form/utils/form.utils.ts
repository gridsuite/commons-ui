/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ProcessConfigFormValues } from '../../common';

export function withoutProcessType(values: ProcessConfigFormValues): Omit<ProcessConfigFormValues, 'processType'> {
    const { processType, ...rest } = values;
    return rest;
}

export function deepEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) {
        return true;
    }

    if (a === null || b === null) {
        return false;
    }

    if (typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }

    if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b)) {
            return false;
        }

        if (a.length !== b.length) {
            return false;
        }

        return a.every((value, index) => deepEqual(value, b[index]));
    }

    const aRecord = a as Record<string, unknown>;
    const bRecord = b as Record<string, unknown>;

    const aKeys = Object.keys(aRecord);
    const bKeys = Object.keys(bRecord);

    if (aKeys.length !== bKeys.length) {
        return false;
    }

    return aKeys.every((key) => Object.hasOwn(bRecord, key) && deepEqual(aRecord[key], bRecord[key]));
}
