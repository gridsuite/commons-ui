/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';
import { Dialog, DialogActions } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, ObjectSchema } from 'yup';
import { CustomFormProvider } from '../../../../inputs/reactHookForm/provider/CustomFormProvider';
import { CancelButton } from '../../../../inputs/reactHookForm/utils/CancelButton';
import { FieldConstants } from '../../../../../utils';
import { CreateSwitchesFormData, SwitchKindFormData } from '../voltageLevelCreation.types';
import { getCreateSwitchesEmptyFormData, getCreateSwitchesValidationSchema } from '../voltageLevelCreation.utils';
import CreateSwitchesForm from './CreateSwitchesForm';
import CreateSwitchesDialogSubmitButton from './CreateSwitchesDialogSubmitButton';

const formSchema = object().shape({
    ...getCreateSwitchesValidationSchema(),
}) as ObjectSchema<CreateSwitchesFormData>;

interface CreateSwitchesDialogProps {
    sectionCount: number;
    handleCreateSwitchesDialog: (data: CreateSwitchesFormData) => void;
    setOpenCreateSwitchesDialog: React.Dispatch<React.SetStateAction<boolean>>;
    openCreateSwitchesDialog: boolean;
    switchKinds: SwitchKindFormData[];
}

export function CreateSwitchesDialog({
    sectionCount,
    handleCreateSwitchesDialog,
    setOpenCreateSwitchesDialog,
    openCreateSwitchesDialog,
    switchKinds,
}: CreateSwitchesDialogProps) {
    const emptyFormData = getCreateSwitchesEmptyFormData(sectionCount);
    const formMethods = useForm<CreateSwitchesFormData>({
        defaultValues: emptyFormData,
        resolver: yupResolver(formSchema) as any,
    });

    const { reset } = formMethods;

    useEffect(() => {
        if (switchKinds?.length > 0) {
            reset({
                [FieldConstants.SWITCH_KINDS]: switchKinds,
            });
        }
    }, [switchKinds, reset]);

    const handleCloseDialog = () => {
        reset(emptyFormData);
        setOpenCreateSwitchesDialog(false);
    };

    const handleSave = (data: CreateSwitchesFormData) => {
        handleCreateSwitchesDialog(data);
        handleCloseDialog();
    };

    return (
        <Dialog open={openCreateSwitchesDialog} fullWidth>
            <CustomFormProvider validationSchema={formSchema} {...formMethods}>
                <CreateSwitchesForm id={FieldConstants.SWITCH_KINDS} />
                <DialogActions>
                    <CancelButton onClick={handleCloseDialog} />
                    <CreateSwitchesDialogSubmitButton handleSave={handleSave} />
                </DialogActions>
            </CustomFormProvider>
        </Dialog>
    );
}
