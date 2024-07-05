/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    defaultOperators,
    findPath,
    getParentPath,
    QueryValidator,
    remove,
    RuleGroupType,
    RuleGroupTypeAny,
    RuleType,
    ValidationMap,
} from 'react-querybuilder';
import { IntlShape } from 'react-intl';
import {
    CombinatorType,
    CompositeField,
    CompositeGroup,
    DataType,
    FieldType,
    OperatorOption,
    OperatorType,
    RuleGroupTypeExport,
    RuleTypeExport,
} from './expert-filter.type';
import { validate as uuidValidate } from 'uuid';
import {
    FIELDS_OPTIONS,
    OPERATOR_OPTIONS,
    RULES,
} from './expert-filter-constants';
import {
    isBlankOrEmpty,
    microUnitToUnit,
    unitToMicroUnit,
} from '../../../utils/conversion-utils';

const microUnits = [
    FieldType.SHUNT_CONDUCTANCE_1,
    FieldType.SHUNT_CONDUCTANCE_2,
    FieldType.SHUNT_SUSCEPTANCE_1,
    FieldType.SHUNT_SUSCEPTANCE_2,
];

interface TreeNode {
    [key: string]: any;
    children?: Tree;
}

interface Tree {
    [key: string]: TreeNode;
}

const searchTree = (tree: Tree, key: string, value: any) => {
    const stack = Object.values(tree);
    while (stack.length) {
        const node = stack.shift();
        if (node?.[key] === value) {
            return node;
        }
        if (node?.children) {
            stack.push(...Object.values(node.children));
        }
    }
    return null;
};

const getFieldData = (fieldName: string) => {
    return searchTree(FIELDS_OPTIONS, 'name', fieldName) as CompositeField;
};

/**
 *  Get dataType configured by default in field options OR return an overridden dataType in some particular case.
 *  This function should be used only before interfacing to the back-end, eg. exporting or validating an expert filter
 *
 * @param fieldName selected field in a rule
 * @param operator selected operator in a rule
 *
 * @return a dataType
 */
const getDataType = (fieldName: string, operator: string) => {
    // particular case => set dataType to FILTER_UUID when exporting rule with operator IS_PART_OF or IS_NOT_PART_OF
    if (
        operator === OPERATOR_OPTIONS.IS_PART_OF.name ||
        operator === OPERATOR_OPTIONS.IS_NOT_PART_OF.name
    ) {
        return DataType.FILTER_UUID;
    }

    // particular case => set dataType to BOOLEAN when exporting composite rule REMOTE_REGULATED_TERMINAL with operator EXISTS or NOT_EXISTS
    if (
        fieldName === FieldType.REMOTE_REGULATED_TERMINAL &&
        (operator === OPERATOR_OPTIONS.EXISTS.name ||
            operator === OPERATOR_OPTIONS.NOT_EXISTS.name)
    ) {
        return DataType.BOOLEAN;
    }

    // otherwise, lookup in configuration
    const fieldData = getFieldData(fieldName);

    return fieldData?.dataType;
};

