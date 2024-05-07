/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { FieldConstants } from '../../../utils/field-constants';
import {
    backToFrontTweak,
    frontToBackTweak,
} from './criteria-based-filter-utils';
import CustomMuiDialog from '../../dialogs/custom-mui-dialog';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { criteriaBasedFilterSchema } from './criteria-based-filter-form';
import yup from '../../../utils/yup-config';
import { FilterForm } from '../filter-form';
import { UUID } from 'crypto';
import { FilterType } from '../constants/filter-constants';
import { FetchStatus } from '../../../utils/FetchStatus.ts';
import { ElementType } from '../../../utils/ElementType.ts';

export type SelectionCopy = {
    sourceItemUuid: UUID | null;
    name: string | null;
    description: string | null;
    parentDirectoryUuid: UUID | null;
};

export type elementExistsType = (
    directory: UUID,
    value: string,
    elementType: ElementType
) => Promise<boolean>;

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
    getFilterById: (id: string) => Promise<any>;
    saveFilter: (value: any, t: Record<string, any>) => Promise<void>;
    selectionForCopy: SelectionCopy;
    setSelelectionForCopy: (
        selection: SelectionCopy
    ) => Dispatch<SetStateAction<SelectionCopy>>;
    activeDirectory?: UUID;
    elementExists?: elementExistsType;
    language?: string;
}

export const CriteriaBasedFilterEditionDialog: FunctionComponent<
    CriteriaBasedFilterEditionDialogProps
> = ({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    getFilterById,
    saveFilter,
    selectionForCopy,
    setSelelectionForCopy,
    activeDirectory,
    elementExists,
    language,
}) => {
    const { snackError } = useSnackMessage();
    const [dataFetchStatus, setDataFetchStatus] = useState(FetchStatus.IDLE);

    // default values are set via reset when we fetch data
    const formMethods = {
        ...useForm({
            resolver: yupResolver(formSchema),
        }),
        language: language,
    };

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
                    activeDirectory={activeDirectory}
                    elementExists={elementExists}
                />
            )}
        </CustomMuiDialog>
    );
};

export default CriteriaBasedFilterEditionDialog;
