/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { FilterType, FieldConstants } from '../constants/field-constants';
import {
    backToFrontTweak,
    frontToBackTweak,
} from './criteria-based-filter-utils';
import CustomMuiDialog from '../../commons/custom-mui-dialog/custom-mui-dialog';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { criteriaBasedFilterSchema } from './criteria-based-filter-form';
import yup from '../../../utils/yup-config';
import { FetchStatus } from '../../../hooks/customHooks';
import { FilterForm } from '../filter-form';
import { ElementType } from '../../..';

export const noSelectionForCopy = {
    sourceCaseUuid: null,
    name: null,
    description: null,
    parentDirectoryUuid: null,
};

const formSchema = yup
    .object()
    .shape({
        [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
        [FieldConstants.FILTER_TYPE]: yup.string().required(),
        [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
        ...criteriaBasedFilterSchema,
    })
    .required();

interface OwnProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: any;
    getFilterById: (id: string) => Promise<any>;
    saveFilter: (value: any, t: Record<string, any>) => Promise<void>;
    selectionForCopy: any;
    fetchAppsAndUrls: () => Promise<any>;
    setSelelectionForCopy: (selection: any) => void;
    activeDirectory?: any;
    elementExists?: (
        directory: any,
        value: string,
        elementType: ElementType
    ) => Promise<any>;
}

export const CriteriaBasedFilterEditionDialog = ({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    getFilterById,
    saveFilter,
    selectionForCopy,
    fetchAppsAndUrls,
    setSelelectionForCopy,
    activeDirectory,
    elementExists,
}: OwnProps) => {
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

    const nameError: any = errors[FieldConstants.NAME];
    const isValidating = errors.root?.isValidating;

    // Fetch the filter data from back-end if necessary and fill the form with it
    useEffect(() => {
        if (id && open) {
            setDataFetchStatus(FetchStatus.FETCHING);
            getFilterById(id)
                .then((response: any) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    reset({
                        [FieldConstants.NAME]: name,
                        [FieldConstants.FILTER_TYPE]:
                            FilterType.CRITERIA_BASED.id,
                        ...backToFrontTweak(response),
                    });
                })
                .catch((error: any) => {
                    setDataFetchStatus(FetchStatus.FETCH_ERROR);
                    snackError({
                        messageTxt: error.message,
                        headerId: 'cannotRetrieveFilter',
                    });
                });
        }
    }, [id, name, open, reset, snackError, getFilterById]);

    const onSubmit = useCallback(
        (filterForm: any) => {
            saveFilter(
                frontToBackTweak(id, filterForm),
                filterForm[FieldConstants.NAME]
            )
                .then(() => {
                    if (selectionForCopy.sourceItemUuid === id) {
                        setSelelectionForCopy(noSelectionForCopy);
                        broadcastChannel.postMessage({
                            noSelectionForCopy,
                        });
                    }
                })
                .catch((error) => {
                    snackError({
                        messageTxt: error.message,
                    });
                });
        },
        [
            broadcastChannel,
            id,
            selectionForCopy.sourceItemUuid,
            snackError,
            saveFilter,
            setSelelectionForCopy,
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

export default CriteriaBasedFilterEditionDialog;
