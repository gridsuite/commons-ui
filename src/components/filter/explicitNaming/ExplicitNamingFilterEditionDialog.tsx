/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { v4 as uuid4 } from 'uuid';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import yup from '../../../utils/yupConfig';
import { CustomMuiDialog } from '../../dialogs/customMuiDialog/CustomMuiDialog';
import { saveExplicitNamingFilter } from '../utils/filterApi';
import { explicitNamingFilterSchema } from './ExplicitNamingFilterForm';

import { FetchStatus } from '../../../utils/constants/fetchStatus';
import { FilterForm } from '../FilterForm';
import { FilterType, NO_ITEM_SELECTION_FOR_COPY } from '../constants/FilterConstants';
import { FilterEditionProps } from '../filter.type';
import { HeaderFilterSchema } from '../HeaderFilterForm';
import { FILTER_EQUIPMENTS_ATTRIBUTES } from './ExplicitNamingFilterConstants';
import { snackWithFallback } from '../../../utils/error';

const formSchema = yup
    .object()
    .shape({
        ...HeaderFilterSchema,
        ...explicitNamingFilterSchema,
    })
    .required();

type FormSchemaType = yup.InferType<typeof formSchema>;

export function ExplicitNamingFilterEditionDialog({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    itemSelectionForCopy,
    setItemSelectionForCopy,
    getFilterById,
    activeDirectory,
    language,
    description,
    isDeveloperMode,
}: Readonly<FilterEditionProps>) {
    const { snackError } = useSnackMessage();
    const [dataFetchStatus, setDataFetchStatus] = useState(FetchStatus.IDLE);

    // default values are set via reset when we fetch data
    const formMethods: UseFormReturn<FormSchemaType> = useForm({
        resolver: yupResolver(formSchema),
    });

    const {
        reset,
        formState: { errors },
    } = formMethods;

    const nameError = errors[FieldConstants.NAME];
    const isValidating = errors.root?.isValidating;
    // Fetch the filter data from back-end if necessary and fill the form with it
    useEffect(() => {
        if (id && open) {
            setDataFetchStatus(FetchStatus.FETCHING);
            getFilterById(id)
                .then((response) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    reset({
                        [FieldConstants.NAME]: name,
                        [FieldConstants.DESCRIPTION]: description,
                        [FieldConstants.EQUIPMENT_TYPE]: response[FieldConstants.EQUIPMENT_TYPE],
                        [FILTER_EQUIPMENTS_ATTRIBUTES]: response[FILTER_EQUIPMENTS_ATTRIBUTES]?.map((row: any) => ({
                            [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
                            ...row,
                        })),
                    });
                })
                .catch((error) => {
                    setDataFetchStatus(FetchStatus.FETCH_ERROR);
                    snackWithFallback(snackError, error, { headerId: 'cannotRetrieveFilter' });
                });
        }
    }, [id, name, open, reset, snackError, getFilterById, description]);

    const onSubmit = useCallback<SubmitHandler<FormSchemaType>>(
        (filterForm) => {
            saveExplicitNamingFilter(
                filterForm[FILTER_EQUIPMENTS_ATTRIBUTES] ?? [],
                false,
                filterForm[FieldConstants.EQUIPMENT_TYPE],
                filterForm[FieldConstants.NAME],
                filterForm[FieldConstants.DESCRIPTION] ?? '',
                id,
                (error) => {
                    snackWithFallback(snackError, error);
                },
                onClose
            );
            if (itemSelectionForCopy.sourceItemUuid === id) {
                setItemSelectionForCopy(NO_ITEM_SELECTION_FOR_COPY);
                broadcastChannel.postMessage({ NO_SELECTION_FOR_COPY: NO_ITEM_SELECTION_FOR_COPY });
            }
        },
        [broadcastChannel, id, itemSelectionForCopy, onClose, snackError, setItemSelectionForCopy]
    );

    const isDataReady = dataFetchStatus === FetchStatus.FETCH_SUCCESS;

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
            isDataFetching={dataFetchStatus === FetchStatus.FETCHING}
            language={language}
            isDeveloperMode={isDeveloperMode}
            unscrollableFullHeight
        >
            {isDataReady && (
                <FilterForm activeDirectory={activeDirectory} filterType={FilterType.EXPLICIT_NAMING} isEditing />
            )}
        </CustomMuiDialog>
    );
}

ExplicitNamingFilterEditionDialog.prototype = {
    id: PropTypes.string,
    name: PropTypes.string,
    titleId: PropTypes.string.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
};