export const getOperators = (fieldName: string, intl: IntlShape) => {
    const field = Object.values(FIELDS_OPTIONS).find(
        (field) => field.name === fieldName
    );

    switch (field?.dataType) {
        case DataType.STRING:
            let stringOperators: OperatorOption[] = [
                OPERATOR_OPTIONS.CONTAINS,
                OPERATOR_OPTIONS.IS,
                OPERATOR_OPTIONS.BEGINS_WITH,
                OPERATOR_OPTIONS.ENDS_WITH,
                OPERATOR_OPTIONS.IN,
                OPERATOR_OPTIONS.EXISTS,
                OPERATOR_OPTIONS.NOT_EXISTS,
            ];
            if (
                field.name === FieldType.ID ||
                field.name === FieldType.VOLTAGE_LEVEL_ID ||
                field.name === FieldType.VOLTAGE_LEVEL_ID_1 ||
                field.name === FieldType.VOLTAGE_LEVEL_ID_2
            ) {
                // two additional operators when fields ID or VOLTAGE_LEVEL_ID are selected
                stringOperators.push(OPERATOR_OPTIONS.IS_PART_OF);
                stringOperators.push(OPERATOR_OPTIONS.IS_NOT_PART_OF);
            }
            if (field.name === FieldType.ID) {
                // When the ID is selected, the operators EXISTS and NOT_EXISTS must be removed.
                stringOperators = stringOperators.filter(
                    (operator) =>
                        operator !== OPERATOR_OPTIONS.EXISTS &&
                        operator !== OPERATOR_OPTIONS.NOT_EXISTS
                );
            }
            return stringOperators.map((operator) => ({
                name: operator.name,
                label: intl.formatMessage({ id: operator.label }),
            }));
        case DataType.NUMBER:
            let numberOperators: OperatorOption[] = [
                OPERATOR_OPTIONS.EQUALS,
                OPERATOR_OPTIONS.GREATER,
                OPERATOR_OPTIONS.GREATER_OR_EQUALS,
                OPERATOR_OPTIONS.LOWER,
                OPERATOR_OPTIONS.LOWER_OR_EQUALS,
                OPERATOR_OPTIONS.BETWEEN,
                OPERATOR_OPTIONS.EXISTS,
                OPERATOR_OPTIONS.NOT_EXISTS,
            ];

            return numberOperators.map((operator) => ({
                name: operator.name,
                label: intl.formatMessage({ id: operator.label }),
            }));
        case DataType.BOOLEAN:
            let booleanOperators: OperatorOption[] = [OPERATOR_OPTIONS.EQUALS];

            // particular case
            if (field.name === FieldType.AUTOMATE) {
                // take only EXISTS and NOT_EXISTS
                booleanOperators = [
                    OPERATOR_OPTIONS.EXISTS,
                    OPERATOR_OPTIONS.NOT_EXISTS,
                ];
            }
            return booleanOperators.map((operator) => ({
                name: operator.name,
                label: intl.formatMessage({ id: operator.label }),
            }));
        case DataType.ENUM:
            let enumOperators: OperatorOption[] = [
                OPERATOR_OPTIONS.EQUALS,
                OPERATOR_OPTIONS.NOT_EQUALS,
                OPERATOR_OPTIONS.IN,
            ];
            if (
                field.name === FieldType.SHUNT_COMPENSATOR_TYPE ||
                field.name === FieldType.REGULATION_TYPE ||
                field.name === FieldType.SVAR_REGULATION_MODE
            ) {
                // When one of above field is selected, the operator IN must be removed.
                enumOperators = enumOperators.filter(
                    (operator) => operator !== OPERATOR_OPTIONS.IN
                );
            }
            return enumOperators.map((operator) => ({
                name: operator.name,
                label: intl.formatMessage({ id: operator.label }),
            }));
        case DataType.PROPERTY:
            let propertiesOperators: OperatorOption[] = [OPERATOR_OPTIONS.IS];
            return propertiesOperators.map((operator) => ({
                name: operator.name,
                label: intl.formatMessage({ id: operator.label }),
            }));
        case DataType.COMBINATOR:
            const combinatorOperators: OperatorOption[] = [OPERATOR_OPTIONS.IS];

            if (field.name === FieldType.REMOTE_REGULATED_TERMINAL) {
                // add EXISTS and NOT_EXISTS
                combinatorOperators.push(OPERATOR_OPTIONS.EXISTS);
                combinatorOperators.push(OPERATOR_OPTIONS.NOT_EXISTS);
            }

            return combinatorOperators.map((operator) => ({
                name: operator.name,
                label: intl.formatMessage({ id: operator.label }),
            }));
    }
    return defaultOperators;
};

