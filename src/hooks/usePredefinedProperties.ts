/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { equipmentTypesForPredefinedPropertiesMapper } from '../utils/mapper/equipmentTypesForPredefinedPropertiesMapper';
import { useSnackMessage } from './useSnackMessage';
import { PredefinedProperties } from '../utils/types/types';
import { fetchStudyMetadata } from '../services';
import { EquipmentType } from '../utils';

const fetchPredefinedProperties = async (
    equipmentType: EquipmentType,
    propertyField: string | null
): Promise<PredefinedProperties | undefined> => {
    const networkEquipmentType = equipmentTypesForPredefinedPropertiesMapper(equipmentType, propertyField);
    if (networkEquipmentType === undefined) {
        return Promise.resolve(undefined);
    }
    const studyMetadata = await fetchStudyMetadata();
    return studyMetadata.predefinedEquipmentProperties?.[networkEquipmentType];
};

export const usePredefinedProperties = (
    initialType: EquipmentType | null,
    editedField: string | null = null
): [PredefinedProperties, Dispatch<SetStateAction<EquipmentType | null>>, Dispatch<SetStateAction<string | null>>] => {
    const [type, setType] = useState<EquipmentType | null>(initialType);
    const [propertyField, setPropertyField] = useState<string | null>(editedField);
    const [equipmentPredefinedProps, setEquipmentPredefinedProps] = useState<PredefinedProperties>({});
    const { snackError } = useSnackMessage();

    useEffect(() => {
        if (type !== null) {
            fetchPredefinedProperties(type, propertyField)
                .then((p) => {
                    if (p !== undefined) {
                        setEquipmentPredefinedProps(p);
                    }
                })
                .catch((error) => {
                    snackError({
                        messageTxt: error.message ?? error,
                    });
                });
        }
    }, [type, setEquipmentPredefinedProps, snackError, propertyField]);

    return [equipmentPredefinedProps, setType, setPropertyField];
};
