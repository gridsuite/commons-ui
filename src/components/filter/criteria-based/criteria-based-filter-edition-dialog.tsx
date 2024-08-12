/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UUID } from 'crypto';
import FieldConstants from '../../../utils/field-constants';
import { backToFrontTweak, frontToBackTweak } from './criteria-based-filter-utils';
import CustomMuiDialog from '../../dialogs/custom-mui-dialog';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { criteriaBasedFilterSchema } from './criteria-based-filter-form';
import yup from '../../../utils/yup-config';
import { FilterType } from '../constants/filter-constants';
import FetchStatus, { FetchStatusType } from '../../../utils/FetchStatus';
import { exploreSvc, filterSvc } from '../../../services/instances';
import FilterForm from '../filter-form';
import { GsLangUser } from '../../../utils/language';

export type SelectionCopy = {
    sourceItemUuid: UUID | null;
    name: string | null;
    description: string | null;
    parentDirectoryUuid: UUID | null;
};

export const noSelectionForCopy: SelectionCopy = {
    sourceItemUuid: null,
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

interface CriteriaBasedFilterEditionDialogProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: BroadcastChannel;
    selectionForCopy: SelectionCopy;
    setSelectionForCopy: (selection: SelectionCopy) => Dispatch<SetStateAction<SelectionCopy>>;
    activeDirectory?: UUID;
    language?: GsLangUser;
}

function CriteriaBasedFilterEditionDialog({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    selectionForCopy,
    setSelectionForCopy,
    activeDirectory,
    language,
}: Readonly<CriteriaBasedFilterEditionDialogProps>) {
    const { snackError } = useSnackMessage();
    const [dataFetchStatus, setDataFetchStatus] = useState<FetchStatusType>(FetchStatus.IDLE);

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
            filterSvc
                .getFilterById(id)
                .then((response) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    reset({
                        [FieldConstants.NAME]: name,
                        [FieldConstants.FILTER_TYPE]: FilterType.CRITERIA_BASED.id,
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
    }, [id, name, open, reset, snackError]);

    const onSubmit = useCallback(
        (filterForm: any) => {
            exploreSvc
                .saveFilter(frontToBackTweak(id, filterForm), filterForm[FieldConstants.NAME])
                .then(() => {
                    if (selectionForCopy.sourceItemUuid === id) {
                        setSelectionForCopy(noSelectionForCopy);
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
        [broadcastChannel, id, selectionForCopy.sourceItemUuid, snackError, setSelectionForCopy]
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
        >
            {isDataReady && <FilterForm activeDirectory={activeDirectory} />}
        </CustomMuiDialog>
    );
}

export default CriteriaBasedFilterEditionDialog;
