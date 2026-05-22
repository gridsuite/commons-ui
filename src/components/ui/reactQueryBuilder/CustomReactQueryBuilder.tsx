/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import * as ReactDnD from 'react-dnd';
import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import {
    ActionWithRulesAndAddersProps,
    defaultTranslations,
    Field,
    QueryBuilder,
    RuleGroupTypeAny,
} from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { CombinatorSelector } from './CombinatorSelector';
import { AddButton } from './AddButton';
import { ValueEditor } from './ValueEditor';
import { ValueSelector } from './ValueSelector';

import { COMBINATOR_OPTIONS } from '../../filter/expert/expertFilterConstants';
import { ErrorInput } from '../reactHookForm/errorManagement/ErrorInput';
import { FieldErrorAlert } from '../reactHookForm/errorManagement/FieldErrorAlert';
import { countRules, getOperators, queryValidator } from '../../filter/expert/expertFilterUtils';
import { RemoveButton } from './RemoveButton';
import { FieldSelector } from './FieldSelector';
import { OperatorSelector } from './OperatorSelector';

export interface CustomReactQueryBuilderProps {
    name: string;
    fields: Field[];
}

function RuleAddButton(props: Readonly<ActionWithRulesAndAddersProps>) {
    return <AddButton {...props} label="rule" />;
}

function GroupAddButton(props: Readonly<ActionWithRulesAndAddersProps>) {
    return <AddButton {...props} label="subGroup" />;
}

// titles for different components
const customTranslations = {
    ...defaultTranslations,
    fields: { ...defaultTranslations.fields, title: '' },
    operators: { ...defaultTranslations.operators, title: '' },
    dragHandle: { ...defaultTranslations.dragHandle, title: '' },
    addRule: { ...defaultTranslations.addRule, title: '' },
    addGroup: { ...defaultTranslations.addGroup, title: '' },
    removeRule: { ...defaultTranslations.removeRule, title: '' },
    removeGroup: { ...defaultTranslations.removeGroup, title: '' },
    value: { title: '' },
    combinators: { title: '' },
};

export function CustomReactQueryBuilder(props: Readonly<CustomReactQueryBuilderProps>) {
    const { name, fields } = props;
    const {
        getValues,
        setValue,
        watch,
        formState: { isSubmitted }, // Set to true after the form is submitted. Will remain true until the reset method is invoked.
    } = useFormContext();
    const intl = useIntl();

    const query = watch(name);

    // Ideally we should "clean" the empty groups after DnD as we do for the remove button
    // But it's the only callback we have access to in this case,
    // and we don't have access to the path, so it can't be done in a proper way
    const handleQueryChange = useCallback(
        (newQuery: RuleGroupTypeAny) => {
            const oldQuery = getValues(name);
            const hasQueryChanged =
                formatQuery(oldQuery, 'json_without_ids') !== formatQuery(newQuery, 'json_without_ids');
            const hasAddedRules = countRules(newQuery) > countRules(oldQuery);
            setValue(name, newQuery, {
                shouldDirty: hasQueryChanged,
                shouldValidate: isSubmitted && hasQueryChanged && !hasAddedRules,
            });
        },
        [getValues, setValue, isSubmitted, name]
    );

    const combinators = useMemo(() => {
        return Object.values(COMBINATOR_OPTIONS).map((c: any) => ({
            name: c.name,
            label: intl.formatMessage({ id: c.label }),
        }));
    }, [intl]);

    return (
        <>
            <QueryBuilderMaterial>
                <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
                    <QueryBuilder
                        fields={fields}
                        query={query}
                        addRuleToNewGroups
                        combinators={combinators}
                        onQueryChange={handleQueryChange}
                        getOperators={(fieldName) => getOperators(fieldName, intl)}
                        validator={queryValidator}
                        controlClassnames={{
                            queryBuilder: 'queryBuilder-branches',
                        }}
                        controlElements={{
                            addRuleAction: RuleAddButton,
                            addGroupAction: GroupAddButton,
                            combinatorSelector: CombinatorSelector,
                            removeRuleAction: RemoveButton,
                            removeGroupAction: RemoveButton,
                            valueEditor: ValueEditor,
                            operatorSelector: OperatorSelector,
                            fieldSelector: FieldSelector,
                            valueSourceSelector: ValueSelector,
                        }}
                        listsAsArrays
                        accessibleDescriptionGenerator={() => ''} // tooltip for querybuilder container and subgroups
                        translations={customTranslations}
                    />
                </QueryBuilderDnD>
            </QueryBuilderMaterial>
            <Box>
                <ErrorInput name={name} InputField={FieldErrorAlert} />
            </Box>
        </>
    );
}
