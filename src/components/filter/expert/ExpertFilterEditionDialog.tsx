/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { FetchStatus } from '../../../utils/constants/fetchStatus';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import yup from '../../../utils/yupConfig';
import { CustomMuiDialog } from '../../dialogs/customMuiDialog/CustomMuiDialog';
import { FilterType, NO_ITEM_SELECTION_FOR_COPY } from '../constants/FilterConstants';
import { FilterProps } from '../filter.type';
import { FilterForm } from '../FilterForm';
import { saveExpertFilter } from '../utils/filterApi';
import { EXPERT_FILTER_QUERY, expertFilterSchema } from './ExpertFilterForm';
import { importExpertRules } from './expertFilterUtils';
import { MAX_CHAR_DESCRIPTION } from '../../../utils/constants/UIconstants';

const formSchema = yup
    .object()
    .shape({
        [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
        [FieldConstants.FILTER_TYPE]: yup.string().required(),
        [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
        [FieldConstants.DESCRIPTION]: yup.string().max(MAX_CHAR_DESCRIPTION, 'descriptionLimitError'),
        ...expertFilterSchema,
    })
    .required();

export interface ExpertFilterEditionDialogProps extends FilterProps {
    getFilterById: (id: string) => Promise<{ [prop: string]: any }>;
}

export function ExpertFilterEditionDialog({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    itemSelectionForCopy,
    getFilterById,
    setItemSelectionForCopy,
    activeDirectory,
    elementExists,
    language,
    description,
    elementUuid,
}: Readonly<ExpertFilterEditionDialogProps>) {
    const { snackError } = useSnackMessage();
    const [dataFetchStatus, setDataFetchStatus] = useState(FetchStatus.IDLE);

    // default values are set via reset when we fetch data
    const formMethods = useForm({
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
                .then((response: { [prop: string]: any }) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    reset({
                        [FieldConstants.NAME]: name,
                        [FieldConstants.FILTER_TYPE]: FilterType.EXPERT.id,
                        [FieldConstants.EQUIPMENT_TYPE]: response[FieldConstants.EQUIPMENT_TYPE],
                        [EXPERT_FILTER_QUERY]: importExpertRules(response[EXPERT_FILTER_QUERY]),
                    });
                })
                .catch((error: { message: any }) => {
                    setDataFetchStatus(FetchStatus.FETCH_ERROR);
                    snackError({
                        messageTxt: error.message,
                        headerId: 'cannotRetrieveFilter',
                    });
                });
        }
    }, [id, name, open, reset, snackError, getFilterById]);

    const onSubmit = useCallback(
        (filterForm: { [prop: string]: any }) => {
            saveExpertFilter(
                id,
                filterForm[EXPERT_FILTER_QUERY],
                filterForm[FieldConstants.EQUIPMENT_TYPE],
                filterForm[FieldConstants.NAME],
                filterForm[FieldConstants.DESCRIPTION],
                false,
                null,
                onClose,
                (error: string) => {
                    snackError({
                        messageTxt: error,
                    });
                },
                elementUuid
            );
            if (itemSelectionForCopy.sourceItemUuid === id) {
                setItemSelectionForCopy(NO_ITEM_SELECTION_FOR_COPY);
                broadcastChannel.postMessage({ NO_SELECTION_FOR_COPY: NO_ITEM_SELECTION_FOR_COPY });
            }
        },
        [
            broadcastChannel,
            id,
            onClose,
            itemSelectionForCopy.sourceItemUuid,
            snackError,
            setItemSelectionForCopy,
            elementUuid,
        ]
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
            unscrollableFullHeight
        >
            {isDataReady && (
                <FilterForm activeDirectory={activeDirectory} elementExists={elementExists} description={description} />
            )}
        </CustomMuiDialog>
    );
}
