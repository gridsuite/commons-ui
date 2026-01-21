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
import { useSnackMessage } from '../../../hooks';
import { SubmitButton } from '../../inputs';
import { CreateParameterDialog, LabelledButton } from '../common';
import { PopupConfirmationDialog } from '../../dialogs';
import { UsePccMinParametersForm } from './use-pcc-min-parameters-form';
import { PccMinParametersForm } from './pcc-min-parameters-form';
import { fetchPccMinParameters, PccMinParameters, updatePccMinParameters } from '../../../services/pcc-min';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { ElementType, snackWithFallback } from '../../../utils';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { fromPccMinParametersFormToParamValues, fromPccMinParamsDataToFormValues } from './pcc-min-form-utils';

export function PccMinParametersInLine({
    studyUuid,
    setHaveDirtyFields,
    pccMinParameters,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    pccMinParameters: PccMinParameters | null;
}>) {
    const pccMinMethods = UsePccMinParametersForm({
        parametersUuid: null,
        name: null,
        description: null,
        studyUuid,
        parameters: pccMinParameters,
    });

    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);
    const { snackError } = useSnackMessage();

    const intl = useIntl();
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const { formState, handleSubmit, reset, getValues } = pccMinMethods.formMethods;
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);

    const resetPccMinParameters = useCallback(() => {
        updatePccMinParameters(studyUuid, null) // null means Reset
            .catch((error) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'updatePccMinParametersError',
                });
            });

        setOpenResetConfirmation(false);
    }, [studyUuid, snackError]);

    const handleResetClick = useCallback(() => {
        setOpenResetConfirmation(true);
    }, []);

    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
    }, []);

    useEffect(() => {
        setHaveDirtyFields(!!Object.keys(formState.dirtyFields).length);
    }, [formState, setHaveDirtyFields]);

    const handleLoadParameters = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                setOpenSelectParameterDialog(false);
                const parametersUuid = newParams[0].id;
                fetchPccMinParameters(parametersUuid)
                    .then((params) => {
                        reset(fromPccMinParamsDataToFormValues(params), {
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

    return (
        <PccMinParametersForm
            pccMinMethods={pccMinMethods}
            renderActions={() => {
                return (
                    <Box>
                        <Grid container item>
                            <LabelledButton
                                callback={() => setOpenSelectParameterDialog(true)}
                                label="settings.button.chooseSettings"
                            />
                            <LabelledButton callback={() => setOpenCreateParameterDialog(true)} label="save" />
                            <LabelledButton callback={handleResetClick} label="resetToDefault" />

                            <SubmitButton onClick={handleSubmit(pccMinMethods.onSaveInline)} variant="outlined">
                                <FormattedMessage id="validate" />
                            </SubmitButton>
                        </Grid>
                        {openCreateParameterDialog && (
                            <CreateParameterDialog
                                studyUuid={studyUuid}
                                open={openCreateParameterDialog}
                                onClose={() => setOpenCreateParameterDialog(false)}
                                parameterValues={getValues}
                                parameterFormatter={(params: Record<string, any>) =>
                                    fromPccMinParametersFormToParamValues(params)
                                }
                                parameterType={ElementType.PCC_MIN_PARAMETERS}
                            />
                        )}
                        {openSelectParameterDialog && (
                            <DirectoryItemSelector
                                open={openSelectParameterDialog}
                                onClose={handleLoadParameters}
                                types={[ElementType.PCC_MIN_PARAMETERS]}
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
                                handlePopupConfirmation={resetPccMinParameters}
                            />
                        )}
                    </Box>
                );
            }}
        />
    );
}
