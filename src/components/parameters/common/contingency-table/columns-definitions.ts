/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { IParameters, IColumnsDef, ID, NAME, DESCRIPTION, ACTIVATED } from '../parameter-table';
import { ElementType } from '../../../../utils';
import { CONTINGENCY_LISTS_INFOS, CONTINGENCY_LISTS } from '../constants';
import yup from '../../../../utils/yupConfig';
import { IContingencyList, IContingencyListsInfos } from './types';

export const COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS: IColumnsDef[] = [
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

export const ParamContingencyLists: IParameters = {
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
                        .min(1, 'FieldIsRequired'),
                    [DESCRIPTION]: yup.string(),
                    [ACTIVATED]: yup.boolean().required(),
                })
            ),
        })
        .required();
};

export const toFormValuesContingencyListsInfos = (contingencyListsInfos: IContingencyListsInfos[]) => {
    return {
        [CONTINGENCY_LISTS_INFOS]: contingencyListsInfos?.map((contingencyListInfos: IContingencyListsInfos) => ({
            [CONTINGENCY_LISTS]: contingencyListInfos[CONTINGENCY_LISTS]?.map((c: IContingencyList) => ({
                [NAME]: c[NAME],
                [ID]: c[ID],
            })),
            [DESCRIPTION]: contingencyListInfos[DESCRIPTION],
            [ACTIVATED]: contingencyListInfos[ACTIVATED],
        })),
    };
};
