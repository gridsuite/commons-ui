/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { UUID } from 'crypto';
import { LoadFlowProvider } from './load-flow-parameters-provider';
import { parametersStyles } from '../parameters-style';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { ComputingType } from '../common/computing-type';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { SubmitButton } from '../../inputs';
import { LabelledButton } from '../common/parameters';
import { ElementType, mergeSx } from '../../../utils';
import { LineSeparator } from '../common';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { fetchLoadFlowParameters } from '../../../services/loadflow';
import { CreateParameterDialog } from '../common/parameters-creation-dialog';
import { useLoadFlowParametersForm } from './use-load-flow-parameters-form';
import { LoadFlowParametersForm } from './load-flow-parameters-form';

export function LoadFlowParametersInline({
    studyUuid,
    parametersBackend,
    setHaveDirtyFields,
    enableDeveloperMode,
}: Readonly<{
    studyUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.LOAD_FLOW>;
    setHaveDirtyFields: Dispatch<SetStateAction<boolean>>;
    enableDeveloperMode: boolean;
}>) {
    const [, , , , resetProvider, , , , resetParameters, , ,] = parametersBackend;
    const loadflowMethods = useLoadFlowParametersForm(parametersBackend, enableDeveloperMode, null, null, null);

    const intl = useIntl();
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const { snackError } = useSnackMessage();

    const resetLFParametersAndProvider = useCallback(() => {
        resetParameters();
        resetProvider();
    }, [resetParameters, resetProvider]);

    const resetLFParameters = useCallback(() => {
        resetParameters();
    }, [resetParameters]);

    const { reset, getValues, formState, handleSubmit } = loadflowMethods.formMethods;

    const handleLoadParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
                setOpenSelectParameterDialog(false);
                fetchLoadFlowParameters(newParams[0].id)
                    .then((parameters) => {
                        loadflowMethods.setCurrentProvider(parameters.provider);
                        console.info(`loading the following loadflow parameters : ${parameters.uuid}`);
                        reset(loadflowMethods.toLoadFlowFormValues(parameters), {
                            keepDefaultValues: true,
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        snackError({
                            messageTxt: error.message,
                            headerId: 'paramsRetrievingError',
                        });
                    });
            }
            setOpenSelectParameterDialog(false);
        },
        [loadflowMethods, reset, snackError]
    );

    useEffect(() => {
        setHaveDirtyFields(!!Object.keys(formState.dirtyFields).length);
    }, [formState, setHaveDirtyFields]);

    return (
        <LoadFlowProvider>
            <LoadFlowParametersForm
                loadflowMethods={loadflowMethods}
                renderActions={() => {
                    return (
                        <Box>
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
                                <LabelledButton callback={resetLFParametersAndProvider} label="resetToDefault" />
                                <LabelledButton label="resetProviderValuesToDefault" callback={resetLFParameters} />
                                <SubmitButton
                                    onClick={handleSubmit(
                                        loadflowMethods.onSaveInline,
                                        loadflowMethods.onValidationError
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
                        </Box>
                    );
                }}
            />
        </LoadFlowProvider>
    );
}
