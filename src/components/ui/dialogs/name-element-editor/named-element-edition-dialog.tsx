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
import { ElementType, isDisabledValidationButton } from '../../../../utils';
import { CustomMuiDialog, CustomMuiDialogProps } from '../customMuiDialog/CustomMuiDialog';
import { NameElementEditorForm } from './name-element-editor-form';

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

export function NamedElementEditionDialog<TFieldValues extends FieldValues>({
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

    const disabledSave = isLoading || isDisabledValidationButton(errors);

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
