/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FullField } from 'react-querybuilder';
import type { UUID } from 'node:crypto';
import { FieldType } from '../../../utils/types/fieldType';

export enum OperatorType {
    EQUALS = 'EQUALS',
    NOT_EQUALS = 'NOT_EQUALS',
    LOWER = 'LOWER',
    LOWER_OR_EQUALS = 'LOWER_OR_EQUALS',
    GREATER = 'GREATER',
    GREATER_OR_EQUALS = 'GREATER_OR_EQUALS',
    BETWEEN = 'BETWEEN',
    IN = 'IN',
    NOT_IN = 'NOT_IN',
    IS = 'IS',
    CONTAINS = 'CONTAINS',
    BEGINS_WITH = 'BEGINS_WITH',
    ENDS_WITH = 'ENDS_WITH',
    EXISTS = 'EXISTS',
    NOT_EXISTS = 'NOT_EXISTS',
    IS_PART_OF = 'IS_PART_OF',
    IS_NOT_PART_OF = 'IS_NOT_PART_OF',
}

export enum CombinatorType {
    AND = 'AND',
    OR = 'OR',
}

export enum DataType {
    STRING = 'STRING',
    ENUM = 'ENUM',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    COMBINATOR = 'COMBINATOR',
    FILTER_UUID = 'FILTER_UUID',
    PROPERTY = 'PROPERTIES',
}

export type OperatorOption = {
    name: string;
    customName: string;
    label: string;
};

// This type is equivalent to a (partial) union type of BooleanExpertRule,
// NumberExpertRule, StringExpertRule, PropertiesExpertRule in filter library
export interface RuleTypeExport {
    id?: UUID;
    field: FieldType;
    operator: OperatorType;
    value: string | number | undefined;
    values: string[] | number[] | undefined;
    dataType: DataType;
    propertyName?: string;
    propertyValues?: string[];
}

// This type is equivalent to CombinatorExpertRule in filter library
export interface RuleGroupTypeExport {
    id?: UUID;
    combinator: CombinatorType;
    dataType: DataType;
    field?: FieldType; // used in case of composite rule
    operator?: OperatorType; // used in case of composite rule
    rules: (RuleTypeExport | RuleGroupTypeExport)[];
}

// typing composite rule schema
export interface CompositeField extends FullField {
    combinator?: string;
    children?: { [field: string]: FullField };
}

// typing composite rule value
export interface CompositeGroup {
    id?: string;
    combinator: string;
    rules: {
        [field: string]: CompositeRule;
    };
}

export interface CompositeRule {
    operator: string;
    value: any;
}
