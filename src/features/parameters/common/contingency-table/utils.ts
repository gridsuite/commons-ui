/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ContingencyCount } from './types';
import { ContingencyListsInfosEnriched } from '../../../../utils';

export type SuccessCountType = {
    success: true;
    nbContingencies: number;
    notFoundElements: number;
};

export type FailureCountType = {
    success: false;
    invalidContingencyErrorMessage: string;
};

export type SimulatedContingencyCountType = SuccessCountType | FailureCountType;

export function mapSimulatedContingencyList(
    contingencyCount: ContingencyCount,
    contingencyListsInfos: ContingencyListsInfosEnriched[]
): SimulatedContingencyCountType {
    const namesById: Record<string, string | undefined> = {};
    contingencyListsInfos.forEach((info) => {
        info.contingencyLists.forEach((idName) => {
            namesById[idName.id] = idName.name;
        });
    });

    let total = 0;
    let totalNotFound = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const [uuid, countByList] of Object.entries(contingencyCount.countByContingencyList)) {
        total += countByList.nbContingencies;
        const listName = namesById[uuid] ?? uuid;

        if (countByList.invalidContingencyErrorMessage !== null) {
            return {
                success: false,
                invalidContingencyErrorMessage: `${countByList.invalidContingencyErrorMessage} in the list ${listName}`,
            };
        }
        if (countByList.notFoundElements !== null) {
            totalNotFound += Object.entries(countByList.notFoundElements).length;
        }
    }

    return {
        success: true,
        nbContingencies: total,
        notFoundElements: totalNotFound,
    };
}
