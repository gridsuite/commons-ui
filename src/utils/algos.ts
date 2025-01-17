/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function equalsArray(
    a: [Record<string, number | string | undefined>, number][] | null,
    b: [Record<string, number | string | undefined>, number][]
) {
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
        if (a[i] instanceof Array && b[i] instanceof Array) {
            if (
                !equalsArray(
                    a[i] as unknown as [Record<string, number | string | undefined>, number][] | null,
                    b[i] as unknown as [Record<string, number | string | undefined>, number][]
                )
            ) {
                return false;
            }
        } else if (a[i] !== b[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
