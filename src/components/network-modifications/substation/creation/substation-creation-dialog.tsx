/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { UUID } from 'node:crypto';
import { SubstationCreationForm } from './substation-creation-form';
import { useFormSearchCopy, useOpenShortWaitFetching, useSnackMessage } from '../../../../hooks';
import {
    DeepNullable,
    EquipmentType,
    FetchStatus,
    FieldConstants,
    FORM_LOADING_DELAY,
    snackWithFallback,
} from '../../../../utils';
import { CustomFormProvider } from '../../../inputs';
import yup from '../../../../utils/yupConfig';
import {
    copyEquipmentPropertiesForCreation,
    creationPropertiesSchema,
    EquipmentSearchDialog,
    getPropertiesFromModification,
    ModificationDialog,
    NetworkModificationDialogProps,
    Property,
    toModificationProperties,
} from '../../common';
import { sanitizeString } from '../../../dialogs';
import {
    createSubstation,
    createSubstationInNode,
    fetchDefaultCountry,
    SubstationCreationDto,
} from '../../../../services';
import { SubstationInfos } from '../substation-dialog.type';

const formSchema = yup
    .object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: yup.string().required(),
        [FieldConstants.EQUIPMENT_NAME]: yup.string().nullable(),
        [FieldConstants.COUNTRY]: yup.string().nullable(),
    })
    .concat(creationPropertiesSchema);

export type SubstationCreationFormData = yup.InferType<typeof formSchema>;

const emptyFormData: SubstationCreationFormData = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.COUNTRY]: null,
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

interface SubstationCreationEditData {
    uuid?: UUID;
    equipmentId: string;
    equipmentName?: string;
    country: string | null;
    properties?: Property[] | null;
}

interface SubstationCreationDialogProps extends NetworkModificationDialogProps {
    editData?: SubstationCreationEditData;
}

/**
 * Dialog to create a substation in the network
 * @param editData the data to edit
 * @param isUpdate check if edition form
 * @param studyContext the current tree node context in case of using the modification in a study
 * @param onClose callback when we close the dialog
 * @param onValidated callback when we validate the dialog
 * @param editDataFetchStatus indicates the status of fetching EditData
 * @param dialogProps props that are forwarded to the generic ModificationDialog component
 */
export function SubstationCreationDialog({
    editData,
    isUpdate,
    studyContext,
    onClose,
    onValidated,
    editDataFetchStatus,
    ...dialogProps
}: Readonly<SubstationCreationDialogProps>) {
    const { snackError } = useSnackMessage();

    const formMethods = useForm<DeepNullable<SubstationCreationFormData>>({
        defaultValues: emptyFormData,
        resolver: yupResolver<DeepNullable<SubstationCreationFormData>>(formSchema),
    });

    const { reset, getValues } = formMethods;

    const fromSearchCopyToFormValues = (substation: SubstationInfos) => {
        reset(
            {
                [FieldConstants.EQUIPMENT_ID]: `${substation.id}(1)`,
                [FieldConstants.EQUIPMENT_NAME]: substation.name ?? '',
                [FieldConstants.COUNTRY]: substation.country,
                ...copyEquipmentPropertiesForCreation(substation),
            },
            { keepDefaultValues: true }
        );
    };

    const searchCopy = useFormSearchCopy(fromSearchCopyToFormValues, EquipmentType.SUBSTATION, studyContext);

    useEffect(() => {
        if (editData) {
            reset({
                [FieldConstants.EQUIPMENT_ID]: editData.equipmentId,
                [FieldConstants.EQUIPMENT_NAME]: editData.equipmentName ?? '',
                [FieldConstants.COUNTRY]: editData.country,
                ...getPropertiesFromModification(editData.properties),
            });
        }
    }, [reset, editData]);

    // We set the default country only in creation mode
    useEffect(() => {
        if (!isUpdate) {
            fetchDefaultCountry().then((country) => {
                if (country) {
                    reset({
                        ...getValues(),
                        [FieldConstants.COUNTRY]: country,
                    });
                }
            });
        }
    }, [reset, getValues, isUpdate]);

    const clear = useCallback(() => {
        reset(emptyFormData);
    }, [reset]);

    const onSubmit = useCallback(
        (substation: SubstationCreationFormData) => {
            const dto: SubstationCreationDto = {
                substationId: substation[FieldConstants.EQUIPMENT_ID],
                substationName: sanitizeString(substation[FieldConstants.EQUIPMENT_NAME]),
                country: substation[FieldConstants.COUNTRY] ?? null,
                isUpdate: !!editData,
                modificationUuid: editData ? editData.uuid : undefined,
                properties: toModificationProperties(substation),
            };
            let promise: Promise<string>;
            if (studyContext) {
                promise = createSubstationInNode({
                    studyId: studyContext.studyId,
                    nodeId: studyContext.nodeId,
                    ...dto,
                });
            } else {
                promise = createSubstation(dto);
            }
            promise.catch((error: Error) => {
                snackWithFallback(snackError, error, { headerId: 'SubstationCreationError' });
            });
        },
        [editData, snackError, studyContext]
    );

    const open = useOpenShortWaitFetching({
        isDataFetched:
            !isUpdate || editDataFetchStatus === FetchStatus.SUCCEED || editDataFetchStatus === FetchStatus.FAILED,
        delay: FORM_LOADING_DELAY,
    });

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods}>
            <ModificationDialog
                fullWidth
                onClear={clear}
                onSave={onSubmit}
                onClose={onClose}
                onValidated={onValidated}
                maxWidth="md"
                titleId="CreateSubstation"
                searchCopy={studyContext ? searchCopy : undefined}
                open={open}
                isDataFetching={isUpdate && editDataFetchStatus === FetchStatus.RUNNING}
                {...dialogProps}
            >
                <SubstationCreationForm />
                {studyContext && (
                    <EquipmentSearchDialog
                        open={searchCopy.isDialogSearchOpen}
                        onClose={searchCopy.handleCloseSearchDialog}
                        equipmentType={EquipmentType.SUBSTATION}
                        onSelectionChange={searchCopy.handleSelectionChange}
                        studyUuid={studyContext.studyId}
                        currentNodeUuid={studyContext.nodeId}
                        currentRootNetworkUuid={studyContext.rootNetworkId}
                        useName={studyContext.useNameParam}
                    />
                )}
            </ModificationDialog>
        </CustomFormProvider>
    );
}
