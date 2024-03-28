/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FilterType, FieldConstants } from './constants/field-constants';
import { frontToBackTweak } from './criteria-based/criteria-based-filter-utils';
import { Generator, Load } from './constants/equipment-types';
import { DISTRIBUTION_KEY } from './explicit-naming/explicit-naming-filter-form';
import { exportExpertRules } from './expert/expert-filter-utils';

export const saveExplicitNamingFilter = (
    tableValues: any[],
    isFilterCreation: boolean,
    equipmentType: string,
    name: string,
    description: string,
    id: string | null,
    setCreateFilterErr: (value: any) => void,
    activeDirectory: any,
    handleClose: () => void,
    createFilter: (
        filter: any,
        name: string,
        description: string,
        activeDirectory: any
    ) => Promise<any>,
    saveFilter: (filter: any, name: string) => Promise<any>
) => {
    // we remove unnecessary fields from the table
    let cleanedTableValues;
    const isGeneratorOrLoad =
        equipmentType === Generator.type || equipmentType === Load.type;
    if (isGeneratorOrLoad) {
        cleanedTableValues = tableValues.map((row) => ({
            [FieldConstants.EQUIPMENT_ID]: row[FieldConstants.EQUIPMENT_ID],
            [DISTRIBUTION_KEY]: row[DISTRIBUTION_KEY],
        }));
    } else {
        cleanedTableValues = tableValues.map((row) => ({
            [FieldConstants.EQUIPMENT_ID]: row[FieldConstants.EQUIPMENT_ID],
        }));
    }
    if (isFilterCreation) {
        createFilter(
            {
                type: FilterType.EXPLICIT_NAMING.id,
                equipmentType: equipmentType,
                filterEquipmentsAttributes: cleanedTableValues,
            },
            name,
            description,
            activeDirectory
        )
            .then(() => {
                handleClose();
            })
            .catch((error) => {
                setCreateFilterErr(error.message);
            });
    } else {
        saveFilter(
            {
                id: id,
                type: FilterType.EXPLICIT_NAMING.id,
                equipmentType: equipmentType,
                filterEquipmentsAttributes: cleanedTableValues,
            },
            name
        )
            .then(() => {
                handleClose();
            })
            .catch((error) => {
                setCreateFilterErr(error.message);
            });
    }
};

export const saveCriteriaBasedFilter = (
    filter: any,
    activeDirectory: any,
    onClose: () => void,
    onError: (message: string) => void,
    createFilter: (
        filter: any,
        name: string,
        description: string,
        activeDirectory: any
    ) => Promise<any>
) => {
    const filterForBack = frontToBackTweak(undefined, filter); // no need ID for creation
    createFilter(
        filterForBack,
        filter[FieldConstants.NAME],
        filter[FieldConstants.DESCRIPTION],
        activeDirectory
    )
        .then(() => {
            onClose();
        })
        .catch((error) => {
            onError(error.message);
        });
};

export const saveExpertFilter = (
    id: string | null,
    query: any,
    equipmentType: string,
    name: string,
    description: string,
    isFilterCreation: boolean,
    activeDirectory: any,
    onClose: () => void,
    onError: (message: string) => void,
    createFilter: (
        filter: any,
        name: string,
        description: string,
        activeDirectory: any
    ) => Promise<any>,
    saveFilter: (filter: any, name: string) => Promise<any>
) => {
    if (isFilterCreation) {
        createFilter(
            {
                type: FilterType.EXPERT.id,
                equipmentType: equipmentType,
                rules: exportExpertRules(query),
            },
            name,
            description,
            activeDirectory
        )
            .then(() => {
                onClose();
            })
            .catch((error: any) => {
                onError(error.message);
            });
    } else {
        saveFilter(
            {
                id: id,
                type: FilterType.EXPERT.id,
                equipmentType: equipmentType,
                rules: exportExpertRules(query),
            },
            name
        )
            .then(() => {
                onClose();
            })
            .catch((error: any) => {
                onError(error.message);
            });
    }
};
