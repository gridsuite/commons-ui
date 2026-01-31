/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { Grid } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCallback, useEffect, useState } from 'react';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { ComputingType } from '../common/computing-type';
import { ElementType, mergeSx, snackWithFallback } from '../../../utils';
import { DynamicMarginCalculationForm } from './dynamic-margin-calculation-form';
import {
    toFormValues,
    toParamsInfos,
    useDynamicMarginCalculationParametersForm,
} from './use-dynamic-margin-calculation-parameters-form';
import { LabelledButton } from '../common/parameters';
import { SubmitButton } from '../../inputs/reactHookForm/utils/SubmitButton';
import { PopupConfirmationDialog } from '../../dialogs/popupConfirmationDialog/PopupConfirmationDialog';
import { parametersStyles } from '../parameters-style';
import { CreateParameterDialog } from '../common';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { fetchDynamicMarginCalculationParameters } from '../../../services/dynamic-margin-calculation';
import { useSnackMessage } from '../../../hooks';

type DynamicMarginCalculationInlineProps = {
    studyUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.DYNAMIC_MARGIN_CALCULATION>;
    setHaveDirtyFields: (isDirty: boolean) => void;
};
export function DynamicMarginCalculationInline({
    studyUuid,
    parametersBackend,
    setHaveDirtyFields,
}: Readonly<DynamicMarginCalculationInlineProps>) {
    const [providers, , , , , params, , updateParams, resetParams, ,] = parametersBackend;
    const dynamicMarginCalculationMethods = useDynamicMarginCalculationParametersForm({
        providers,
        params,
        name: null,
        description: null,
    });
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);

    const { formMethods, onError } = dynamicMarginCalculationMethods;
    const { reset, handleSubmit, getValues, formState } = formMethods;

    const handleResetClick = useCallback(() => {
        setOpenResetConfirmation(true);
    }, []);
    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
    }, []);

    const handleReset = useCallback(() => {
        resetParams();
        setOpenResetConfirmation(false);
    }, [resetParams]);

    const onSubmit = useCallback(
        (formData: Record<string, any>) => {
            // update params after convert form representation to dto representation
            updateParams(toParamsInfos(formData));
        },
        [updateParams]
    );

    const handleLoadParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                setOpenSelectParameterDialog(false);
                const parametersUuid = newParams[0].id;
                fetchDynamicMarginCalculationParameters(parametersUuid)
                    .then((_params) => {
                        reset(toFormValues(_params), {
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

    useEffect(() => {
        setHaveDirtyFields(!!Object.keys(formState.dirtyFields).length);
    }, [formState, setHaveDirtyFields]);

    const renderActions = () => {
        return (
            <>
                <Grid container item>
                    <Grid
                        sx={mergeSx(parametersStyles.controlParametersItem, {
                            paddingBottom: 2,
                            paddingLeft: 0,
                        })}
                    >
                        <LabelledButton callback={handleResetClick} label="resetToDefault" />
                        <SubmitButton variant="outlined" onClick={handleSubmit(onSubmit, onError)}>
                            <FormattedMessage id="validate" />
                        </SubmitButton>
                    </Grid>
                </Grid>
                {openCreateParameterDialog && (
                    <CreateParameterDialog
                        studyUuid={studyUuid}
                        open={openCreateParameterDialog}
                        onClose={() => setOpenCreateParameterDialog(false)}
                        parameterValues={getValues}
                        parameterFormatter={toParamsInfos}
                        parameterType={ElementType.DYNAMIC_MARGIN_CALCULATION_PARAMETERS}
                    />
                )}
                {openSelectParameterDialog && (
                    <DirectoryItemSelector
                        open={openSelectParameterDialog}
                        onClose={handleLoadParameter}
                        types={[ElementType.DYNAMIC_MARGIN_CALCULATION_PARAMETERS]}
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
                        handlePopupConfirmation={handleReset}
                    />
                )}
            </>
        );
    };
    return (
        <DynamicMarginCalculationForm
            dynamicMarginCalculationMethods={dynamicMarginCalculationMethods}
            renderActions={renderActions}
        />
    );
}
