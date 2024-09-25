/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { yupResolver } from '@hookform/resolvers/yup';
import { UUID } from 'crypto';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { saveFilter } from '../../../services/explore';
import { FetchStatus } from '../../../utils/constants/fetchStatus';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { ElementExistsType } from '../../../utils/types/elementType';
import yup from '../../../utils/yupConfig';
import { CustomMuiDialog } from '../../dialogs/customMuiDialog/CustomMuiDialog';
import { FilterForm } from '../FilterForm';
import { FilterType, NO_SELECTION_FOR_COPY } from '../constants/FilterConstants';
import { SelectionForCopy } from '../filter.type';
import { criteriaBasedFilterSchema } from './CriteriaBasedFilterForm';
import { backToFrontTweak, frontToBackTweak } from './criteriaBasedFilterUtils';

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

export interface CriteriaBasedFilterEditionDialogProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: BroadcastChannel;
    getFilterById: (id: string) => Promise<any>;
    selectionForCopy: SelectionForCopy;
    setSelectionForCopy: (selection: SelectionForCopy) => void;
    activeDirectory?: UUID;
    elementExists?: ElementExistsType;
    language?: string;
}

export function CriteriaBasedFilterEditionDialog({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    getFilterById,
    selectionForCopy,
    setSelectionForCopy,
    activeDirectory,
    elementExists,
    language,
}: Readonly<CriteriaBasedFilterEditionDialogProps>) {
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
    }, [id, name, open, reset, snackError, getFilterById]);

    const onSubmit = useCallback(
        (filterForm: any) => {
            saveFilter(frontToBackTweak(id, filterForm), filterForm[FieldConstants.NAME])
                .then(() => {
                    if (selectionForCopy.sourceItemUuid === id) {
                        setSelectionForCopy(NO_SELECTION_FOR_COPY);
                        broadcastChannel.postMessage({
                            NO_SELECTION_FOR_COPY,
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
            {isDataReady && <FilterForm activeDirectory={activeDirectory} elementExists={elementExists} />}
        </CustomMuiDialog>
    );
}
