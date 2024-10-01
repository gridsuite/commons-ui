/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuid4 } from 'uuid';
import { UUID } from 'crypto';
import { saveExplicitNamingFilter } from '../utils/filterApi';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import CustomMuiDialog from '../../dialogs/customMuiDialog/CustomMuiDialog';
import yup from '../../../utils/yupConfig';
import { explicitNamingFilterSchema, FILTER_EQUIPMENTS_ATTRIBUTES } from './ExplicitNamingFilterForm';
import FieldConstants from '../../../utils/constants/fieldConstants';

import FilterForm from '../FilterForm';
import { FilterType, NO_SELECTION_FOR_COPY } from '../constants/FilterConstants';
import FetchStatus from '../../../utils/constants/fetchStatus';
import { ElementExistsType } from '../../../utils/types/elementType';
import { SelectionForCopy } from '../filter.type';

const formSchema = yup
    .object()
    .shape({
        [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
        [FieldConstants.FILTER_TYPE]: yup.string().required(),
        [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
        ...explicitNamingFilterSchema,
    })
    .required();

export interface ExplicitNamingFilterEditionDialogProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: BroadcastChannel;
    selectionForCopy: SelectionForCopy;
    setSelectionForCopy: (selection: SelectionForCopy) => void;
    getFilterById: (id: string) => Promise<any>;
    activeDirectory?: UUID;
    elementExists?: ElementExistsType;
    language?: string;
}

function ExplicitNamingFilterEditionDialog({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    selectionForCopy,
    setSelectionForCopy,
    getFilterById,
    activeDirectory,
    elementExists,
    language,
}: Readonly<ExplicitNamingFilterEditionDialogProps>) {
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
                .then((response) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    reset({
                        [FieldConstants.NAME]: name,
                        [FieldConstants.FILTER_TYPE]: FilterType.EXPLICIT_NAMING.id,
                        [FieldConstants.EQUIPMENT_TYPE]: response[FieldConstants.EQUIPMENT_TYPE],
                        [FILTER_EQUIPMENTS_ATTRIBUTES]: response[FILTER_EQUIPMENTS_ATTRIBUTES].map((row: any) => ({
                            [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
                            ...row,
                        })),
                    });
                })
                .catch((error) => {
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
            saveExplicitNamingFilter(
                filterForm[FILTER_EQUIPMENTS_ATTRIBUTES],
                false,
                filterForm[FieldConstants.EQUIPMENT_TYPE],
                filterForm[FieldConstants.NAME],
                '', // The description can not be edited from this dialog
                id,
                (error) => {
                    snackError({
                        messageTxt: error,
                    });
                },
                onClose
            );
            if (selectionForCopy.sourceItemUuid === id) {
                setSelectionForCopy(NO_SELECTION_FOR_COPY);
                broadcastChannel.postMessage({
                    NO_SELECTION_FOR_COPY,
                });
            }
        },
        [broadcastChannel, id, selectionForCopy, onClose, snackError, setSelectionForCopy]
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
            {isDataReady && <FilterForm activeDirectory={activeDirectory} elementExists={elementExists} />}
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

export default ExplicitNamingFilterEditionDialog;
