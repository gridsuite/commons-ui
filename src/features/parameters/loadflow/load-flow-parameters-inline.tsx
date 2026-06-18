/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import { LoadFlowProvider } from './load-flow-parameters-provider';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { ComputingType } from '../common/computing-type';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { ElementType, GsLang } from '../../../utils';
import { DirectoryItemSelector } from '../../../components/ui/directoryItemSelector';
import { fetchLoadFlowParameters } from '../../../services/loadflow';
import { CreateParameterDialog } from '../common/parameters-creation-dialog';
import { useLoadFlowParametersForm } from './use-load-flow-parameters-form';
import { LoadFlowParametersForm } from './load-flow-parameters-form';
import { PopupConfirmationDialog } from '../../../components/ui/dialogs';
import { snackWithFallback } from '../../../utils/error';

export function LoadFlowParametersInline({
    studyUuid,
    language,
    parametersBackend,
    setHaveDirtyFields,
    isDeveloperMode,
}: Readonly<{
    studyUuid: UUID | null;
    language: GsLang;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.LOAD_FLOW>;
    setHaveDirtyFields: (isDirty: boolean) => void;
    isDeveloperMode: boolean;
}>) {
    const { resetParameters } = parametersBackend;
    const loadflowMethods = useLoadFlowParametersForm(parametersBackend, isDeveloperMode, null, null, null);

    const intl = useIntl();
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);
    const { snackError } = useSnackMessage();

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

    const { reset, getValues, formState, handleSubmit } = loadflowMethods.formMethods;

    const handleLoadParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
                setOpenSelectParameterDialog(false);
                fetchLoadFlowParameters(newParams[0].id)
                    .then((parameters) => {
                        console.info(`loading the following loadflow parameters : ${parameters.uuid}`);
                        reset(loadflowMethods.toLoadFlowFormValues(parameters), {
                            keepDefaultValues: true,
                        });
                    })
                    .catch((error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
            setOpenSelectParameterDialog(false);
        },
        [loadflowMethods, reset, snackError]
    );

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <LoadFlowProvider>
            <LoadFlowParametersForm
                loadflowMethods={loadflowMethods}
                language={language}
                actions={{
                    preFillOnClick: () => setOpenSelectParameterDialog(true),
                    saveOnClick: () => setOpenCreateParameterDialog(true),
                    resetOnClick: handleResetAllClick,
                    validateOnClick: handleSubmit(loadflowMethods.onSaveInline, loadflowMethods.onValidationError),
                    extra: (
                        <>
                            {openCreateParameterDialog && (
                                <CreateParameterDialog
                                    studyUuid={studyUuid}
                                    open={openCreateParameterDialog}
                                    onClose={() => setOpenCreateParameterDialog(false)}
                                    parameterValues={() => loadflowMethods.formatNewParams(getValues())}
                                    parameterFormatter={(newParams) => newParams}
                                    parameterType={ElementType.LOADFLOW_PARAMETERS}
                                />
                            )}

                            {openSelectParameterDialog && (
                                <DirectoryItemSelector
                                    open={openSelectParameterDialog}
                                    onClose={handleLoadParameter}
                                    types={[ElementType.LOADFLOW_PARAMETERS]}
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
                    ),
                }}
            />
        </LoadFlowProvider>
    );
}
