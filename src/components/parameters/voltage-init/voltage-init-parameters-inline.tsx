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
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { SubmitButton } from '../../inputs';
import { ElementType } from '../../../utils';
import { CreateParameterDialog, LabelledButton } from '../common';
import { useVoltageInitParametersForm } from './use-voltage-init-parameters-form';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { VoltageInitParametersForm } from './voltage-init-parameters-form';
import { VoltageInitStudyParameters } from './voltage-init.type';
import { getVoltageInitParameters, updateVoltageInitParameters } from '../../../services';
import {
    fromVoltageInitParametersFormToParamValues,
    fromVoltageInitParamsDataToFormValues,
} from './voltage-init-form-utils';
import { DEFAULT_GENERAL_APPLY_MODIFICATIONS } from './constants';
import { PopupConfirmationDialog } from '../../dialogs';
import { snackWithFallback } from '../../../utils/error';

export function VoltageInitParametersInLine({
    studyUuid,
    setHaveDirtyFields,
    voltageInitParameters,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    voltageInitParameters: VoltageInitStudyParameters | null;
}>) {
    const voltageInitMethods = useVoltageInitParametersForm({
        parametersUuid: null,
        name: null,
        description: null,
        studyUuid,
        parameters: voltageInitParameters,
    });

    const intl = useIntl();
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);
    const { snackError } = useSnackMessage();

    const { formState, getValues, handleSubmit, reset, trigger } = voltageInitMethods.formMethods;

    const handleLoadParameters = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                setOpenSelectParameterDialog(false);
                const parametersUuid = newParams[0].id;
                getVoltageInitParameters(parametersUuid)
                    .then((params) => {
                        reset(fromVoltageInitParamsDataToFormValues(params), {
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

    const resetVoltageInitParameters = useCallback(() => {
        updateVoltageInitParameters(studyUuid, {
            applyModifications: DEFAULT_GENERAL_APPLY_MODIFICATIONS,
            computationParameters: null, // null means Reset
        }).catch((error) => {
            snackWithFallback(snackError, error, { headerId: 'updateVoltageInitParametersError' });
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

    const handleOpenSaveDialog = useCallback(() => {
        trigger().then((isValid) => {
            if (isValid) {
                setOpenCreateParameterDialog(true);
            }
        });
    }, [trigger]);

    return (
        <VoltageInitParametersForm
            voltageInitMethods={voltageInitMethods}
            renderActions={() => {
                return (
                    <Box>
                        <Grid container item>
                            <LabelledButton
                                callback={() => setOpenSelectParameterDialog(true)}
                                label="settings.button.chooseSettings"
                            />
                            <LabelledButton callback={handleOpenSaveDialog} label="save" />
                            <LabelledButton callback={handleResetClick} label="resetToDefault" />
                            <SubmitButton onClick={handleSubmit(voltageInitMethods.onSaveInline)} variant="outlined">
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
                                    fromVoltageInitParametersFormToParamValues(params).computationParameters
                                }
                                parameterType={ElementType.VOLTAGE_INIT_PARAMETERS}
                            />
                        )}
                        {openSelectParameterDialog && (
                            <DirectoryItemSelector
                                open={openSelectParameterDialog}
                                onClose={handleLoadParameters}
                                types={[ElementType.VOLTAGE_INIT_PARAMETERS]}
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
                                handlePopupConfirmation={resetVoltageInitParameters}
                            />
                        )}
                    </Box>
                );
            }}
        />
    );
}
