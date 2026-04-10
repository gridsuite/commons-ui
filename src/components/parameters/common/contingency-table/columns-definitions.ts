/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    Parameters,
    ColumnsDef,
    DESCRIPTION,
    ACTIVATED,
    NAME,
    ID,
    CONTAINER_NAME,
    CONTAINER_ID,
} from '../parameter-table';
import { ElementType, EquipmentsContainer } from '../../../../utils';
import { CONTINGENCY_LISTS_INFOS, CONTINGENCY_LISTS } from '../constants';
import yup from '../../../../utils/yupConfig';
import { ContingencyListsInfosEnriched } from './types';

export const COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS: ColumnsDef[] = [
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCY_LISTS,
        initialValue: [],
        editable: true,
        directoryItems: true,
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'description',
        dataKey: DESCRIPTION,
        initialValue: '',
        editable: true,
        descriptionItems: true,
        width: '8rem',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        checkboxItems: true,
        editable: true,
        width: '4rem',
    },
];

export const ParamContingencyLists: Parameters = {
    columnsDef: COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS,
    name: CONTINGENCY_LISTS_INFOS,
};

export const getContingencyListsInfosFormSchema = () => {
    return yup
        .object()
        .shape({
            [CONTINGENCY_LISTS_INFOS]: yup.array().of(
                yup.object().shape({
                    [CONTINGENCY_LISTS]: yup
                        .array()
                        .of(
                            yup.object().shape({
                                [ID]: yup.string().required(),
                                [NAME]: yup.string().required(),
                            })
                        )
                        .required()
                        .when([ACTIVATED], {
                            is: (activated: boolean) => activated,
                            then: (schema) => schema.min(1, 'FieldIsRequired'),
                        }),
                    [DESCRIPTION]: yup.string(),
                    [ACTIVATED]: yup.boolean().required(),
                })
            ),
        })
        .required();
};

export const toFormValuesContingencyListsInfos = (contingencyListsInfos: ContingencyListsInfosEnriched[]) => {
    return {
        [CONTINGENCY_LISTS_INFOS]: contingencyListsInfos?.map(
            (contingencyListInfos: ContingencyListsInfosEnriched) => ({
                [CONTINGENCY_LISTS]: contingencyListInfos[CONTINGENCY_LISTS]?.map((c: EquipmentsContainer) => ({
                    [NAME]: c[CONTAINER_NAME],
                    [ID]: c[CONTAINER_ID],
                })),
                [DESCRIPTION]: contingencyListInfos[DESCRIPTION],
                [ACTIVATED]: contingencyListInfos[ACTIVATED],
            })
        ),
    };
};
