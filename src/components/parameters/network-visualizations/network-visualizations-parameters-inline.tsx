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
import { User } from 'oidc-client';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { SubmitButton } from '../../inputs';
import { ElementType } from '../../../utils';
import { LabelledButton } from '../common';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { CreateParameterDialog } from '../common/parameters-creation-dialog';
import { NetworkVisualizationParametersForm } from './network-visualizations-form';
import { useNetworkVisualizationParametersForm } from './use-network-visualizations-parameters-form';
import { getNetworkVisualizationsParameters } from '../../../services';
import { NetworkVisualizationParameters } from './network-visualizations.types';
import { snackWithFallback } from '../../../utils/error';

export function NetworkVisualizationParametersInline({
    studyUuid,
    setHaveDirtyFields,
    user,
    parameters,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    user: User | null;
    parameters: NetworkVisualizationParameters | null;
}>) {
    const networkVisuMethods = useNetworkVisualizationParametersForm({
        parametersUuid: null,
        name: null,
        description: null,
        studyUuid,
        parameters,
    });

    const intl = useIntl();
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const { snackError } = useSnackMessage();

    const { reset, getValues, formState, handleSubmit } = networkVisuMethods.formMethods;

    const handleLoadParameters = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
                setOpenSelectParameterDialog(false);
                getNetworkVisualizationsParameters(newParams[0].id)
                    .then((result) => {
                        reset(result, {
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
        <NetworkVisualizationParametersForm
            user={user}
            networkVisuMethods={networkVisuMethods}
            renderActions={() => {
                return (
                    <Box>
                        <Grid container item>
                            <LabelledButton
                                callback={() => setOpenSelectParameterDialog(true)}
                                label="settings.button.chooseSettings"
                            />
                            <LabelledButton callback={() => setOpenCreateParameterDialog(true)} label="save" />
                            <SubmitButton onClick={handleSubmit(networkVisuMethods.onSaveInline)} variant="outlined">
                                <FormattedMessage id="validate" />
                            </SubmitButton>
                        </Grid>
                        {openCreateParameterDialog && (
                            <CreateParameterDialog
                                studyUuid={studyUuid}
                                open={openCreateParameterDialog}
                                onClose={() => setOpenCreateParameterDialog(false)}
                                parameterValues={() => getValues()}
                                parameterFormatter={(newParams) => newParams}
                                parameterType={ElementType.NETWORK_VISUALIZATIONS_PARAMETERS}
                            />
                        )}
                        {openSelectParameterDialog && (
                            <DirectoryItemSelector
                                open={openSelectParameterDialog}
                                onClose={handleLoadParameters}
                                types={[ElementType.NETWORK_VISUALIZATIONS_PARAMETERS]}
                                title={intl.formatMessage({
                                    id: 'showSelectParameterDialog',
                                })}
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
    );
}
