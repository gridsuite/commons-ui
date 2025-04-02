/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const filterEn = {
    OR: 'OR',
    AND: 'AND',
    rule: 'criterion',
    subGroup: 'subgroup',
    is: 'is',
    contains: 'contains',
    beginsWith: 'begins with',
    endsWith: 'ends with',
    exists: 'exists',
    not_exists: 'not exists',
    between: 'between',
    in: 'is in',
    notIn: 'is not in',
    inFilter: 'in filter',
    notInFilter: 'not in filter',
    emptyRule: 'Filter contains an empty field',
    incorrectRule: 'Filter contains an incorrect field',
    obsoleteFilter: 'This filter is no longer supported. Please remove it or change its equipment type.',
    betweenRule: "Left value of 'between' criterion has to be lower than the right value",
    emptyGroup: 'Filter contains an empty group. Consider removing it or adding criteria to this group',
    Hvdc: 'HVDC',
    'filter.expert': 'Criteria based',
    'filter.explicitNaming': 'Explicit naming',
    nameEmpty: 'The name is empty',
    equipmentType: 'Equipment type',
    changeTypeMessage: 'The equipment type will be changed and the current configuration will be erased.',
    PropertyValues: 'Property values',
    PropertyValues1: 'Property values 1',
    PropertyValues2: 'Property values 2',
    FreePropsCrit: 'By properties filtering',
    AddFreePropCrit: 'Add a filtering by property',
    FreeProps: 'Equipment properties',
    SubstationFreeProps: 'Equipment substation properties',
    YupRequired: 'This field is required',
    filterPropertiesNameUniquenessError: 'It is not possible to add multiple filters for the same property',
    emptyFilterError: 'Filter should contain at least one equipment',
    distributionKeyWithMissingIdError: 'Missing ID with defined distribution key',
    missingDistributionKeyError: 'Missing distribution key',
    filterCsvFileName: 'filterCreation',
    createNewFilter: 'Create a filter',
    createNewExpertFilter: 'Create a criterium filter',
    createNewExplicitNamingFilter: 'Create a explicit naming filter',
    nameProperty: 'Name',
    Countries: 'Countries',
    Countries1: 'Countries 1',
    Countries2: 'Countries 2',
    nominalVoltage: 'Nominal voltage',
    EnergySourceText: 'Energy source',
    nameAlreadyUsed: 'This name is already used',
    nameValidityCheckErrorMsg: 'Error while checking name validity',
    cantSubmitWhileValidating: 'Impossible to submit the form while validating a field',
};
