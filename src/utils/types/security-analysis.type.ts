/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { ILimitReductionsByVoltageLevel } from '../../features/parameters/common/limitreductions/columns-definitions';
import { IdName } from './types';

export type ContingencyListsInfos = {
    contingencyLists: UUID[];
    description: string;
    activated: boolean;
};

export type ContingencyListsInfosEnriched = Omit<ContingencyListsInfos, 'contingencyLists'> & {
    contingencyLists: IdName[];
};

export type SAParameters = {
    uuid?: UUID;
    provider: string;
    contingencyListsInfos: ContingencyListsInfos[];
    limitReductions: ILimitReductionsByVoltageLevel[];
    flowProportionalThreshold: number;
    lowVoltageProportionalThreshold: number;
    lowVoltageAbsoluteThreshold: number;
    highVoltageProportionalThreshold: number;
    highVoltageAbsoluteThreshold: number;
};

export type SAParametersEnriched = Omit<SAParameters, 'contingencyListsInfos'> & {
    contingencyListsInfos: ContingencyListsInfosEnriched[];
};

export function mapSecurityAnalysisParameters(parameters: SAParametersEnriched): SAParameters {
    return {
        ...parameters,
        contingencyListsInfos: parameters.contingencyListsInfos?.map((clInfos) => {
            return {
                ...clInfos,
                contingencyLists: clInfos.contingencyLists.map((c) => c.id),
            };
        }),
    };
}
