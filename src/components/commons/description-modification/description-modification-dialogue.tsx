/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback } from 'react';
import yup from '../../../utils/yup-config';
import { FieldConstants } from '../../filter/constants/field-constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import CustomMuiDialog from '../custom-mui-dialog/custom-mui-dialog';
import DescriptionInput from './description-input';

interface IDescriptionModificationDialogue {
    elementUuid: string;
    description: string;
    open: boolean;
    onClose: () => void;
    updateElement: (uuid: string, data: unknown) => Promise<any>;
}

const schema = yup.object().shape({
    [FieldConstants.DESCRIPTION]: yup.string().max(500, 'descriptionLimitError'),
});

const DescriptionModificationDialogue: FunctionComponent<
    IDescriptionModificationDialogue
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
                [FieldConstants.DESCRIPTION]: data[FieldConstants.DESCRIPTION].trim(),
            }).catch((error: any) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'descriptionModificationError',
                });
            });
        },
        [elementUuid, snackError]
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
            <DescriptionInput minRows={3} sx={{ marginTop: '10px' }} noLabel />
        </CustomMuiDialog>
    );
};

export default DescriptionModificationDialogue;
