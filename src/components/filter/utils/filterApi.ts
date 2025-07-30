/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { Generator, Load } from '../../../utils/types/equipmentTypes';
import { exportExpertRules } from '../expert/expertFilterUtils';
import { DISTRIBUTION_KEY, FilterType } from '../constants/FilterConstants';
import { createFilter, saveFilter } from '../../../services/explore';
import { catchErrorHandler } from '../../../services';

export const saveExplicitNamingFilter = (
    tableValues: any[],
    isFilterCreation: boolean,
    equipmentType: string,
    name: string,
    description: string,
    id: string | null,
    setCreateFilterErr: (value?: string) => void,
    handleClose: () => void,
    activeDirectory?: UUID,
    token?: string
) => {
    // we remove unnecessary fields from the table
    let cleanedTableValues;
    const isGeneratorOrLoad = equipmentType === Generator.type || equipmentType === Load.type;
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
                id: null,
                type: FilterType.EXPLICIT_NAMING.id,
                equipmentType,
                filterEquipmentsAttributes: cleanedTableValues,
            },
            name,
            description,
            activeDirectory,
            token
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
                id,
                type: FilterType.EXPLICIT_NAMING.id,
                equipmentType,
                filterEquipmentsAttributes: cleanedTableValues,
            },
            name,
            description,
            token
        )
            .then(() => {
                handleClose();
            })
            .catch((error) => {
                setCreateFilterErr(error.message);
            });
    }
};
export const saveExpertFilter = (
    id: string | null,
    query: any,
    equipmentType: string,
    name: string,
    description: string,
    isFilterCreation: boolean,
    activeDirectory: UUID | undefined | null,
    onClose: () => void,
    onError: (message: string) => void,
    token?: string
) => {
    if (isFilterCreation) {
        createFilter(
            {
                id: null,
                type: FilterType.EXPERT.id,
                equipmentType,
                rules: exportExpertRules(query),
            },
            name,
            description,
            activeDirectory,
            token
        )
            .then(() => {
                onClose();
            })
            .catch((error: unknown) => {
                catchErrorHandler(error, (message: string) => {
                    onError(message);
                });
            });
    } else {
        saveFilter(
            {
                id,
                type: FilterType.EXPERT.id,
                equipmentType,
                rules: exportExpertRules(query),
            },
            name,
            description,
            token
        )
            .then(() => {
                onClose();
            })
            .catch((error: unknown) => {
                catchErrorHandler(error, (message: string) => {
                    onError(message);
                });
            });
    }
};
