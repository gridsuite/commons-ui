/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback } from 'react';
import yup from '../../utils/yup-config';
import { FieldConstants } from '../../utils/field-constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackMessage } from '../../hooks/useSnackMessage';
import CustomMuiDialog from './custom-mui-dialog';
import ExpandingTextField from '../inputs/react-hook-form/ExpandingTextField';
import { Box } from '@mui/material';

export interface IDescriptionModificationDialog {
    elementUuid: string;
    description: string;
    open: boolean;
    onClose: () => void;
    updateElement: (
        uuid: string,
        data: Record<string, string>
    ) => Promise<void>;
}

const schema = yup.object().shape({
    [FieldConstants.DESCRIPTION]: yup
        .string()
        .max(500, 'descriptionLimitError'),
});

const DescriptionModificationDialog: FunctionComponent<
    IDescriptionModificationDialog
> = ({ elementUuid, description, open, onClose, updateElement }) => {
    const { snackError } = useSnackMessage();

    const emptyFormData = {
        [FieldConstants.DESCRIPTION]: description ?? '',
    };

    const methods = useForm({
        defaultValues: emptyFormData,
        resolver: yupResolver(schema),
    });

    const { reset } = methods;

    const onCancel = () => {
        reset({
            [FieldConstants.DESCRIPTION]: '',
        });
        onClose();
    };

    const onSubmit = useCallback(
        (data: { description: string }) => {
            updateElement(elementUuid, {
                [FieldConstants.DESCRIPTION]:
                    data[FieldConstants.DESCRIPTION].trim(),
            }).catch((error: any) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'descriptionModificationError',
                });
            });
        },
        [elementUuid, updateElement, snackError]
    );

    return (
        <CustomMuiDialog
            open={open}
            onClose={onCancel}
            onSave={onSubmit}
            formSchema={schema}
            formMethods={methods}
            titleId={'description'}
            removeOptional={true}
        >
            <Box paddingTop={1}>
                <ExpandingTextField
                    name={FieldConstants.DESCRIPTION}
                    label={'inputs/descriptionProperty'}
                    minRows={3}
                    rows={5}
                ></ExpandingTextField>
            </Box>{' '}
        </CustomMuiDialog>
    );
};

export default DescriptionModificationDialog;
