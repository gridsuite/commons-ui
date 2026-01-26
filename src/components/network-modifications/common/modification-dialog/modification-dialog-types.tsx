/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode } from 'react';
import { DialogProps } from '@mui/material';
import { UUID } from 'node:crypto';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { UseFormSearchCopy } from '../../../../hooks';
import { StudyContext } from '../../../../services';

export type ModificationDialogContentProps = Omit<DialogProps, 'onClose' | 'aria-labelledby'> & {
    closeAndClear: () => void;
    isDataFetching?: boolean;
    titleId: string;
    onOpenCatalogDialog?: () => void;
    searchCopy?: UseFormSearchCopy;
    submitButton: ReactNode;
    subtitle?: ReactNode;
};

export type ModificationDialogProps<TFieldValues extends FieldValues> = Omit<
    ModificationDialogContentProps,
    'closeAndClear' | 'submitButton'
> & {
    disabledSave?: boolean;
    onClear: () => void;
    onClose?: () => void;
    onSave: (modificationData: TFieldValues) => void;
    onValidated?: () => void;
    onValidationError?: (errors: FieldErrors<TFieldValues>) => void;
};

export type NetworkModificationDialogProps = {
    studyContext?: StudyContext;
    isUpdate: boolean;
    editDataFetchStatus?: string;
    onValidated?: () => void;
    onClose?: () => void;
};

export type EquipmentModificationDialogProps = NetworkModificationDialogProps & {
    defaultIdValue: UUID;
};
