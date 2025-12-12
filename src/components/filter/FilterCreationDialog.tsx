/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { FieldValues, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { UUID } from 'node:crypto';
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
import { GsLang } from '../../utils';
import { snackWithFallback } from '../../utils/error';

const emptyFormData = {
    [FieldConstants.NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
    [FieldConstants.EQUIPMENT_TYPE]: null,
    ...getExplicitNamingFilterEmptyFormData(),
    ...getExpertFilterEmptyFormData(),
};

// the schema depends of the type of the filter
const formSchemaByFilterType = (filterType: { id: string }) =>
    yup
        .object()
        .shape({
            [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
            [FieldConstants.DESCRIPTION]: yup.string().max(MAX_CHAR_DESCRIPTION, 'descriptionLimitError'),
            [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
            ...(filterType?.id === FilterType.EXPLICIT_NAMING.id ? explicitNamingFilterSchema : {}),
            ...(filterType?.id === FilterType.EXPERT.id ? expertFilterSchema : {}),
        })
        .required();

export interface FilterCreationDialogProps {
    open: boolean;
    onClose: () => void;
    activeDirectory?: UUID;
    language?: GsLang;
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
    filterType: { id: string; label: string };
    enableDeveloperMode: boolean;
}

export function FilterCreationDialog({
    open,
    onClose,
    activeDirectory,
    language,
    sourceFilterForExplicitNamingConversion = undefined,
    filterType,
    enableDeveloperMode,
}: FilterCreationDialogProps) {
    const { snackError } = useSnackMessage();

    const formSchema = useMemo(() => formSchemaByFilterType(filterType), [filterType]);

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
                    (error: Error) => {
                        snackWithFallback(snackError, error);
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
                    (error: Error) => {
                        snackWithFallback(snackError, error);
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
            isDeveloperMode={enableDeveloperMode}
            unscrollableFullHeight
        >
            <FilterForm
                creation
                activeDirectory={activeDirectory}
                filterType={filterType}
                sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
                isEditing={false}
            />
        </CustomMuiDialog>
    );
}
