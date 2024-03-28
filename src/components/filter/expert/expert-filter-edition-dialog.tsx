/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { FilterType } from '../constants/field-constants';
import { noSelectionForCopy } from '../constants/equipment-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import CustomMuiDialog from '../../commons/custom-mui-dialog/custom-mui-dialog';
import yup from '../../../utils/yup-config';
import { FieldConstants } from '../constants/field-constants';
import { FetchStatus } from '../../../hooks/customHooks';
import { FilterForm } from '../filter-form';
import { EXPERT_FILTER_QUERY, expertFilterSchema } from './expert-filter-form';
import { saveExpertFilter } from '../filters-utils';
import { importExpertRules } from './expert-filter-utils';
import { ElementType } from '../../..';

const formSchema = yup
    .object()
    .shape({
        [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
        [FieldConstants.FILTER_TYPE]: yup.string().required(),
        [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
        ...expertFilterSchema,
    })
    .required();

export interface ExpertFilterEditionDialogProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: BroadcastChannel;

    selectionForCopy: any;
    getFilterById: (id: string) => Promise<{ [prop: string]: any }>;
    fetchAppsAndUrls: () => Promise<any>;
    setSelectionForCopy: (selection: any) => void;
    createFilter: (
        filter: any,
        name: string,
        description: string,
        activeDirectory: any
    ) => Promise<any>;
    saveFilter: (filter: any, name: string) => Promise<any>;
    activeDirectory?: any;
    elementExists?: (
        directory: any,
        value: string,
        elementType: ElementType
    ) => Promise<any>;
}

export const ExpertFilterEditionDialog = ({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    selectionForCopy,
    getFilterById,
    fetchAppsAndUrls,
    setSelectionForCopy,
    createFilter,
    saveFilter,
    activeDirectory,
    elementExists,
}: ExpertFilterEditionDialogProps) => {
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
                        [FieldConstants.EQUIPMENT_TYPE]:
                            response[FieldConstants.EQUIPMENT_TYPE],
                        [EXPERT_FILTER_QUERY]: importExpertRules(
                            response[EXPERT_FILTER_QUERY]
                        ),
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
                '', // The description can not be edited from this dialog
                false,
                null,
                onClose,
                (error: string) => {
                    snackError({
                        messageTxt: error,
                    });
                },
                createFilter,
                saveFilter
            );
            if (selectionForCopy.sourceItemUuid === id) {
                setSelectionForCopy(noSelectionForCopy);
                broadcastChannel.postMessage({
                    noSelectionForCopy,
                });
            }
        },
        [
            broadcastChannel,
            id,
            onClose,
            selectionForCopy.sourceItemUuid,
            snackError,
            setSelectionForCopy,
            saveFilter,
            createFilter,
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
            removeOptional={true}
            disabledSave={!!nameError || !!isValidating}
            isDataFetching={dataFetchStatus === FetchStatus.FETCHING}
        >
            {isDataReady && (
                <FilterForm
                    fetchAppsAndUrls={fetchAppsAndUrls}
                    activeDirectory={activeDirectory}
                    elementExists={elementExists}
                />
            )}
        </CustomMuiDialog>
    );
};

export default ExpertFilterEditionDialog;
