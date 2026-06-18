/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { useIntl } from 'react-intl';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { ElementType, snackWithFallback, VoltageLevelInfos } from '../../../utils';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { ComputingType, CreateParameterDialog } from '../common';
import { useSnackMessage } from '../../../hooks';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { CustomFormProvider } from '../../../components/ui';
import { DirectoryItemSelector } from '../../../components/ui/directoryItemSelector';
import { PopupConfirmationDialog } from '../../../components/ui/dialogs';
import {
    toFormValues,
    toParamsInfos,
    useDynamicSimulationParametersForm,
} from './use-dynamic-simulation-parameters-form';
import { DynamicSimulationForm } from './dynamic-simulation-parameters-form';
import { fetchDynamicSimulationParameters } from '../../../services/dynamic-simulation';
import { ExpertFilter, IdentifiableAttributes } from '../../../components/composite/filter';
import useDefaultParams from './hook/use-default-params';

type DynamicSimulationInlineProps = {
    studyUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.DYNAMIC_SIMULATION>;
    setHaveDirtyFields: (isDirty: boolean) => void;
    // fetchers for curve parameters
    voltageLevelsFetcher: () => Promise<VoltageLevelInfos[]>;
    countriesFetcher: () => Promise<string[]>;
    evaluateFilterFetcher: (filter: ExpertFilter) => Promise<IdentifiableAttributes[]>;
};

export function DynamicSimulationInline({
    studyUuid,
    parametersBackend,
    setHaveDirtyFields,
    voltageLevelsFetcher,
    countriesFetcher,
    evaluateFilterFetcher,
}: Readonly<DynamicSimulationInlineProps>) {
    const { providers, params, updateParameters, resetParameters } = parametersBackend;
    const dynamicSimulationMethods = useDynamicSimulationParametersForm({
        providers,
        params,
        name: null,
        description: null,
    });
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    // since RHF does not support API like getDefaultValues =>
    // manually manage default params (in dto format) to use while merging with the form
    const { getDefaultParams, setDefaultParams } = useDefaultParams(params);

    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);

    const { formSchema, formMethods } = dynamicSimulationMethods;
    const { reset, getValues, formState } = formMethods;

    const handleResetClick = useCallback(() => {
        setOpenResetConfirmation(true);
    }, []);
    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
    }, []);

    const handleReset = useCallback(() => {
        resetParameters();
        setOpenResetConfirmation(false);
    }, [resetParameters]);

    const onSubmit = useCallback(
        (formData: FieldValues) => {
            // update params after convert form representation to dto representation
            updateParameters(toParamsInfos(formData, getDefaultParams()));
        },
        [updateParameters, getDefaultParams]
    );

    const handleLoadParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                setOpenSelectParameterDialog(false);
                const parametersUuid = newParams[0].id;
                fetchDynamicSimulationParameters(parametersUuid)
                    .then((_params) => {
                        reset(toFormValues(_params), {
                            keepDefaultValues: true,
                        });
                        setDefaultParams(_params);
                    })
                    .catch((error: Error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
            setOpenSelectParameterDialog(false);
        },
        [reset, setDefaultParams, snackError]
    );

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    const actions = {
        preFillOnClick: () => setOpenSelectParameterDialog(true),
        saveOnClick: () => setOpenCreateParameterDialog(true),
        resetOnClick: handleResetClick,
        extra: (
            <>
                {openCreateParameterDialog && (
                    <CreateParameterDialog
                        studyUuid={studyUuid}
                        open={openCreateParameterDialog}
                        onClose={() => setOpenCreateParameterDialog(false)}
                        parameterValues={getValues}
                        parameterFormatter={(formData) => toParamsInfos(formData, getDefaultParams())}
                        parameterType={ElementType.DYNAMIC_SIMULATION_PARAMETERS}
                    />
                )}
                {openSelectParameterDialog && (
                    <DirectoryItemSelector
                        open={openSelectParameterDialog}
                        onClose={handleLoadParameter}
                        types={[ElementType.DYNAMIC_SIMULATION_PARAMETERS]}
                        title={intl.formatMessage({
                            id: 'showSelectParameterDialog',
                        })}
                        onlyLeaves
                        multiSelect={false}
                        validationButtonText={intl.formatMessage({
                            id: 'validate',
                        })}
                    />
                )}
                {/* Reset Confirmation Dialog */}
                {openResetConfirmation && (
                    <PopupConfirmationDialog
                        message="resetParamsConfirmation"
                        validateButtonLabel="validate"
                        openConfirmationPopup={openResetConfirmation}
                        setOpenConfirmationPopup={handleCancelReset}
                        handlePopupConfirmation={handleReset}
                    />
                )}
            </>
        ),
    };

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods}>
            <DynamicSimulationForm
                dynamicSimulationMethods={dynamicSimulationMethods}
                onSubmit={onSubmit}
                actions={actions}
                voltageLevelsFetcher={voltageLevelsFetcher}
                countriesFetcher={countriesFetcher}
                evaluateFilterFetcher={evaluateFilterFetcher}
            />
        </CustomFormProvider>
    );
}
