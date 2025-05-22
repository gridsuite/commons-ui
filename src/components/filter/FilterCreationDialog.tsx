/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { type FieldValues, type Resolver, useForm } from 'react-hook-form';
import yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { UUID } from 'crypto';
import { saveExpertFilter, saveExplicitNamingFilter } from './utils/filterApi';
import { useSnackMessage } from '../../hooks/useSnackMessage';
import { CustomMuiDialog } from '../dialogs/customMuiDialog/CustomMuiDialog';
import {
    getExplicitNamingFilterEmptyFormData,
    getExplicitNamingFilterSchema,
} from './explicitNaming/ExplicitNamingFilterForm';
import { FieldConstants } from '../../utils/constants/fieldConstants';
import { FilterForm } from './FilterForm';
import { expertFilterSchema, getExpertFilterEmptyFormData } from './expert/ExpertFilterForm';
import { FilterType } from './constants/FilterConstants';
import { MAX_CHAR_DESCRIPTION } from '../../utils/constants/uiConstants';
import { EXPERT_FILTER_QUERY } from './expert/expertFilterConstants';
import { FILTER_EQUIPMENTS_ATTRIBUTES } from './explicitNaming/ExplicitNamingFilterConstants';

const emptyFormData = {
    [FieldConstants.NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
    [FieldConstants.EQUIPMENT_TYPE]: null,
    ...getExplicitNamingFilterEmptyFormData(),
    ...getExpertFilterEmptyFormData(),
};

export interface FilterCreationDialogProps {
    open: boolean;
    onClose: () => void;
    activeDirectory?: UUID;
    language?: string;
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
    filterType: { id: string; label: string };
}

export function FilterCreationDialog({
    open,
    onClose,
    activeDirectory,
    language,
    sourceFilterForExplicitNamingConversion = undefined,
    filterType,
}: FilterCreationDialogProps) {
    const { snackError } = useSnackMessage();
    const intl = useIntl();

    // we use both schemas then we can change the type of filter without losing the filled form fields
    const formSchema = useMemo(
        () =>
            yup
                .object()
                .shape({
                    [FieldConstants.NAME]: yup
                        .string()
                        .trim()
                        .required(intl.formatMessage({ id: 'nameEmpty' })),
                    [FieldConstants.DESCRIPTION]: yup
                        .string()
                        .max(MAX_CHAR_DESCRIPTION, intl.formatMessage({ id: 'descriptionLimitError' })),
                    [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
                    ...getExplicitNamingFilterSchema(intl),
                    ...expertFilterSchema,
                })
                .required(),
        [intl]
    );

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
            if (filterType?.id === FilterType.EXPLICIT_NAMING.id) {
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
            } else if (filterType?.id === FilterType.EXPERT.id) {
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
        [activeDirectory, snackError, onClose, filterType]
    );
    const titleId = useMemo(() => {
        if (sourceFilterForExplicitNamingConversion) {
            return 'convertIntoExplicitNamingFilter';
        }
        if (filterType?.id === FilterType.EXPERT.id) {
            return 'createNewCriteriaFilter';
        }
        return 'createNewExplicitNamingFilter';
    }, [sourceFilterForExplicitNamingConversion, filterType]);
    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={onSubmit}
            formSchema={formSchema}
            formMethods={formMethods}
            titleId={titleId}
            removeOptional
            disabledSave={!!nameError || !!isValidating}
            language={language}
            unscrollableFullHeight
        >
            <FilterForm
                creation
                activeDirectory={activeDirectory}
                filterType={filterType}
                sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
            />
        </CustomMuiDialog>
    );
}
