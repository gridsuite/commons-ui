/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { LinearProgress } from '@mui/material';
import { UUID } from 'node:crypto';
import type { ReactNode } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { ElementType, isDisabledValidationButton, type MuiStyles } from '../../../../utils';
import { CustomMuiDialog, CustomMuiDialogProps } from '../customMuiDialog/CustomMuiDialog';
import { NameElementEditorForm } from './name-element-editor-form';

export const elementEditionDialogStyles = {
    textField: {
        minWidth: '250px',
        width: '33%',
    },
    description: {
        minWidth: '250px',
        width: '50%',
    },
} as const satisfies MuiStyles;

type ElementEditionDialogProps<TFieldValues extends FieldValues> = Omit<
    CustomMuiDialogProps<TFieldValues>,
    'formContext'
> & {
    isLoading: boolean;
    directory: UUID;
    elementName: string;
    elementType: ElementType;
    formMethods: UseFormReturn<TFieldValues>;
    formSchema: ObjectSchema<TFieldValues>;
    children: ReactNode;
};

export function ElementEditionDialog<TFieldValues extends FieldValues>({
    isLoading,
    directory,
    elementName,
    elementType,
    formMethods,
    formSchema,
    children,
    ...customMuiDialogProps
}: Readonly<ElementEditionDialogProps<TFieldValues>>) {
    const {
        formState: { errors },
    } = formMethods;

    const disabledSave = isDisabledValidationButton(errors);

    return (
        <CustomMuiDialog
            {...customMuiDialogProps}
            formContext={{
                ...formMethods,
                validationSchema: formSchema,
                removeOptional: true,
            }}
            disabledSave={disabledSave}
        >
            <NameElementEditorForm
                activeDirectory={directory}
                elementType={elementType}
                initialElementName={elementName}
            />
            {isLoading ? <LinearProgress /> : children}
        </CustomMuiDialog>
    );
}