function changeValueUnit(value: any, field: FieldType) {
    if (microUnits.includes(field)) {
        if (!Array.isArray(value)) {
            return microUnitToUnit(value);
        } else {
            return value.map((a: number) => microUnitToUnit(a));
        }
    }
    return value;
}

export function exportExpertRules(query: RuleGroupType): RuleGroupTypeExport {
    function transformRule(
        rule: RuleType
    ): RuleTypeExport | RuleGroupTypeExport {
        const isValueAnArray = Array.isArray(rule.value);
        const dataType = getDataType(rule.field, rule.operator) as DataType;

        // a composite rule is a rule with dataType COMBINATOR  => build a group with child rules
        if (dataType === DataType.COMBINATOR) {
            return transformCompositeRule(rule);
        }

        // a single rule
        return {
            field: rule.field as FieldType,
            operator:
                dataType !== DataType.PROPERTY
                    ? (Object.values(OPERATOR_OPTIONS).find(
                          (operator) => operator.name === rule.operator
                      )?.customName as OperatorType)
                    : rule.value.propertyOperator,
            value:
                !isValueAnArray &&
                rule.operator !== OPERATOR_OPTIONS.EXISTS.name &&
                rule.operator !== OPERATOR_OPTIONS.NOT_EXISTS.name &&
                dataType !== DataType.PROPERTY
                    ? changeValueUnit(rule.value, rule.field as FieldType)
                    : undefined,
            values:
                isValueAnArray && dataType !== DataType.PROPERTY
                    ? changeValueUnit(rule.value, rule.field as FieldType)
                    : undefined,
            dataType: dataType,
            propertyName:
                dataType === DataType.PROPERTY
                    ? rule.value.propertyName
                    : undefined,
            propertyValues:
                dataType === DataType.PROPERTY
                    ? rule.value.propertyValues
                    : undefined,
        };
    }

    function transformCompositeRule(
        compositeRule: RuleType
    ): RuleGroupTypeExport {
        const compositeGroup = compositeRule.value as CompositeGroup;
        const transformedRules = Object.entries(compositeGroup.rules).map(
            ([field, rule]) =>
                transformRule({
                    ...rule,
                    field: field,
                    operator: rule.operator,
                    value: rule.value,
                })
        );

        return {
            combinator: compositeGroup.combinator as CombinatorType,
            dataType: DataType.COMBINATOR,
            rules: transformedRules,
            // two additional attributes to distinct a composite rule from a normal rule group
            operator: Object.values(OPERATOR_OPTIONS).find(
                (operator) => operator.name === compositeRule.operator
            )?.customName as OperatorType,
            field: compositeRule.field as FieldType,
        };
    }

    function transformGroup(group: RuleGroupType): RuleGroupTypeExport {
        // Recursively transform the rules within the group
        const transformedRules = group.rules.map((ruleOrGroup) => {
            if ('rules' in ruleOrGroup) {
                return transformGroup(ruleOrGroup);
            } else {
                return transformRule(ruleOrGroup);
            }
        });

        return {
            combinator: group.combinator as CombinatorType,
            dataType: DataType.COMBINATOR,
            rules: transformedRules,
        };
    }

    return transformGroup(query);
}

