/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';

import type { RuleGroupTypeAny } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder';
import './stylesExpertFilter.css';
import { useFormContext, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { v4 as uuid4 } from 'uuid';
import { Box } from '@mui/material';
import { testQuery } from './expertFilterUtils';
import {
    COMBINATOR_OPTIONS,
    EXPERT_FILTER_EQUIPMENTS,
    EXPERT_FILTER_FIELDS,
    EXPERT_FILTER_QUERY,
    OPERATOR_OPTIONS,
    RULES,
} from './expertFilterConstants';

import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { InputWithPopupConfirmation } from '../../inputs/reactHookForm/selectInputs/InputWithPopupConfirmation';
import { SelectInput } from '../../inputs/reactHookForm/selectInputs/SelectInput';
import { FilterType } from '../constants/FilterConstants';
import { CustomReactQueryBuilder } from '../../inputs/reactQueryBuilder/CustomReactQueryBuilder';
import { unscrollableDialogStyles } from '../../dialogs';
import { FieldType } from '../../../utils/types/fieldType';
import { useFormatLabelWithUnit } from '../../../hooks/useFormatLabelWithUnit';
import { filterStyles } from '../HeaderFilterForm';

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

export function ExpertFilterForm() {
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
    const formatLabelWithUnit = useFormatLabelWithUnit();
    const translatedFields = useMemo(() => {
        return EXPERT_FILTER_FIELDS[watchEquipmentType]?.map((field) => {
            return {
                ...field,
                label: formatLabelWithUnit(field),
            };
        });
    }, [formatLabelWithUnit, watchEquipmentType]);

    return (
        <>
            <Box sx={unscrollableDialogStyles.unscrollableHeader}>
                <InputWithPopupConfirmation
                    Input={SelectInput}
                    name={FieldConstants.EQUIPMENT_TYPE}
                    options={Object.values(EXPERT_FILTER_EQUIPMENTS)}
                    label="equipmentType"
                    shouldOpenPopup={openConfirmationPopup}
                    resetOnConfirmation={handleResetOnConfirmation}
                    message="changeTypeMessage"
                    validateButtonLabel="button.changeType"
                    sx={filterStyles.textField}
                />
            </Box>
            <Box sx={unscrollableDialogStyles.scrollableContent}>
                {watchEquipmentType && isSupportedEquipmentType(watchEquipmentType) && (
                    <CustomReactQueryBuilder name={EXPERT_FILTER_QUERY} fields={translatedFields} />
                )}
            </Box>
        </>
    );
}
