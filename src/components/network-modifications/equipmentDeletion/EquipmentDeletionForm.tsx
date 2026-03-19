/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { UUID } from 'node:crypto';
import { EquipmentDeletionDto, HvdcLccDeletionInfos } from './equipmentDeletion.types';
import useHvdcLccDeletion from './hvdcLccDeletion/useHvdcLccDeletion';
import {
    areIdsEqual,
    EquipmentType,
    FieldConstants,
    getObjectId,
    richTypeEquals,
    snackWithFallback,
} from '../../../utils';
import { filledTextField } from '../common';
import { AutocompleteInput } from '../../inputs';
import { useSnackMessage } from '../../../hooks';
import { HvdcLccDeletionSpecificForm } from './hvdcLccDeletion/HvdcLccDeletionSpecificForm';
import GridItem from '../../grid/grid-item';
import { useGetLabelEquipmentTypes } from '../../../hooks/useGetLabelEquipmentTypes';

export interface EquipmentDeletionFormProps {
    editData?: EquipmentDeletionDto;
    fetchEquipmentIds?: (eqptType: EquipmentType) => Promise<string[]>;
    fetchHvdcWithShuntCompensators?: (hvdcLineId: UUID) => Promise<HvdcLccDeletionInfos>;
}

const NULL_UUID: UUID = '00000000-0000-0000-0000-000000000000';

export function EquipmentDeletionForm({
    editData,
    fetchEquipmentIds,
    fetchHvdcWithShuntCompensators,
}: Readonly<EquipmentDeletionFormProps>) {
    const { snackError } = useSnackMessage();
    const editedIdRef = useRef<UUID | null>(null);
    const currentTypeRef = useRef<EquipmentType>(null);

    const watchType = useWatch({
        name: FieldConstants.TYPE,
    });
    const watchEquipmentId = useWatch({
        name: FieldConstants.EQUIPMENT_ID,
    });
    const watchSpecificData = useWatch({
        name: FieldConstants.DELETION_SPECIFIC_DATA,
    });
    const { specificUpdate: hvdcLccSpecificUpdate } = useHvdcLccDeletion({ fetchHvdcWithShuntCompensators });
    const {
        setValue,
        formState: { isDirty, dirtyFields },
    } = useFormContext();

    const getOptionLabel = useGetLabelEquipmentTypes();

    const [equipmentsOptions, setEquipmentsOptions] = useState<string[]>([]);

    const typesOptions = useMemo(() => {
        const equipmentTypesToExclude = new Set([
            EquipmentType.SWITCH,
            EquipmentType.LCC_CONVERTER_STATION,
            EquipmentType.VSC_CONVERTER_STATION,
            EquipmentType.HVDC_CONVERTER_STATION,
            EquipmentType.BUS,
            EquipmentType.BUSBAR_SECTION,
            EquipmentType.TIE_LINE,
            EquipmentType.BREAKER,
            EquipmentType.DISCONNECTOR,
        ]);
        return Object.values(EquipmentType).filter((equipmentType) => !equipmentTypesToExclude.has(equipmentType));
    }, []);

    useEffect(() => {
        setEquipmentsOptions([]);
        let ignore = false;

        if (watchType && fetchEquipmentIds) {
            if (watchType !== currentTypeRef.current) {
                currentTypeRef.current = watchType;
            }
            fetchEquipmentIds(watchType)
                .then((equipmentIds) => {
                    if (!ignore) {
                        setEquipmentsOptions(
                            equipmentIds.toSorted((equipment1, equipment2) => equipment1.localeCompare(equipment2))
                        );
                    }
                })
                .catch((error: unknown) => {
                    snackWithFallback(snackError, error, { headerId: 'equipmentsLoadingError' });
                });
        }

        return () => {
            ignore = true;
        };
    }, [fetchEquipmentIds, snackError, watchType]);

    useEffect(() => {
        if (!fetchHvdcWithShuntCompensators && isDirty && dirtyFields[FieldConstants.EQUIPMENT_ID]) {
            // without a study network, we clean the MCS lists when the equipmentId is manually change (or reset after equipment type manual change)
            setValue(FieldConstants.DELETION_SPECIFIC_DATA, null);
        }
    }, [fetchHvdcWithShuntCompensators, isDirty, dirtyFields, setValue]);

    useEffect(() => {
        if (!fetchHvdcWithShuntCompensators) {
            // without a study network, we can not merge editData with dynamic data
            return;
        }
        if (editData?.equipmentId) {
            if (editedIdRef.current === null) {
                // The first time we render an edition, we want to merge the
                // dynamic data with the edition data coming from the database
                editedIdRef.current = editData.equipmentId;
            } else if (watchEquipmentId !== editedIdRef.current && editedIdRef.current !== NULL_UUID) {
                // we have changed eqptId, leave the "first edit" mode (then if we circle back
                // to editData?.equipmentId, we won't make the merge anymore).
                editedIdRef.current = NULL_UUID;
            }
        }

        if (watchEquipmentId && currentTypeRef.current === EquipmentType.HVDC_LINE) {
            // need specific update related to HVDC LCC deletion (for MCS lists)
            hvdcLccSpecificUpdate(watchEquipmentId, watchEquipmentId === editedIdRef.current ? editData : undefined);
        } else {
            setValue(FieldConstants.DELETION_SPECIFIC_DATA, null);
        }
    }, [editData, fetchHvdcWithShuntCompensators, hvdcLccSpecificUpdate, setValue, snackError, watchEquipmentId]);

    const handleTypeChange = useCallback(() => {
        setValue(FieldConstants.EQUIPMENT_ID, null);
    }, [setValue]);

    const equipmentTypeField = (
        <AutocompleteInput
            isOptionEqualToValue={richTypeEquals}
            name={FieldConstants.TYPE}
            label="Type"
            options={typesOptions}
            onChangeCallback={handleTypeChange}
            getOptionLabel={getOptionLabel}
            size="small"
            inputTransform={(value) => typesOptions.find((option) => option === value) || value}
            formProps={filledTextField}
        />
    );

    const equipmentField = (
        <AutocompleteInput
            isOptionEqualToValue={areIdsEqual}
            allowNewValue
            forcePopupIcon
            name={FieldConstants.EQUIPMENT_ID}
            label="ID"
            options={equipmentsOptions}
            getOptionLabel={getObjectId}
            // hack to work with freesolo autocomplete
            // setting null programmatically when freesolo is enable won't empty the field
            inputTransform={(value) => value ?? ''}
            outputTransform={(value: any) => (value === '' ? null : getObjectId(value))}
            size="small"
            formProps={filledTextField}
        />
    );

    return (
        <>
            <Grid container spacing={2}>
                <GridItem>{equipmentTypeField}</GridItem>
                <GridItem>{equipmentField}</GridItem>
            </Grid>
            {watchSpecificData?.specificType === FieldConstants.HVDC_LINE_LCC_DELETION_SPECIFIC_TYPE && (
                <HvdcLccDeletionSpecificForm />
            )}
        </>
    );
}
