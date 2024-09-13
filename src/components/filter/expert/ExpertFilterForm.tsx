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
import './stylesExpertFilter.css';
import { useFormContext, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { v4 as uuid4 } from 'uuid';
import { useIntl } from 'react-intl';
import { testQuery } from './expertFilterUtils';
import { COMBINATOR_OPTIONS, EXPERT_FILTER_EQUIPMENTS, fields, OPERATOR_OPTIONS, RULES } from './expertFilterConstants';

import { FieldType } from './expertFilter.type';
import FieldConstants from '../../../utils/constants/fieldConstants';
import InputWithPopupConfirmation from '../../inputs/reactHookForm/selectInputs/InputWithPopupConfirmation';
import SelectInput from '../../inputs/reactHookForm/selectInputs/SelectInput';
import { FilterType } from '../constants/FilterConstants';
import CustomReactQueryBuilder from '../../inputs/reactQueryBuilder/CustomReactQueryBuilder';

yup.setLocale({
    mixed: {
        required: 'YupRequired',
        notType: ({ type }) => {
            if (type === 'number') {
                return 'YupNotTypeNumber';
            }
            return 'YupNotTypeDefault';
        },
    },
});

export const EXPERT_FILTER_QUERY = 'rules';

function isSupportedEquipmentType(equipmentType: string): boolean {
    return Object.values(EXPERT_FILTER_EQUIPMENTS)
        .map((equipments) => equipments.id)
        .includes(equipmentType);
}

export const rqbQuerySchemaValidator = (schema: yup.Schema) =>
    schema
        .test(RULES.EMPTY_GROUP, RULES.EMPTY_GROUP, (query: any) => {
            return testQuery(RULES.EMPTY_GROUP, query as RuleGroupTypeAny);
        })
        .test(RULES.EMPTY_RULE, RULES.EMPTY_RULE, (query: any) => {
            return testQuery(RULES.EMPTY_RULE, query as RuleGroupTypeAny);
        })
        .test(RULES.INCORRECT_RULE, RULES.INCORRECT_RULE, (query: any) => {
            return testQuery(RULES.INCORRECT_RULE, query as RuleGroupTypeAny);
        })
        .test(RULES.BETWEEN_RULE, RULES.BETWEEN_RULE, (query: any) => {
            return testQuery(RULES.BETWEEN_RULE, query as RuleGroupTypeAny);
        });

export const expertFilterSchema = {
    [EXPERT_FILTER_QUERY]: yup.object().when([FieldConstants.FILTER_TYPE], {
        is: FilterType.EXPERT.id,
        then: (schema: yup.Schema) =>
            schema.when([FieldConstants.EQUIPMENT_TYPE], {
                is: (equipmentType: string) => isSupportedEquipmentType(equipmentType),
                then: rqbQuerySchemaValidator,
            }),
    }),
};

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
                    label="equipmentType"
                    shouldOpenPopup={openConfirmationPopup}
                    resetOnConfirmation={handleResetOnConfirmation}
                    message="changeTypeMessage"
                    validateButtonLabel="button.changeType"
                />
            </Grid>
            {watchEquipmentType && isSupportedEquipmentType(watchEquipmentType) && (
                <CustomReactQueryBuilder name={EXPERT_FILTER_QUERY} fields={translatedFields} />
            )}
        </Grid>
    );
}

export default ExpertFilterForm;