export function importExpertRules(query: RuleGroupTypeExport): RuleGroupType {
    function parseValue(rule: RuleTypeExport) {
        if (rule.propertyName) {
            return {
                propertyName: rule.propertyName,
                propertyValues: rule.propertyValues,
                propertyOperator: rule.operator,
            };
        } else if (rule.values) {
            // values is a Set on server side, so need to sort
            if (rule.dataType === DataType.NUMBER) {
                return rule.values
                    .map((value) => parseFloat(value as string))
                    .map((numberValue) => {
                        return microUnits.includes(rule.field)
                            ? unitToMicroUnit(numberValue)!
                            : numberValue;
                    })
                    .sort((a, b) => a - b);
            } else {
                return rule.values.sort();
            }
        } else {
            return microUnits.includes(rule.field)
                ? unitToMicroUnit(parseFloat(rule.value as string))
                : rule.value;
        }
    }

    function transformRule(rule: RuleTypeExport): RuleType {
        return {
            field: rule.field,
            operator:
                rule.dataType !== DataType.PROPERTY
                    ? (Object.values(OPERATOR_OPTIONS).find(
                          (operator) => operator.customName === rule.operator
                      )?.name as string)
                    : OPERATOR_OPTIONS.IS.name,
            value: parseValue(rule),
        };
    }

    function transformCompositeGroup(group: RuleGroupTypeExport): RuleType {
        const transformedRules = group.rules
            .map((rule) => transformRule(rule as RuleTypeExport))
            .reduce(
                (obj, transformedRule) => ({
                    ...obj,
                    [transformedRule.field]: {
                        operator: transformedRule.operator,
                        value: transformedRule.value,
                    },
                }),
                {}
            );

        return {
            field: group.field as FieldType,
            operator: Object.values(OPERATOR_OPTIONS).find(
                (operator) => operator.customName === group.operator
            )?.name as string,
            value: {
                combinator: group.combinator,
                rules: transformedRules,
            },
        };
    }

    function transformGroup(group: RuleGroupTypeExport): RuleGroupType {
        // Recursively transform the rules within the group
        const transformedRules = group.rules.map((ruleOrGroup) => {
            if ('rules' in ruleOrGroup) {
                // a composite group => aggregate into a composite rule
                if ('field' in ruleOrGroup && 'operator' in ruleOrGroup) {
                    return transformCompositeGroup(
                        ruleOrGroup as RuleGroupTypeExport
                    );
                }
                // a normal group
                return transformGroup(ruleOrGroup as RuleGroupTypeExport);
            } else {
                return transformRule(ruleOrGroup as RuleTypeExport);
            }
        });

        return {
            combinator: group.combinator,
            rules: transformedRules,
        };
    }

    return transformGroup(query);
}

export function countRules(query: RuleGroupTypeAny): number {
    if ('rules' in query) {
        const group = query as RuleGroupType;
        return group.rules.reduce(
            (sum, ruleOrGroup) =>
                sum + countRules(ruleOrGroup as RuleGroupTypeAny),
            0
        );
    } else {
        return 1;
    }
}

export const testQuery = (check: string, query: RuleGroupTypeAny): boolean => {
    const queryValidatorResult = queryValidator(query);
    return !Object.values(queryValidatorResult).some((ruleValidation) => {
        if (typeof ruleValidation !== 'boolean' && ruleValidation.reasons) {
            return ruleValidation.reasons.includes(check);
        }
        return false;
    });
};

