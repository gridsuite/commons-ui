/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect } from 'react';
import type { UUID } from 'node:crypto';
import type { UserProfile } from 'oidc-client-ts';
import { useSnackMessage } from '../../../hooks';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { ElementType } from '../../../utils';
import { NetworkVisualizationParametersForm } from './network-visualizations-form';
import { useNetworkVisualizationParametersForm } from './use-network-visualizations-parameters-form';
import { getNetworkVisualizationsParameters } from '../../../services';
import { NetworkVisualizationParameters } from './network-visualizations.types';
import { snackWithFallback } from '../../../utils/error';
import { ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';

export function NetworkVisualizationParametersInline({
    studyUuid,
    setHaveDirtyFields,
    userProfile,
    parameters,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    userProfile: UserProfile | null;
    parameters: NetworkVisualizationParameters | null;
}>) {
    const networkVisuMethods = useNetworkVisualizationParametersForm({
        parametersUuid: null,
        name: null,
        description: null,
        studyUuid,
        parameters,
    });

    const { snackError } = useSnackMessage();

    const { reset, getValues, formState, handleSubmit } = networkVisuMethods.formMethods;

    const handleLoadParameters = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
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
        },
        [reset, snackError]
    );

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <CustomFormProvider
            validationSchema={networkVisuMethods.formSchema}
            {...networkVisuMethods.formMethods}
            removeOptional
        >
            <ParameterLayout
                title="NetworkVisualizations"
                isLoading={networkVisuMethods.paramsLoading}
                parameterType={ElementType.NETWORK_VISUALIZATIONS_PARAMETERS}
                createParameter={{
                    studyUuid,
                    getParameterValues: getValues,
                    parameterFormatter: (newParams) => newParams,
                }}
                selectParameterHandler={handleLoadParameters}
                validateHandler={handleSubmit(networkVisuMethods.onSaveInline)}
            >
                <NetworkVisualizationParametersForm userProfile={userProfile} networkVisuMethods={networkVisuMethods} />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
