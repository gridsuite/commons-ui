/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button, DialogActions, Grid } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import {
    ElementType,
    mergeSx,
    SensitivityAnalysisParametersInfos,
    UseParametersBackendReturnProps,
} from '../../../utils';
import { ComputingType, CreateParameterDialog } from '../common';
import { useSnackMessage } from '../../../hooks';
import { SubmitButton } from '../../inputs';
import { parametersStyles } from '../parameters-style';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import {
    fetchSensitivityAnalysisParameters,
    setSensitivityAnalysisParameters,
} from '../../../services/sensitivity-analysis';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { useSensitivityAnalysisParametersForm } from './use-sensitivity-analysis-parameters';
import { SensitivityAnalysisParametersForm } from './sensitivity-analysis-parameters-form';
import { PopupConfirmationDialog } from '../../dialogs';
import { snackWithFallback } from '../../../utils/error';

interface SensitivityAnalysisParametersProps {
    studyUuid: UUID | null;
    currentNodeUuid: UUID | null;
    currentRootNetworkUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SENSITIVITY_ANALYSIS>;
    setHaveDirtyFields: (isDirty: boolean) => void;
    isNodeBuilt: boolean | undefined;
    isDeveloperMode: boolean;
}

export function SensitivityAnalysisParametersInline({
    studyUuid,
    currentNodeUuid,
    currentRootNetworkUuid,
    parametersBackend,
    setHaveDirtyFields,
    isNodeBuilt,
    isDeveloperMode,
}: Readonly<SensitivityAnalysisParametersProps>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    console.info(`isNodeBuilt : ${isNodeBuilt}`);
    const sensitivityAnalysisMethods = useSensitivityAnalysisParametersForm({
        studyUuid,
        currentNodeUuid,
        currentRootNetworkUuid,
        parametersBackend,
        name: null,
        description: null,
        parametersUuid: null,
    });

    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);

    const { reset, handleSubmit, formState, getValues } = sensitivityAnalysisMethods.formMethods;

    const handleSensibilityParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
                setOpenSelectParameterDialog(false);
                fetchSensitivityAnalysisParameters(newParams[0].id)
                    .then((parameters: SensitivityAnalysisParametersInfos) => {
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
        setHaveDirtyFields(!!Object.keys(formState.dirtyFields).length);
    }, [formState, setHaveDirtyFields]);

    return (
        <SensitivityAnalysisParametersForm
            sensitivityAnalysisMethods={sensitivityAnalysisMethods}
            isDeveloperMode={isDeveloperMode}
            renderActions={() => {
                return (
                    <>
                        <Grid item container>
                            <DialogActions
                                sx={mergeSx(parametersStyles.controlParametersItem, {
                                    paddingLeft: 0,
                                    paddingBottom: 2,
                                })}
                            >
                                <Button onClick={() => setOpenSelectParameterDialog(true)}>
                                    <FormattedMessage id="settings.button.chooseSettings" />
                                </Button>
                                <Button onClick={() => setOpenCreateParameterDialog(true)}>
                                    <FormattedMessage id="save" />
                                </Button>
                                <Button onClick={handleResetClick}>
                                    <FormattedMessage id="resetToDefault" />
                                </Button>
                                <SubmitButton
                                    onClick={handleSubmit(sensitivityAnalysisMethods.onSaveInline)}
                                    variant="outlined"
                                    disabled={
                                        sensitivityAnalysisMethods.isLoading ||
                                        sensitivityAnalysisMethods.isMaxResultsReached ||
                                        sensitivityAnalysisMethods.isMaxVariablesReached
                                    }
                                >
                                    <FormattedMessage id="validate" />
                                </SubmitButton>
                            </DialogActions>
                        </Grid>
                        {openCreateParameterDialog && (
                            <CreateParameterDialog
                                studyUuid={studyUuid}
                                open={openCreateParameterDialog}
                                onClose={() => setOpenCreateParameterDialog(false)}
                                parameterValues={() => sensitivityAnalysisMethods.formatNewParams(getValues())}
                                parameterFormatter={(newParams) => newParams}
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
                );
            }}
        />
    );
}