// Fork of defaultValidator of the react-query-builder to validate rules and groups
export const queryValidator: QueryValidator = (query) => {
    const result: ValidationMap = {};

    const validateRule = (rule: RuleType) => {
        const isValueAnArray = Array.isArray(rule.value);
        const dataType = getDataType(rule.field, rule.operator);

        const isNumberInput = dataType === DataType.NUMBER && !isValueAnArray;
        const isStringInput = dataType === DataType.STRING && !isValueAnArray;

        if (
            rule.id &&
            (rule.operator === OPERATOR_OPTIONS.EXISTS.name ||
                rule.operator === OPERATOR_OPTIONS.NOT_EXISTS.name)
        ) {
            // In the case of (NOT_)EXISTS operator, because we do not have a second value to evaluate, we force a valid result.
            result[rule.id] = {
                valid: true,
                reasons: undefined,
            };
        } else if (rule.id && rule.operator === OPERATOR_OPTIONS.BETWEEN.name) {
            if (!rule.value?.[0] || !rule.value?.[1]) {
                result[rule.id] = {
                    valid: false,
                    reasons: [RULES.EMPTY_RULE],
                };
            } else if (
                isNaN(parseFloat(rule.value[0])) ||
                isNaN(parseFloat(rule.value[1]))
            ) {
                result[rule.id] = {
                    valid: false,
                    reasons: [RULES.INCORRECT_RULE],
                };
            } else if (parseFloat(rule.value[0]) >= parseFloat(rule.value[1])) {
                result[rule.id] = {
                    valid: false,
                    reasons: [RULES.BETWEEN_RULE],
                };
            }
        } else if (
            rule.id &&
            rule.operator === OPERATOR_OPTIONS.IN.name &&
            !rule.value?.length
        ) {
            result[rule.id] = {
                valid: false,
                reasons: [RULES.EMPTY_RULE],
            };
        } else if (
            rule.id &&
            isStringInput &&
            (rule.value || '').trim() === ''
        ) {
            result[rule.id] = {
                valid: false,
                reasons: [RULES.EMPTY_RULE],
            };
        } else if (rule.id && isNumberInput && isNaN(parseFloat(rule.value))) {
            result[rule.id] = {
                valid: false,
                reasons: [RULES.INCORRECT_RULE],
            };
        } else if (
            rule.id &&
            dataType === DataType.FILTER_UUID &&
            (!rule.value?.length || !uuidValidate(rule.value[0]))
        ) {
            result[rule.id] = {
                valid: false,
                reasons: [RULES.EMPTY_RULE],
            };
        } else if (
            rule.id &&
            dataType === DataType.PROPERTY &&
            (isBlankOrEmpty(rule.value?.propertyName) ||
                isBlankOrEmpty(rule.value?.propertyOperator) ||
                isBlankOrEmpty(rule.value?.propertyValues) ||
                !rule.value?.propertyValues?.length)
        ) {
            result[rule.id] = {
                valid: false,
                reasons: [RULES.EMPTY_RULE],
            };
        } else if (rule.id && dataType === DataType.COMBINATOR) {
            // based on FIELDS_OPTIONS configuration and composite group, validate for each children composite rule in a composite group
            const childrenFields = Object.keys(
                getFieldData(rule.field).children ?? {}
            );
            const compositeGroup = rule.value as CompositeGroup;

            // call validate recursively
            childrenFields.forEach((field) => {
                validateRule({
                    ...rule,
                    field: field,
                    operator: compositeGroup?.rules?.[field]?.operator,
                    value: compositeGroup?.rules?.[field]?.value,
                });
            });
        }
    };
    const validateGroup = (ruleGroup: RuleGroupTypeAny) => {
        const reasons: any[] = [];
        if (ruleGroup.rules.length === 0) {
            reasons.push(RULES.EMPTY_GROUP);
        }
        if (ruleGroup.id) {
            if (reasons.length) {
                result[ruleGroup.id] = { valid: false, reasons };
            } else {
                result[ruleGroup.id] = true;
            }
        }
        ruleGroup.rules.forEach((rule) => {
            if (typeof rule === 'string') {
                // Validation for this case was done earlier
            } else if ('rules' in rule) {
                validateGroup(rule);
            } else {
                validateRule(rule);
            }
        });
    };
    validateGroup(query);

    return result;
};

// Remove a rule or group and its parents if they become empty
export function recursiveRemove(
    query: RuleGroupTypeAny,
    path: number[]
): RuleGroupTypeAny {
    // If it's an only child, we also need to remove and check the parent group (but not the root)
    if (
        getNumberOfSiblings(path, query) === 1 &&
        path.toString() !== [0].toString()
    ) {
        return recursiveRemove(query, getParentPath(path));
    }
    // Otherwise, we can safely remove it
    else {
        return remove(query, path);
    }
}

// cf path concept https://react-querybuilder.js.org/docs/tips/path
export function getNumberOfSiblings(path: number[], query: RuleGroupTypeAny) {
    // Get the path of this rule's parent group
    const parentPath = getParentPath(path);
    // Find the parent group object in the query
    const parentGroup = findPath(parentPath, query) as RuleGroupType;
    // Return the number of siblings
    return parentGroup.rules.length;
}
