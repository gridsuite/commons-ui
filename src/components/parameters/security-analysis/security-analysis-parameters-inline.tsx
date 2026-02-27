/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import type { UUID } from 'node:crypto';
import { ElementType, mergeSx, UseParametersBackendReturnProps } from '../../../utils';
import { ComputingType, CreateParameterDialog, LabelledButton, LineSeparator } from '../common';
import { useSnackMessage } from '../../../hooks';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { SubmitButton } from '../../inputs';
import { parametersStyles } from '../parameters-style';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { fetchSecurityAnalysisParameters } from '../../../services/security-analysis';
import { useSecurityAnalysisParametersForm } from './use-security-analysis-parameters-form';
import { SecurityAnalysisParametersForm } from './security-analysis-parameters-form';
import { PopupConfirmationDialog } from '../../dialogs';
import { snackWithFallback } from '../../../utils/error';
import { SAParameters } from './types';
import { toFormValueSaParameters } from './columns-definitions';

export function SecurityAnalysisParametersInline({
    studyUuid,
    parametersBackend,
    fetchContingencyCount,
    setHaveDirtyFields,
    isDeveloperMode,
}: Readonly<{
    studyUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SECURITY_ANALYSIS>;
    fetchContingencyCount: (contingencyListIds: UUID[] | null) => Promise<number>;
    setHaveDirtyFields: (isDirty: boolean) => void;
    isDeveloperMode: boolean;
}>) {
    const securityAnalysisMethods = useSecurityAnalysisParametersForm(parametersBackend, null, null, null);

    const { resetParameters } = parametersBackend;
    const intl = useIntl();
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);

    const { snackError } = useSnackMessage();

    const { handleSubmit, formState, reset, getValues } = securityAnalysisMethods.formMethods;

    const executeResetAction = useCallback(() => {
        resetParameters();
        setOpenResetConfirmation(false);
    }, [resetParameters]);

    const handleResetAllClick = useCallback(() => {
        setOpenResetConfirmation(true);
    }, []);

    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
    }, []);

    const handleLoadParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
                setOpenSelectParameterDialog(false);
                fetchSecurityAnalysisParameters(newParams[0].id)
                    .then((parameters: SAParameters) => {
                        console.info(`loading the following security analysis parameters :  ${parameters.uuid}`);
                        reset(toFormValueSaParameters(parameters), {
                            keepDefaultValues: true,
                        });
                    })
                    .catch((error) => {
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

    return (
        <SecurityAnalysisParametersForm
            securityAnalysisMethods={securityAnalysisMethods}
            fetchContingencyCount={fetchContingencyCount}
            showContingencyCount
            isDeveloperMode={isDeveloperMode}
            renderActions={() => {
                return (
                    <>
                        <Box sx={{ flexGrow: 0 }}>
                            <LineSeparator />
                            <Grid
                                container
                                item
                                sx={mergeSx(parametersStyles.controlParametersItem, parametersStyles.marginTopButton, {
                                    paddingBottom: 0,
                                })}
                            >
                                <LabelledButton
                                    callback={() => setOpenSelectParameterDialog(true)}
                                    label="settings.button.chooseSettings"
                                />
                                <LabelledButton callback={() => setOpenCreateParameterDialog(true)} label="save" />
                                <LabelledButton callback={handleResetAllClick} label="resetToDefault" />
                                <SubmitButton
                                    onClick={handleSubmit(securityAnalysisMethods.onSaveInline)}
                                    variant="outlined"
                                >
                                    <FormattedMessage id="validate" />
                                </SubmitButton>
                            </Grid>
                        </Box>
                        {openCreateParameterDialog && (
                            <CreateParameterDialog
                                studyUuid={studyUuid}
                                open={openCreateParameterDialog}
                                onClose={() => setOpenCreateParameterDialog(false)}
                                parameterValues={() => securityAnalysisMethods.formatNewParams(getValues())}
                                parameterFormatter={(newParams) => newParams}
                                parameterType={ElementType.SECURITY_ANALYSIS_PARAMETERS}
                            />
                        )}
                        {openSelectParameterDialog && (
                            <DirectoryItemSelector
                                open={openSelectParameterDialog}
                                onClose={handleLoadParameter}
                                types={[ElementType.SECURITY_ANALYSIS_PARAMETERS]}
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
                                handlePopupConfirmation={executeResetAction}
                            />
                        )}
                    </>
                );
            }}
        />
    );
}
