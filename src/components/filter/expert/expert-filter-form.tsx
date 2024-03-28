/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';

import Grid from '@mui/material/Grid';
import type { RuleGroupTypeAny } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder';
import './styles-expert-filter.css';
import { useFormContext, useWatch } from 'react-hook-form';
import { testQuery } from './expert-filter-utils';
import {
    COMBINATOR_OPTIONS,
    EXPERT_FILTER_EQUIPMENTS,
    fields,
    OPERATOR_OPTIONS,
} from '../constants/expert-filter-constants';
import * as yup from 'yup';

import { FieldType } from './expert-filter.type';
import { v4 as uuid4 } from 'uuid';
import { useIntl } from 'react-intl';
import { FieldConstants, FilterType } from '../constants/field-constants';
import CustomReactQueryBuilder from '../../../utils/rqb-inputs/custom-react-query-builder';
import InputWithPopupConfirmation from '../../../utils/rhf-inputs/select-inputs/input-with-popup-confirmation';
import SelectInput from '../../react-hook-form/select-input';

yup.setLocale({
    mixed: {
        required: 'YupRequired',
        notType: ({ type }) => {
            if (type === 'number') {
                return 'YupNotTypeNumber';
            } else {
                return 'YupNotTypeDefault';
            }
        },
    },
});

export const EXPERT_FILTER_QUERY = 'rules';

export const expertFilterSchema = {
    [EXPERT_FILTER_QUERY]: yup.object().when([FieldConstants.FILTER_TYPE], {
        is: FilterType.EXPERT.id,
        then: (schema: any) =>
            schema.when([FieldConstants.EQUIPMENT_TYPE], {
                is: (equipmentType: string) =>
                    isSupportedEquipmentType(equipmentType),
                then: (schema: any) =>
                    schema
                        .test(
                            FieldConstants.EMPTY_GROUP,
                            FieldConstants.EMPTY_GROUP,
                            (query: any) => {
                                return testQuery(
                                    FieldConstants.EMPTY_GROUP,
                                    query as RuleGroupTypeAny
                                );
                            }
                        )
                        .test(
                            FieldConstants.EMPTY_RULE,
                            FieldConstants.EMPTY_RULE,
                            (query: any) => {
                                return testQuery(
                                    FieldConstants.EMPTY_RULE,
                                    query as RuleGroupTypeAny
                                );
                            }
                        )
                        .test(
                            FieldConstants.INCORRECT_RULE,
                            FieldConstants.INCORRECT_RULE,
                            (query: any) => {
                                return testQuery(
                                    FieldConstants.INCORRECT_RULE,
                                    query as RuleGroupTypeAny
                                );
                            }
                        )
                        .test(
                            FieldConstants.BETWEEN_RULE,
                            FieldConstants.BETWEEN_RULE,
                            (query: any) => {
                                return testQuery(
                                    FieldConstants.BETWEEN_RULE,
                                    query as RuleGroupTypeAny
                                );
                            }
                        ),
            }),
    }),
};

function isSupportedEquipmentType(equipmentType: string): boolean {
    return Object.values(EXPERT_FILTER_EQUIPMENTS)
        .map((equipments) => equipments.id)
        .includes(equipmentType);
}

const defaultQuery = {
    combinator: COMBINATOR_OPTIONS.AND.name,
    rules: [
        {
            id: uuid4(),
            field: FieldType.ID,
            operator: OPERATOR_OPTIONS.CONTAINS.name,
            value: '',
        },
    ],
};

export function getExpertFilterEmptyFormData() {
    return {
        [EXPERT_FILTER_QUERY]: defaultQuery,
    };
}

function ExpertFilterForm() {
    const intl = useIntl();

    const { getValues, setValue } = useFormContext();

    const openConfirmationPopup = useCallback(() => {
        return (
            formatQuery(getValues(EXPERT_FILTER_QUERY), 'json_without_ids') !==
            formatQuery(defaultQuery, 'json_without_ids')
        );
    }, [getValues]);

    const handleResetOnConfirmation = useCallback(() => {
        setValue(EXPERT_FILTER_QUERY, defaultQuery);
    }, [setValue]);

    const watchEquipmentType = useWatch({
        name: FieldConstants.EQUIPMENT_TYPE,
    });

    const translatedFields = useMemo(() => {
        return fields[watchEquipmentType]?.map((field) => {
            return {
                ...field,
                label: intl.formatMessage({ id: field.label }),
            };
        });
    }, [intl, watchEquipmentType]);

    return (
        <Grid container item spacing={2}>
            <Grid item xs={12}>
                <InputWithPopupConfirmation
                    Input={SelectInput}
                    name={FieldConstants.EQUIPMENT_TYPE}
                    options={Object.values(EXPERT_FILTER_EQUIPMENTS)}
                    label={'equipmentType'}
                    shouldOpenPopup={openConfirmationPopup}
                    resetOnConfirmation={handleResetOnConfirmation}
                    message={'changeTypeMessage'}
                    validateButtonLabel={'button.changeType'}
                />
            </Grid>
            {watchEquipmentType &&
                isSupportedEquipmentType(watchEquipmentType) && (
                    <CustomReactQueryBuilder
                        name={EXPERT_FILTER_QUERY}
                        fields={translatedFields}
                    />
                )}
        </Grid>
    );
}

export default ExpertFilterForm;
