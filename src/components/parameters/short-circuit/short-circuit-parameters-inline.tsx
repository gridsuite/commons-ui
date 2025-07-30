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
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { SubmitButton } from '../../inputs';
import { ElementType } from '../../../utils';
import { LabelledButton } from '../common';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { CreateParameterDialog } from '../common/parameters-creation-dialog';
import { ShortCircuitParametersInfos } from './short-circuit-parameters.type';
import {
    InitialVoltage,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_PREDEFINED_PARAMS,
    SHORT_CIRCUIT_WITH_FEEDER_RESULT,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import { fetchShortCircuitParameters } from '../../../services/short-circuit-analysis';
import { ShortCircuitParametersForm } from './short-circuit-parameters-form';
import { useShortCircuitParametersForm } from './use-short-circuit-parameters-form';

export function ShortCircuitParametersInLine({
    studyUuid,
    setHaveDirtyFields,
    shortCircuitParameters,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: Dispatch<SetStateAction<boolean>>;
    shortCircuitParameters: ShortCircuitParametersInfos | null;
}>) {
    const shortCircuitMethods = useShortCircuitParametersForm({
        parametersUuid: null,
        name: null,
        description: null,
        studyUuid,
        studyShortCircuitParameters: shortCircuitParameters,
    });

    const intl = useIntl();
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const { snackError } = useSnackMessage();

    const { getCurrentValues, formMethods } = shortCircuitMethods;
    const { setValue, formState, handleSubmit } = formMethods;

    const replaceFormValues = useCallback(
        (param: ShortCircuitParametersInfos) => {
            const dirty = { shouldDirty: true };
            setValue(SHORT_CIRCUIT_WITH_FEEDER_RESULT, param.parameters.withFeederResult, dirty);
            setValue(SHORT_CIRCUIT_PREDEFINED_PARAMS, param.predefinedParameters, dirty);
            setValue(SHORT_CIRCUIT_WITH_LOADS, param.parameters.withLoads, dirty);
            setValue(SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS, param.parameters.withVSCConverterStations, dirty);
            setValue(SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS, param.parameters.withShuntCompensators, dirty);
            setValue(SHORT_CIRCUIT_WITH_NEUTRAL_POSITION, !param.parameters.withNeutralPosition, dirty);
            setValue(
                SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
                param.parameters.initialVoltageProfileMode === InitialVoltage.CONFIGURED
                    ? InitialVoltage.CEI909
                    : param.parameters.initialVoltageProfileMode,
                dirty
            );
        },
        [setValue]
    );

    const handleLoadParameters = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                setOpenSelectParameterDialog(false);
                const paramUuid = newParams[0].id;
                fetchShortCircuitParameters(paramUuid)
                    .then((parameters: ShortCircuitParametersInfos) => {
                        // Replace form data with fetched data
                        replaceFormValues(parameters);
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
        [snackError, replaceFormValues]
    );

    useEffect(() => {
        setHaveDirtyFields(!!Object.keys(formState.dirtyFields).length);
    }, [formState, setHaveDirtyFields]);

    return (
        <ShortCircuitParametersForm
            shortCircuitMethods={shortCircuitMethods}
            renderActions={() => {
                return (
                    <Box>
                        <Grid container item>
                            <LabelledButton
                                callback={() => setOpenSelectParameterDialog(true)}
                                label="settings.button.chooseSettings"
                            />
                            <LabelledButton callback={() => setOpenCreateParameterDialog(true)} label="save" />
                            <SubmitButton onClick={handleSubmit(shortCircuitMethods.onSaveInline)} variant="outlined">
                                <FormattedMessage id="validate" />
                            </SubmitButton>
                        </Grid>
                        {openCreateParameterDialog && (
                            <CreateParameterDialog
                                studyUuid={studyUuid}
                                open={openCreateParameterDialog}
                                onClose={() => setOpenCreateParameterDialog(false)}
                                parameterValues={() => getCurrentValues()}
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
                    </Box>
                );
            }}
        />
    );
}
