/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { array, boolean, object, string } from 'yup';
import { ACTIVATED, ColumnsDef, DESCRIPTION, ID, NAME, Parameters } from '../parameter-table';
import { ElementType, YUP_REQUIRED } from '../../../../utils';
import { CONTINGENCY_LISTS, CONTINGENCY_LISTS_INFOS } from '../constants';
import { ContingencyListsInfos, IdName } from './types';

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
    return object()
        .shape({
            [CONTINGENCY_LISTS_INFOS]: array().of(
                object().shape({
                    [CONTINGENCY_LISTS]: array()
                        .of(
                            object().shape({
                                [ID]: string().required(),
                                [NAME]: string().required(),
                            })
                        )
                        .required()
                        .min(1, YUP_REQUIRED),
                    [DESCRIPTION]: string(),
                    [ACTIVATED]: boolean().required(),
                })
            ),
        })
        .required();
};

export const toFormValuesContingencyListsInfos = (contingencyListsInfos: ContingencyListsInfos[]) => {
    return {
        [CONTINGENCY_LISTS_INFOS]: contingencyListsInfos?.map((contingencyListInfos: ContingencyListsInfos) => ({
            [CONTINGENCY_LISTS]: contingencyListInfos[CONTINGENCY_LISTS]?.map((c: IdName) => ({
                [NAME]: c[NAME],
                [ID]: c[ID],
            })),
            [DESCRIPTION]: contingencyListInfos[DESCRIPTION],
            [ACTIVATED]: contingencyListInfos[ACTIVATED],
        })),
    };
};
