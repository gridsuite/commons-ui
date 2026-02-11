/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { IParameters, IColumnsDef, ID, NAME, DESCRIPTION, ACTIVATED } from '../parameter-table';
import { ElementType } from '../../../../utils';
import { CONTINGENCIES, CONTINGENCY_LISTS } from '../constants';
import yup from '../../../../utils/yupConfig';
import { IContingencies, IContingencyList } from './types';

export const COLUMNS_DEFINITIONS_CONTINGENCY_LISTS: IColumnsDef[] = [
    {
        label: 'Contingencies',
        dataKey: CONTINGENCIES,
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
    columnsDef: COLUMNS_DEFINITIONS_CONTINGENCY_LISTS,
    name: CONTINGENCY_LISTS,
};

export const getContingencyListsFormSchema = () => {
    return yup
        .object()
        .shape({
            [CONTINGENCY_LISTS]: yup.array().of(
                yup.object().shape({
                    [CONTINGENCIES]: yup
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

export const toFormValuesContingencyLists = (contingencyLists: IContingencyList[]) => {
    return {
        [CONTINGENCY_LISTS]: contingencyLists?.map((contingencyList: IContingencyList) => ({
            [CONTINGENCIES]: contingencyList[CONTINGENCIES]?.map((contingency: IContingencies) => ({
                [NAME]: contingency[NAME],
                [ID]: contingency[ID],
            })),
            [DESCRIPTION]: contingencyList[DESCRIPTION],
            [ACTIVATED]: contingencyList[ACTIVATED],
        })),
    };
};
