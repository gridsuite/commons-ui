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

export function removeNullFields<T extends Record<string, any>>(data: T): T {
    const dataTemp = data as Record<string, any>;
    if (dataTemp) {
        Object.keys(dataTemp).forEach((key) => {
            if (dataTemp[key] && dataTemp[key] !== null && typeof dataTemp[key] === 'object') {
                dataTemp[key] = removeNullFields(dataTemp[key]);
            }

            if (dataTemp[key] === null) {
                delete dataTemp[key];
            }
        });
    }
    return dataTemp as T;
}

export function parseIntData(val: string | number, defaultValue: string | number) {
    const intValue = Number.parseInt(String(val), 10);
    return Number.isNaN(intValue) ? defaultValue : intValue;
}

export function sanitizeString(val: string | null | undefined): string | null {
    const trimmedValue = val?.trim();
    return trimmedValue === undefined || trimmedValue === '' ? null : trimmedValue;
}

export const getIdOrSelf = (e: any) => e?.id ?? e;
