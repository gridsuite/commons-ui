/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export type Nullable<T> = { [K in keyof T]: T[K] | null };
export type DeepNullable<T> = {
    [K in keyof T]: DeepNullable<T[K]> | null;
};

export function notUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

export function notNull<T>(value: T | null): value is T {
    return value !== null;
}

export const removeNullFields = <T extends Record<string, any>>(data: T): T => {
    const result = Object.entries(data).reduce<Record<string, any>>((acc, [key, value]) => {
        if (value === null) {
            return acc;
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
            const cleaned = removeNullFields(value);
            if (Object.keys(cleaned).length > 0) {
                acc[key] = cleaned;
            }
            return acc;
        }

        acc[key] = value;
        return acc;
    }, {});

    return result as T;
};

export function parseIntData(val: string | number, defaultValue: string | number) {
    const intValue = Number.parseInt(String(val), 10);
    return Number.isNaN(intValue) ? defaultValue : intValue;
}

export function sanitizeString(val: string | null | undefined): string | null {
    const trimmedValue = val?.trim();
    return trimmedValue === undefined || trimmedValue === '' ? null : trimmedValue;
}

export const getIdOrSelf = (e: any) => e?.id ?? e;
