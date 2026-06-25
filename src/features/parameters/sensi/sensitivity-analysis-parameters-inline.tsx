/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import {
    ElementType,
    mapSensitivityAnalysisParameters,
    SensitivityAnalysisParametersInfosEnriched,
    UseParametersBackendReturnProps,
} from '../../../utils';
import { ComputingType, CreateParameterDialog, ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { useSnackMessage } from '../../../hooks';
import { DirectoryItemSelector } from '../../../components/ui/directoryItemSelector';
import {
    fetchSensitivityAnalysisParameters,
    setSensitivityAnalysisParameters,
} from '../../../services/sensitivity-analysis';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { useSensitivityAnalysisParametersForm } from './use-sensitivity-analysis-parameters';
import { SensitivityAnalysisParametersForm } from './sensitivity-analysis-parameters-form';
import { PopupConfirmationDialog } from '../../../components/ui/dialogs';
import { snackWithFallback } from '../../../utils/error';
import { BuildStatus } from '../../node/constant';

interface SensitivityAnalysisParametersProps {
    studyUuid: UUID | null;
    currentNodeUuid: UUID | null;
    currentRootNetworkUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SENSITIVITY_ANALYSIS>;
    setHaveDirtyFields: (isDirty: boolean) => void;
    globalBuildStatus?: BuildStatus;
    isRootNode: boolean;
    isDeveloperMode: boolean;
}

export function SensitivityAnalysisParametersInline({
    studyUuid,
    currentNodeUuid,
    currentRootNetworkUuid,
    parametersBackend,
    setHaveDirtyFields,
    globalBuildStatus,
    isRootNode,
    isDeveloperMode,
}: Readonly<SensitivityAnalysisParametersProps>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const sensitivityAnalysisMethods = useSensitivityAnalysisParametersForm({
        studyUuid,
        currentNodeUuid,
        currentRootNetworkUuid,
        parametersBackend,
        name: null,
        description: null,
        parametersUuid: null,
        globalBuildStatus,
        isRootNode,
    });

    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);

    const { reset, formState, getValues, handleSubmit } = sensitivityAnalysisMethods.formMethods;

    const handleSensibilityParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
                setOpenSelectParameterDialog(false);
                fetchSensitivityAnalysisParameters(newParams[0].id)
                    .then((parameters: SensitivityAnalysisParametersInfosEnriched) => {
                        console.info(`loading the following sensi parameters : ${parameters.uuid}`);
                        reset(sensitivityAnalysisMethods.fromSensitivityAnalysisParamsDataToFormValues(parameters), {
                            keepDefaultValues: true,
                        });
                        sensitivityAnalysisMethods.onFormChanged();
                    })
                    .catch((error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
            setOpenSelectParameterDialog(false);
        },
        [reset, sensitivityAnalysisMethods, snackError]
    );

    const resetSensitivityAnalysisParameters = useCallback(() => {
        setSensitivityAnalysisParameters(studyUuid, null).catch((error) => {
            snackWithFallback(snackError, error, { headerId: 'paramsChangingError' });
        });
    }, [studyUuid, snackError]);

    const clear = useCallback(() => {
        reset(sensitivityAnalysisMethods.emptyFormData);
        resetSensitivityAnalysisParameters();
        sensitivityAnalysisMethods.resetFactorsCount();
        setOpenResetConfirmation(false);
    }, [reset, sensitivityAnalysisMethods, resetSensitivityAnalysisParameters]);

    const handleResetClick = useCallback(() => {
        setOpenResetConfirmation(true);
    }, []);

    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
    }, []);

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    const actions = {
        preFillOnClick: () => setOpenSelectParameterDialog(true),
        saveOnClick: () => setOpenCreateParameterDialog(true),
        resetOnClick: handleResetClick,
        validateDisabled:
            sensitivityAnalysisMethods.isLoading ||
            sensitivityAnalysisMethods.isMaxResultsReached ||
            sensitivityAnalysisMethods.isMaxVariablesReached,
        extra: (
            <>
                {openCreateParameterDialog && (
                    <CreateParameterDialog
                        studyUuid={studyUuid}
                        open={openCreateParameterDialog}
                        onClose={() => setOpenCreateParameterDialog(false)}
                        parameterValues={getValues}
                        parameterFormatter={(newParams) =>
                            mapSensitivityAnalysisParameters(sensitivityAnalysisMethods.formatNewParams(newParams))
                        }
                        parameterType={ElementType.SENSITIVITY_PARAMETERS}
                    />
                )}
                {openSelectParameterDialog && (
                    <DirectoryItemSelector
                        open={openSelectParameterDialog}
                        onClose={handleSensibilityParameter}
                        types={[ElementType.SENSITIVITY_PARAMETERS]}
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
                        handlePopupConfirmation={clear}
                    />
                )}
            </>
        ),
    };

    return (
        <CustomFormProvider
            validationSchema={sensitivityAnalysisMethods.formSchema}
            {...sensitivityAnalysisMethods.formMethods}
        >
            <ParameterLayout
                title="SensitivityAnalysis"
                isLoading={!sensitivityAnalysisMethods.paramsFormInitialized}
                actions={{
                    ...actions,
                    validateOnClick: handleSubmit(sensitivityAnalysisMethods.onSaveInline),
                }}
            >
                <SensitivityAnalysisParametersForm
                    sensitivityAnalysisMethods={sensitivityAnalysisMethods}
                    isDeveloperMode={isDeveloperMode}
                    isRootNode={isRootNode}
                    globalBuildStatus={globalBuildStatus}
                />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
