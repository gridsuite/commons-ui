/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../../../../utils/constants';
import { OperationalLimitsGroupFormSchema, TemporaryLimitFormSchema } from './operationalLimitsGroups.types';
import { APPLICABILITY } from './limits.types';

function generateEmptyTemporaryLimitArray(): TemporaryLimitFormSchema[] {
    return [
        {
            [FieldConstants.TEMPORARY_LIMIT_NAME]: '',
            [FieldConstants.TEMPORARY_LIMIT_DURATION]: null,
            [FieldConstants.TEMPORARY_LIMIT_VALUE]: null,
        },
    ];
}

export function generateEmptyOperationalLimitsGroup(name: string): OperationalLimitsGroupFormSchema {
    return {
        [FieldConstants.ID]: crypto.randomUUID(),
        [FieldConstants.NAME]: name,
        [FieldConstants.APPLICABILITY_FIELD]: APPLICABILITY.EQUIPMENT.id,
        [FieldConstants.LIMITS_PROPERTIES]: [],
        [FieldConstants.CURRENT_LIMITS]: {
            [FieldConstants.TEMPORARY_LIMITS]: generateEmptyTemporaryLimitArray(),
            [FieldConstants.PERMANENT_LIMIT]: 0,
        },
    };
}

export function generateUniqueId(baseName: string, names: string[]): string {
    let finalId = baseName;
    let found = false;
    let increment = 1;
    let suffix = '';
    do {
        found = names.includes(baseName + suffix, 0);
        if (found) {
            increment++;
            suffix = `(${increment})`;
            finalId = baseName + suffix;
        }
    } while (found);

    return finalId;
}
