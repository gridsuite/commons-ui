/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { EquipmentDeletionDto, LccDeletionDto, LccShuntCompensatorConnectionDto } from '../equipmentDeletion.types';
import { FieldConstants, snackWithFallback } from '../../../../utils';
import { useSnackMessage } from '../../../../hooks';

export interface UseHvdcLccDeletionProps {
    fetchHvdcWithShuntCompensators?: (hvdcLineId: UUID) => Promise<LccDeletionDto>;
}

export const useHvdcLccDeletion = ({ fetchHvdcWithShuntCompensators }: UseHvdcLccDeletionProps) => {
    const { replace: replaceMcsList1 } = useFieldArray({
        name: `${FieldConstants.DELETION_SPECIFIC_DATA}.${FieldConstants.SHUNT_COMPENSATOR_SIDE_1}`,
    });
    const { replace: replaceMcsList2 } = useFieldArray({
        name: `${FieldConstants.DELETION_SPECIFIC_DATA}.${FieldConstants.SHUNT_COMPENSATOR_SIDE_2}`,
    });
    const { setValue } = useFormContext();
    const { snackError } = useSnackMessage();

    const updateMcsLists = useCallback(
        (hvdcLineData: LccDeletionDto, editData?: EquipmentDeletionDto) => {
            function mergeMcsLists(
                dynamicList: LccShuntCompensatorConnectionDto[],
                editList: LccShuntCompensatorConnectionDto[]
            ) {
                if (!dynamicList?.length && !editList?.length) {
                    return [];
                }
                if (!dynamicList?.length) {
                    // TODO: we should refactor modification-server to store only selected MCS
                    return editList.filter((item) => item.connectedToHvdc);
                }
                if (!editList?.length) {
                    return dynamicList;
                }
                // dynamicList and editList are not empty : let's merge them
                const mergedList: LccShuntCompensatorConnectionDto[] = dynamicList.map((obj) => {
                    return { ...obj, connectedToHvdc: false };
                });
                // now overwrite dynamic values with edited modification values
                const dynamicIds = new Set(dynamicList.map((obj) => obj.id));
                editList.forEach((editObj) => {
                    if (dynamicIds.has(editObj.id)) {
                        const mergedObj = mergedList.find((obj) => obj.id === editObj.id);
                        if (mergedObj) {
                            mergedObj.connectedToHvdc = editObj.connectedToHvdc;
                        }
                    } else if (editObj.connectedToHvdc) {
                        // if a selected edit data does not exist at this time, we add/display it anyway
                        mergedList.push(editObj);
                    }
                });
                return mergedList;
            }

            if (
                hvdcLineData?.mcsOnSide1 ||
                hvdcLineData?.mcsOnSide2 ||
                editData?.equipmentInfos?.mcsOnSide1 ||
                editData?.equipmentInfos?.mcsOnSide2
            ) {
                setValue(
                    `${FieldConstants.DELETION_SPECIFIC_DATA}.${FieldConstants.DELETION_SPECIFIC_TYPE}`,
                    FieldConstants.HVDC_LINE_LCC_DELETION_SPECIFIC_TYPE
                );
                replaceMcsList1(mergeMcsLists(hvdcLineData?.mcsOnSide1, editData?.equipmentInfos?.mcsOnSide1 ?? []));
                replaceMcsList2(mergeMcsLists(hvdcLineData?.mcsOnSide2, editData?.equipmentInfos?.mcsOnSide2 ?? []));
            } else {
                setValue(FieldConstants.DELETION_SPECIFIC_DATA, null);
            }
        },
        [replaceMcsList1, replaceMcsList2, setValue]
    );

    const specificUpdate = useCallback(
        (equipmentId: UUID, editData?: EquipmentDeletionDto) => {
            if (fetchHvdcWithShuntCompensators) {
                fetchHvdcWithShuntCompensators(equipmentId)
                    .then((hvdcLineData) => {
                        updateMcsLists(hvdcLineData, editData);
                    })
                    .catch((error: unknown) => {
                        setValue(FieldConstants.DELETION_SPECIFIC_DATA, null);
                        snackWithFallback(snackError, error, { headerId: 'FetchHvdcLineWithShuntCompensatorsError' });
                    });
            } else {
                updateMcsLists({} as LccDeletionDto, editData);
            }
        },
        [fetchHvdcWithShuntCompensators, setValue, snackError, updateMcsLists]
    );

    return { specificUpdate };
};
