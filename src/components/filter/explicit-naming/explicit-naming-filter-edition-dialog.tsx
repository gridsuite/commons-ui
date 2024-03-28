/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { saveExplicitNamingFilter } from '../filters-utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import CustomMuiDialog from '../../commons/custom-mui-dialog/custom-mui-dialog';
import yup from '../../../utils/yup-config';
import {
    explicitNamingFilterSchema,
    FILTER_EQUIPMENTS_ATTRIBUTES,
} from './explicit-naming-filter-form';
import { FieldConstants } from '../constants/field-constants';

import { FilterForm } from '../filter-form';
import { v4 as uuid4 } from 'uuid';
import { noSelectionForCopy } from '../constants/equipment-types';
import { FilterType } from '../constants/field-constants';
import { FetchStatus } from '../../../hooks/customHooks';
import { ElementType } from '../../..';

const formSchema = yup
    .object()
    .shape({
        [FieldConstants.NAME]: yup.string().trim().required('nameEmpty'),
        [FieldConstants.FILTER_TYPE]: yup.string().required(),
        [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
        ...explicitNamingFilterSchema,
    })
    .required();

interface OwnProps {
    id: string;
    name: string;
    titleId: string;
    open: boolean;
    onClose: () => void;
    broadcastChannel: any;
    selectionForCopy: any;
    setSelectionForCopy: (selection: any) => void;
    getFilterById: (id: string) => Promise<any>;
    fetchAppsAndUrls: () => Promise<any>;
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

const ExplicitNamingFilterEditionDialog = ({
    id,
    name,
    titleId,
    open,
    onClose,
    broadcastChannel,
    selectionForCopy,
    setSelectionForCopy,
    getFilterById,
    fetchAppsAndUrls,
    createFilter,
    saveFilter,
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
                        [FieldConstants.FILTER_TYPE]:
                            FilterType.EXPLICIT_NAMING.id,
                        [FieldConstants.EQUIPMENT_TYPE]:
                            response[FieldConstants.EQUIPMENT_TYPE],
                        [FILTER_EQUIPMENTS_ATTRIBUTES]: response[
                            FILTER_EQUIPMENTS_ATTRIBUTES
                        ].map((row: any) => ({
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
                null,
                onClose,
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
            selectionForCopy,
            onClose,
            snackError,
            createFilter,
            saveFilter,
            setSelectionForCopy,
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

ExplicitNamingFilterEditionDialog.prototype = {
    id: PropTypes.string,
    name: PropTypes.string,
    titleId: PropTypes.string.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
};

export default ExplicitNamingFilterEditionDialog;
