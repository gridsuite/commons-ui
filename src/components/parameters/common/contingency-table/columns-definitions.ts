/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ACTIVATED, DESCRIPTION, ID, NAME } from '../parameter-table';
import { ElementType } from '../../../../utils';
import { CONTINGENCY_LISTS, CONTINGENCY_LISTS_INFOS } from '../constants';
import yup from '../../../../utils/yupConfig';
import { ContingencyListsInfos, IdName } from './types';
import { DndColumn, DndColumnType } from '../../../dnd-table-v2';

export const COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS: DndColumn[] = [
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCY_LISTS,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: [],
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'description',
        dataKey: DESCRIPTION,
        initialValue: '',
        editable: true,
        width: '8rem',
        type: DndColumnType.DESCRIPTIONS,
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        editable: true,
        width: '4rem',
        type: DndColumnType.SWITCH,
    },
];

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
                        .min(1, 'FieldIsRequired'),
                    [DESCRIPTION]: yup.string(),
                    [ACTIVATED]: yup.boolean().required(),
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
