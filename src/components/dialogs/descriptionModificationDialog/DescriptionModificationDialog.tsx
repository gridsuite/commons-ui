/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import * as yup from 'yup';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { CustomMuiDialog } from '../customMuiDialog/CustomMuiDialog';
import { ExpandingTextField } from '../../inputs/reactHookForm/text/ExpandingTextField';
import { MAX_CHAR_DESCRIPTION } from '../../../utils/constants/uiConstants';

export interface DescriptionModificationDialogProps {
    elementUuid: string;
    description: string;
    open: boolean;
    onClose: () => void;
    updateElement: (uuid: string, data: Record<string, string>) => Promise<void>;
}

export function DescriptionModificationDialog({
    elementUuid,
    description,
    open,
    onClose,
    updateElement,
}: Readonly<DescriptionModificationDialogProps>) {
    const { snackError } = useSnackMessage();
    const intl = useIntl();

    const schema = useMemo(
        () =>
            yup.object().shape({
                [FieldConstants.DESCRIPTION]: yup
                    .string()
                    .max(MAX_CHAR_DESCRIPTION, intl.formatMessage({ id: 'descriptionLimitError' })),
            }),
        [intl]
    );
    type SchemaType = yup.InferType<typeof schema>;

    const methods = useForm({
        defaultValues: {
            [FieldConstants.DESCRIPTION]: description ?? '',
        },
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
            updateElement(elementUuid, {
                [FieldConstants.DESCRIPTION]: data[FieldConstants.DESCRIPTION]?.trim() ?? '',
            }).catch((error: unknown) => {
                if (error instanceof Object && 'message' in error && typeof error.message === 'string') {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'descriptionModificationError',
                    });
                }
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
            titleId="description"
            removeOptional
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
