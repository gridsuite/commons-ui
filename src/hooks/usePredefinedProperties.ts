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

const fetchPredefinedProperties = async (equipmentType: EquipmentType): Promise<PredefinedProperties | undefined> => {
    const networkEquipmentType = equipmentTypesForPredefinedPropertiesMapper(equipmentType);
    if (networkEquipmentType === undefined) {
        return Promise.resolve(undefined);
    }
    const studyMetadata = await fetchStudyMetadata();
    return studyMetadata.predefinedEquipmentProperties?.[networkEquipmentType];
};

export const usePredefinedProperties = (
    initialType: EquipmentType | null
): [PredefinedProperties, Dispatch<SetStateAction<EquipmentType | null>>] => {
    const [type, setType] = useState<EquipmentType | null>(initialType);
    const [equipmentPredefinedProps, setEquipmentPredefinedProps] = useState<PredefinedProperties>({});
    const { snackError } = useSnackMessage();

    useEffect(() => {
        if (type !== null) {
            fetchPredefinedProperties(type)
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
    }, [type, setEquipmentPredefinedProps, snackError]);

    return [equipmentPredefinedProps, setType];
};
