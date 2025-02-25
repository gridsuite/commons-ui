/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { FieldValues, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UUID } from 'crypto';
import { saveExpertFilter, saveExplicitNamingFilter } from './utils/filterApi';
import { useSnackMessage } from '../../hooks/useSnackMessage';
import { CustomMuiDialog } from '../dialogs/customMuiDialog/CustomMuiDialog';
import {
    explicitNamingFilterSchema,
    getExplicitNamingFilterEmptyFormData,
} from './explicitNaming/ExplicitNamingFilterForm';
import { FieldConstants } from '../../utils/constants/fieldConstants';
import yup from '../../utils/yupConfig';
import { FilterForm } from './FilterForm';
import { expertFilterSchema, getExpertFilterEmptyFormData } from './expert/ExpertFilterForm';
import { FilterType } from './constants/FilterConstants';
import { MAX_CHAR_DESCRIPTION } from '../../utils/constants/uiConstants';
import { EXPERT_FILTER_QUERY } from './expert/expertFilterConstants';
import { FILTER_EQUIPMENTS_ATTRIBUTES } from './explicitNaming/ExplicitNamingFilterConstants';

const emptyFormData = {
    [FieldConstants.NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
    [FieldConstants.FILTER_TYPE]: FilterType.EXPERT.id,
    [FieldConstants.EQUIPMENT_TYPE]: null,
    ...getExplicitNamingFilterEmptyFormData(),
    ...getExpertFilterEmptyFormData(),
};

// we use both schemas then we can change the type of filter without losing the filled form fields
const formSchema = yup
    .object()
    .shape({
        [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
        [FieldConstants.DESCRIPTION]: yup.string().max(MAX_CHAR_DESCRIPTION, 'descriptionLimitError'),
        [FieldConstants.FILTER_TYPE]: yup.string().required(),
        [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
        ...explicitNamingFilterSchema,
        ...expertFilterSchema,
    })
    .required();

export interface FilterCreationDialogProps {
    open: boolean;
    onClose: () => void;
    activeDirectory?: UUID;
    language?: string;
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
}

export function FilterCreationDialog({
    open,
    onClose,
    activeDirectory,
    language,
    sourceFilterForExplicitNamingConversion = undefined,
}: FilterCreationDialogProps) {
    const { snackError } = useSnackMessage();

    const formMethods = useForm({
        defaultValues: emptyFormData,
        resolver: yupResolver(formSchema) as unknown as Resolver,
    });

    const {
        formState: { errors },
    } = formMethods;

    const nameError = errors[FieldConstants.NAME];
    const isValidating = errors.root?.isValidating;

    const onSubmit = useCallback(
        (filterForm: FieldValues) => {
            if (filterForm[FieldConstants.FILTER_TYPE] === FilterType.EXPLICIT_NAMING.id) {
                saveExplicitNamingFilter(
                    filterForm[FILTER_EQUIPMENTS_ATTRIBUTES],
                    true,
                    filterForm[FieldConstants.EQUIPMENT_TYPE],
                    filterForm[FieldConstants.NAME],
                    filterForm[FieldConstants.DESCRIPTION],
                    null,
                    (error?: string) => {
                        snackError({
                            messageTxt: error,
                        });
                    },
                    onClose,
                    activeDirectory
                );
            } else if (filterForm[FieldConstants.FILTER_TYPE] === FilterType.EXPERT.id) {
                saveExpertFilter(
                    null,
                    filterForm[EXPERT_FILTER_QUERY],
                    filterForm[FieldConstants.EQUIPMENT_TYPE],
                    filterForm[FieldConstants.NAME],
                    filterForm[FieldConstants.DESCRIPTION],
                    true,
                    activeDirectory,
                    onClose,
                    (error?: string) => {
                        snackError({
                            messageTxt: error,
                        });
                    }
                );
            }
        },
        [activeDirectory, snackError, onClose]
    );

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={onSubmit}
            formSchema={formSchema}
            formMethods={formMethods}
            titleId={sourceFilterForExplicitNamingConversion ? 'convertIntoExplicitNamingFilter' : 'createNewFilter'}
            removeOptional
            disabledSave={!!nameError || !!isValidating}
            language={language}
            unscrollableFullHeight
        >
            <FilterForm
                creation
                activeDirectory={activeDirectory}
                sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
            />
        </CustomMuiDialog>
    );
}
