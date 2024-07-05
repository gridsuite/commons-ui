/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const filter_en = {
    OR: 'OR',
    AND: 'AND',
    rule: 'rule',
    subGroup: 'subgroup',
    is: 'is',
    contains: 'contains',
    beginsWith: 'begins with',
    endsWith: 'ends with',
    exists: 'exists',
    not_exists: 'not exists',
    between: 'between',
    in: 'in',
    isPartOf: 'is part of',
    isNotPartOf: 'is not part of',
    emptyRule: 'Filter contains an empty field',
    incorrectRule: 'Filter contains an incorrect field',
    obsoleteFilter:
        'This filter is no longer supported. Please remove it or change its equipment type.',
    betweenRule:
        "Left value of 'between' rule have to be lower than the right value",
    emptyGroup:
        'Filter contains an empty group. Consider removing it or adding rules to this group',
    Hvdc: 'HVDC',
};

export default filter_en;
