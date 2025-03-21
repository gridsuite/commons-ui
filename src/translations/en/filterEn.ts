/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const filterEn = defineMessages({
    OR: { defaultMessage: 'OR' },
    AND: { defaultMessage: 'AND' },
    rule: { defaultMessage: 'criterion' },
    subGroup: { defaultMessage: 'subgroup' },
    is: { defaultMessage: 'is' },
    contains: { defaultMessage: 'contains' },
    beginsWith: { defaultMessage: 'begins with' },
    endsWith: { defaultMessage: 'ends with' },
    exists: { defaultMessage: 'exists' },
    not_exists: { defaultMessage: 'not exists' },
    between: { defaultMessage: 'between' },
    in: { defaultMessage: 'is in' },
    notIn: { defaultMessage: 'is not in' },
    inFilter: { defaultMessage: 'in filter' },
    notInFilter: { defaultMessage: 'not in filter' },
    emptyRule: { defaultMessage: 'Filter contains an empty field' },
    incorrectRule: { defaultMessage: 'Filter contains an incorrect field' },
    obsoleteFilter: {
        defaultMessage: 'This filter is no longer supported. Please remove it or change its equipment type.',
    },
    betweenRule: { defaultMessage: "Left value of 'between' criterion has to be lower than the right value" },
    emptyGroup: {
        defaultMessage: 'Filter contains an empty group. Consider removing it or adding criteria to this group',
    },
    Hvdc: { defaultMessage: 'HVDC' },
    'filter.expert': { defaultMessage: 'Criteria based' },
    'filter.explicitNaming': { defaultMessage: 'Explicit naming' },
    nameEmpty: { defaultMessage: 'The name is empty' },
    equipmentType: { defaultMessage: 'Equipment type' },
    changeTypeMessage: {
        defaultMessage: 'The equipment type will be changed and the current configuration will be erased.',
    },
    PropertyValues: { defaultMessage: 'Property values' },
    PropertyValues1: { defaultMessage: 'Property values 1' },
    PropertyValues2: { defaultMessage: 'Property values 2' },
    FreePropsCrit: { defaultMessage: 'By properties filtering' },
    AddFreePropCrit: { defaultMessage: 'Add a filtering by property' },
    FreeProps: { defaultMessage: 'Equipment properties' },
    SubstationFreeProps: { defaultMessage: 'Equipment substation properties' },
    YupRequired: { defaultMessage: 'This field is required' },
    filterPropertiesNameUniquenessError: {
        defaultMessage: 'It is not possible to add multiple filters for the same property',
    },
    emptyFilterError: { defaultMessage: 'Filter should contain at least one equipment' },
    distributionKeyWithMissingIdError: { defaultMessage: 'Missing ID with defined distribution key' },
    missingDistributionKeyError: { defaultMessage: 'Missing distribution key' },
    filterCsvFileName: { defaultMessage: 'filterCreation' },
    createNewFilter: { defaultMessage: 'Create a filter' },
    nameProperty: { defaultMessage: 'Name' },
    Countries: { defaultMessage: 'Countries' },
    Countries1: { defaultMessage: 'Countries 1' },
    Countries2: { defaultMessage: 'Countries 2' },
    nominalVoltage: { defaultMessage: 'Nominal voltage' },
    EnergySourceText: { defaultMessage: 'Energy source' },
    nameAlreadyUsed: { defaultMessage: 'This name is already used' },
    nameValidityCheckErrorMsg: { defaultMessage: 'Error while checking name validity' },
    cantSubmitWhileValidating: { defaultMessage: 'Impossible to submit the form while validating a field' },
});
