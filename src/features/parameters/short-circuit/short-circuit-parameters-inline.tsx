/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { ElementType, UseParametersBackendReturnProps } from '../../../utils';
import { ComputingType, CreateParameterDialog } from '../common';
import { DirectoryItemSelector } from '../../../components/ui/directoryItemSelector';
import { ShortCircuitParametersInfos } from './short-circuit-parameters.type';
import { fetchShortCircuitParameters } from '../../../services/short-circuit-analysis';
import { ShortCircuitParametersForm } from './short-circuit-parameters-form';
import { useShortCircuitParametersForm } from './use-short-circuit-parameters-form';
import { snackWithFallback } from '../../../utils/error';
import { PopupConfirmationDialog } from '../../../components/ui/dialogs';

export function ShortCircuitParametersInLine({
    studyUuid,
    setHaveDirtyFields,
    parametersBackend,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SHORT_CIRCUIT>;
}>) {
    const shortCircuitMethods = useShortCircuitParametersForm({
        parametersBackend,
        parametersUuid: null,
        name: null,
        description: null,
    });

    const intl = useIntl();
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const { resetParameters } = parametersBackend;
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);
    const [pendingResetAction, setPendingResetAction] = useState<'all' | 'parameters' | null>(null);
    const { snackError } = useSnackMessage();

    const { formMethods } = shortCircuitMethods;
    const { getValues, formState, handleSubmit, reset } = formMethods;

    const handleLoadParameters = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                setOpenSelectParameterDialog(false);
                const paramUuid = newParams[0].id;
                fetchShortCircuitParameters(paramUuid)
                    .then((parameters: ShortCircuitParametersInfos) => {
                        // Replace form data with fetched data
                        reset(shortCircuitMethods.toShortCircuitFormValues(parameters), {
                            keepDefaultValues: true,
                        });
                    })
                    .catch((error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
            setOpenSelectParameterDialog(false);
        },
        [snackError, shortCircuitMethods, reset]
    );

    const executeResetAction = useCallback(() => {
        if (pendingResetAction === 'all' || pendingResetAction === 'parameters') {
            resetParameters();
        }
        setOpenResetConfirmation(false);
        setPendingResetAction(null);
    }, [pendingResetAction, resetParameters]);

    const handleResetAllClick = useCallback(() => {
        setPendingResetAction('all');
        setOpenResetConfirmation(true);
    }, []);

    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
        setPendingResetAction(null);
    }, []);

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    const actions = {
        preFillOnClick: () => setOpenSelectParameterDialog(true),
        saveOnClick: () => setOpenCreateParameterDialog(true),
        resetOnClick: handleResetAllClick,
        validateOnClick: handleSubmit(shortCircuitMethods.onSaveInline, shortCircuitMethods.onValidationError),
        extra: (
            <>
                {openCreateParameterDialog && (
                    <CreateParameterDialog
                        studyUuid={studyUuid}
                        open={openCreateParameterDialog}
                        onClose={() => setOpenCreateParameterDialog(false)}
                        parameterValues={() => shortCircuitMethods.formatNewParams(getValues())}
                        parameterFormatter={(newParams) => newParams}
                        parameterType={ElementType.SHORT_CIRCUIT_PARAMETERS}
                    />
                )}
                {openSelectParameterDialog && (
                    <DirectoryItemSelector
                        open={openSelectParameterDialog}
                        onClose={handleLoadParameters}
                        types={[ElementType.SHORT_CIRCUIT_PARAMETERS]}
                        title={intl.formatMessage({
                            id: 'showSelectParameterDialog',
                        })}
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
    };

    return <ShortCircuitParametersForm shortCircuitMethods={shortCircuitMethods} actions={actions} />;
}
