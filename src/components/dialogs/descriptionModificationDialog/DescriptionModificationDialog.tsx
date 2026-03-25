/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { object, string, type InferType } from 'yup';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { CustomMuiDialog } from '../customMuiDialog/CustomMuiDialog';
import { ExpandingTextField } from '../../inputs/reactHookForm/text/ExpandingTextField';
import { MAX_CHAR_DESCRIPTION } from '../../../utils/constants/uiConstants';
import { snackWithFallback } from '../../../utils/error';
import { DESCRIPTION_LIMIT_ERROR } from '../../../utils';

export interface DescriptionModificationDialogProps {
    description: string;
    open: boolean;
    onClose: () => void;
    updateElement?: (data: Record<string, string>) => Promise<Response>;
    updateForm?: (data: Record<string, string>) => void;
}

const schema = object().shape({
    [FieldConstants.DESCRIPTION]: string().max(MAX_CHAR_DESCRIPTION, DESCRIPTION_LIMIT_ERROR),
});
type SchemaType = InferType<typeof schema>;

export function DescriptionModificationDialog({
    description,
    open,
    onClose,
    updateElement,
    updateForm,
}: Readonly<DescriptionModificationDialogProps>) {
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

    const onSubmit = useCallback<SubmitHandler<SchemaType>>(
        (data) => {
            updateElement?.({
                [FieldConstants.DESCRIPTION]: data[FieldConstants.DESCRIPTION]?.trim() ?? '',
            }).catch((error: unknown) => {
                snackWithFallback(snackError, error, { headerId: 'descriptionModificationError' });
            });
            updateForm?.({
                [FieldConstants.DESCRIPTION]: data[FieldConstants.DESCRIPTION]?.trim() ?? '',
            });
        },
        [updateElement, updateForm, snackError]
    );

    return (
        <CustomMuiDialog
            open={open}
            onClose={onCancel}
            onSave={onSubmit}
            formContext={{ ...methods, validationSchema: schema, removeOptional: true }}
            titleId="description"
        >
            <Box paddingTop={1}>
                <ExpandingTextField
                    name={FieldConstants.DESCRIPTION}
                    label="descriptionProperty"
                    minRows={3}
                    rows={3}
                />
            </Box>
        </CustomMuiDialog>
    );
}
