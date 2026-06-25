/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { useIntl } from 'react-intl';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { ComputingType } from '../common/computing-type';
import { ElementType, snackWithFallback } from '../../../utils';
import { DynamicMarginCalculationForm } from './dynamic-margin-calculation-form';
import {
    toFormValues,
    toParamsInfos,
    useDynamicMarginCalculationParametersForm,
} from './use-dynamic-margin-calculation-parameters-form';
import { ParameterLayout, ParameterActions } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { PopupConfirmationDialog } from '../../../components/ui/dialogs/popupConfirmationDialog/PopupConfirmationDialog';
import { DirectoryItemSelector } from '../../../components/ui/directoryItemSelector';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { fetchDynamicMarginCalculationParameters } from '../../../services/dynamic-margin-calculation';
import { useSnackMessage } from '../../../hooks';
import { useTabs } from '../common/hook/use-tabs';
import { TabValues } from './dynamic-margin-calculation.type';
import { CreateParameterDialog } from '../common/parameters-creation-dialog';

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
    const { providers, params, updateParameters, resetParameters } = parametersBackend;
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

    const { formMethods } = dynamicMarginCalculationMethods;
    const { reset, getValues, formState, handleSubmit } = formMethods;

    const { onError } = useTabs({
        defaultTab: Object.values(TabValues)[0],
        tabEnum: TabValues,
    });

    const handleResetClick = useCallback(() => {
        setOpenResetConfirmation(true);
    }, []);
    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
    }, []);

    const handleReset = useCallback(() => {
        resetParameters();
        setOpenResetConfirmation(false);
    }, [resetParameters]);

    const onSubmit = useCallback(
        (formData: FieldValues) => {
            // update params after convert form representation to dto representation
            updateParameters(toParamsInfos(formData));
        },
        [updateParameters]
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
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    const actions: ParameterActions = {
        preFillOnClick: () => setOpenSelectParameterDialog(true),
        saveOnClick: () => setOpenCreateParameterDialog(true),
        resetOnClick: handleResetClick,
        extra: (
            <>
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
        ),
    };

    return (
        <CustomFormProvider validationSchema={dynamicMarginCalculationMethods.formSchema} {...formMethods}>
            <ParameterLayout
                title="DynamicMarginCalculation"
                isLoading={!dynamicMarginCalculationMethods.paramsLoaded}
                actions={{
                    ...actions,
                    validateOnClick: handleSubmit(onSubmit, onError),
                }}
            >
                <DynamicMarginCalculationForm dynamicMarginCalculationMethods={dynamicMarginCalculationMethods} />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
