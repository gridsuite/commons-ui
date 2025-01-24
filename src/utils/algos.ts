/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function equalsArray<T>(a: T[] | null, b: T[]) {
    if (b === a) {
        return true;
    }
    if (!b || !a) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0, l = a.length; i < l; i++) {
        const newA = a[i];
        const newB = b[i];

        if (newA instanceof Array && newB instanceof Array) {
            if (!equalsArray(newA, newB)) {
                return false;
            }
        } else if (newA !== newB) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
