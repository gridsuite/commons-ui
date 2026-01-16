/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { SubmitButton } from '../../inputs';
import { ElementType, UseParametersBackendReturnProps } from '../../../utils';
import { ComputingType, LabelledButton } from '../common';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { CreateParameterDialog } from '../common/parameters-creation-dialog';
import { ShortCircuitParametersInfos } from './short-circuit-parameters.type';
import { fetchShortCircuitParameters } from '../../../services/short-circuit-analysis';
import { ShortCircuitParametersForm } from './short-circuit-parameters-form';
import { useShortCircuitParametersForm } from './use-short-circuit-parameters-form';
import { snackWithFallback } from '../../../utils/error';
import { PopupConfirmationDialog } from '../../dialogs';

export function ShortCircuitParametersInLine({
    studyUuid,
    setHaveDirtyFields,
    parametersBackend,
    isDeveloperMode,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SHORT_CIRCUIT>;
    isDeveloperMode: boolean;
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
    const [, , , , resetProvider, , , , resetParameters, ,] = parametersBackend;
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
        if (pendingResetAction === 'all') {
            resetParameters();
            resetProvider();
        } else if (pendingResetAction === 'parameters') {
            resetParameters();
        }
        setOpenResetConfirmation(false);
        setPendingResetAction(null);
    }, [pendingResetAction, resetParameters, resetProvider]);

    const handleResetAllClick = useCallback(() => {
        setPendingResetAction('all');
        setOpenResetConfirmation(true);
    }, []);

    const handleResetParametersClick = useCallback(() => {
        setPendingResetAction('parameters');
        setOpenResetConfirmation(true);
    }, []);

    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
        setPendingResetAction(null);
    }, []);

    useEffect(() => {
        setHaveDirtyFields(!!Object.keys(formState.dirtyFields).length);
    }, [formState, setHaveDirtyFields]);

    return (
        <ShortCircuitParametersForm
            shortCircuitMethods={shortCircuitMethods}
            isDeveloperMode={isDeveloperMode}
            renderActions={() => {
                return (
                    <Box>
                        <Grid container item>
                            <LabelledButton
                                callback={() => setOpenSelectParameterDialog(true)}
                                label="settings.button.chooseSettings"
                            />
                            <LabelledButton callback={() => setOpenCreateParameterDialog(true)} label="save" />
                            <LabelledButton callback={handleResetAllClick} label="resetToDefault" />
                            <LabelledButton
                                label="resetProviderValuesToDefault"
                                callback={handleResetParametersClick}
                            />
                            <SubmitButton
                                onClick={handleSubmit(
                                    shortCircuitMethods.onSaveInline,
                                    shortCircuitMethods.onValidationError
                                )}
                                variant="outlined"
                            >
                                <FormattedMessage id="validate" />
                            </SubmitButton>
                        </Grid>
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
                    </Box>
                );
            }}
        />
    );
}
