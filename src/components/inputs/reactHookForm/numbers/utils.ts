/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export const isIntegerNumber = (val: string) => {
    return /^-?[0-9]*$/.test(val);
};

// checks if it is a prefix
export const isFloatNumber = (val: string) => {
    // no possessive qualifier in javascripts native regexp,
    // replace /^-?[0-9]*[.,]?[0-9]*$/ with code not
    // vulnerable to catastrophic backtracking (ON^2)
    // TODO find a better way for this code
    let idx = 0;
    if (idx < val.length && val.charAt(idx) === '-') {
        idx += 1;
    }
    while (idx < val.length && val.charCodeAt(idx) >= 48 && val.charCodeAt(idx) <= 57) {
        // [0-9]
        idx += 1;
    }
    if (idx === val.length) {
        return true;
    }
    if (val.charAt(idx) === '.' || val.charAt(idx) === ',') {
        idx += 1;
        while (idx < val.length && val.charCodeAt(idx) >= 48 && val.charCodeAt(idx) <= 57) {
            // [0-9]
            idx += 1;
        }
    }
    return idx === val.length;
};
