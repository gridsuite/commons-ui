/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { Grid } from '@mui/material';
import {
    ElementType,
    mergeSx,
    snackWithFallback,
    UseParametersBackendReturnProps,
    VoltageLevelInfos,
} from '../../../utils';
import { ComputingType, CreateParameterDialog, LabelledButton } from '../common';

import { useSnackMessage } from '../../../hooks';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { parametersStyles } from '../parameters-style';
import { SubmitButton } from '../../inputs';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { PopupConfirmationDialog } from '../../dialogs';
import {
    toFormValues,
    toParamsInfos,
    useDynamicSimulationParametersForm,
} from './use-dynamic-simulation-parameters-form';
import { DynamicSimulationForm } from './dynamic-simulation-parameters-form';
import { fetchDynamicSimulationParameters } from '../../../services/dynamic-simulation';
import { ExpertFilter, IdentifiableAttributes } from '../../filter';

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

    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);

    const { formMethods, onError } = dynamicSimulationMethods;
    const { reset, handleSubmit, getValues, formState } = formMethods;

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
            updateParameters(toParamsInfos(formData, params));
        },
        [updateParameters, params]
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
                    })
                    .catch((error: Error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
            setOpenSelectParameterDialog(false);
        },
        [reset, snackError]
    );

    useEffect(() => {
        setHaveDirtyFields(!!Object.keys(formState.dirtyFields).length);
    }, [formState, setHaveDirtyFields]);

    const renderActions = () => {
        return (
            <>
                <Grid container item>
                    <Grid
                        sx={mergeSx(parametersStyles.controlParametersItem, {
                            paddingTop: 1,
                            paddingBottom: 2,
                            paddingLeft: 0,
                        })}
                    >
                        <LabelledButton
                            disabled
                            callback={() => setOpenSelectParameterDialog(true)}
                            label="settings.button.chooseSettings"
                        />
                        <LabelledButton disabled callback={() => setOpenCreateParameterDialog(true)} label="save" />
                        <LabelledButton callback={handleResetClick} label="resetToDefault" />
                        <SubmitButton variant="outlined" onClick={handleSubmit(onSubmit, onError)}>
                            <FormattedMessage id="validate" />
                        </SubmitButton>
                    </Grid>
                </Grid>
                {openCreateParameterDialog && (
                    <CreateParameterDialog
                        studyUuid={studyUuid}
                        open={openCreateParameterDialog}
                        onClose={() => setOpenCreateParameterDialog(false)}
                        parameterValues={getValues}
                        parameterFormatter={(formData) => toParamsInfos(formData, params)}
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
        );
    };
    return (
        <DynamicSimulationForm
            dynamicSimulationMethods={dynamicSimulationMethods}
            renderActions={renderActions}
            voltageLevelsFetcher={voltageLevelsFetcher}
            countriesFetcher={countriesFetcher}
            evaluateFilterFetcher={evaluateFilterFetcher}
        />
    );
}
