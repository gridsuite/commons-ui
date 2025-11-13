/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PccMinParameters } from '../../../services';
import { FILTER_ID, FILTER_NAME, FILTERS, ID } from '../../../utils/constants/filterConstant';
import { NAME } from '../../inputs';

export const fromPccMinParametersFormToParamValues = (newParams: Record<string, any>): PccMinParameters | null => ({
    filters:
        newParams[FILTERS]?.map((filter: any) => ({
            filterId: filter[ID],
            filterName: filter[NAME],
        })) ?? [],
});

export const fromPccMinParamsDataToFormValues = (parameters: PccMinParameters | null): Record<string, any> => ({
    [FILTERS]:
        parameters?.[FILTERS]?.map((filter) => ({
            [ID]: filter[FILTER_ID],
            [NAME]: filter[FILTER_NAME],
        })) ?? [],
});

export const fromStudyPccMinParamsDataToFormValues = (parameters: PccMinParameters | null): Record<string, any> => ({
    [FILTERS]:
        parameters?.[FILTERS]?.map((filter) => ({
            [ID]: filter[FILTER_ID],
            [NAME]: filter[FILTER_NAME],
        })) ?? [],
});
