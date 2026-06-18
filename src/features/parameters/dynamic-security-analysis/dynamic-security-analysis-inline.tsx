/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { ComputingType } from '../common/computing-type';
import { ElementType } from '../../../utils';
import {
    toParamsInfos,
    useDynamicSecurityAnalysisParametersForm,
} from './use-dynamic-security-analysis-parameters-form';
import { PopupConfirmationDialog } from '../../../components/ui/dialogs/popupConfirmationDialog/PopupConfirmationDialog';
import { CreateParameterDialog } from '../common';
import { DynamicSecurityAnalysisParametersForm } from './dynamic-security-analysis-parameters-form';
import { CustomFormProvider } from '../../../components/ui';

type DynamicSecurityAnalysisInlineProps = {
    studyUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.DYNAMIC_SECURITY_ANALYSIS>;
    setHaveDirtyFields: (isDirty: boolean) => void;
};

export function DynamicSecurityAnalysisInline({
    studyUuid,
    parametersBackend,
    setHaveDirtyFields,
}: Readonly<DynamicSecurityAnalysisInlineProps>) {
    const { providers, params, updateParameters, resetParameters } = parametersBackend;
    const dynamicSecurityAnalysisMethods = useDynamicSecurityAnalysisParametersForm({
        providers,
        params,
        name: null,
        description: null,
    });
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);

    const { formSchema, formMethods } = dynamicSecurityAnalysisMethods;
    const { getValues, formState } = formMethods;

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

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    const actions = {
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
                        parameterType={ElementType.DYNAMIC_SECURITY_ANALYSIS_PARAMETERS}
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
        <CustomFormProvider validationSchema={formSchema} {...formMethods}>
            <DynamicSecurityAnalysisParametersForm
                dynamicSecurityAnalysisMethods={dynamicSecurityAnalysisMethods}
                onSubmit={onSubmit}
                actions={actions}
            />
        </CustomFormProvider>
    );
}
