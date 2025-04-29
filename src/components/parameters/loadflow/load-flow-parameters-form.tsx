/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Box, LinearProgress } from '@mui/material';
import { ReactNode } from 'react';
import { UseLoadFlowParametersFormReturn } from './use-load-flow-parameters-form';
import LoadFlowParametersHeader from './load-flow-parameters-header';
import LoadFlowParametersContent from './load-flow-parameters-content';
import { CustomFormProvider } from '../../inputs';

interface LoadFlowParametersFormProps {
    parametersBackend: UseLoadFlowParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
}

export function LoadFlowParametersForm({
    parametersBackend,
    renderTitleFields,
    renderActions,
}: Readonly<LoadFlowParametersFormProps>) {
    const {
        formMethods,
        formSchema,
        selectedTab,
        handleTabChange,
        tabIndexesWithError,
        formattedProviders,
        specificParameters,
        params,
        currentProvider,
        defaultLimitReductions,
        paramsLoaded,
    } = parametersBackend;

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods} removeOptional>
            {renderTitleFields?.()}
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    position: 'relative',
                    flexDirection: 'column',
                }}
            >
                {paramsLoaded ? (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            position: 'relative',
                            flexDirection: 'column',
                        }}
                    >
                        <LoadFlowParametersHeader
                            selectedTab={selectedTab}
                            handleTabChange={handleTabChange}
                            tabIndexesWithError={tabIndexesWithError}
                            formattedProviders={formattedProviders}
                        />
                        <LoadFlowParametersContent
                            selectedTab={selectedTab}
                            currentProvider={currentProvider ?? ''}
                            specificParameters={specificParameters}
                            params={params}
                            defaultLimitReductions={defaultLimitReductions}
                        />
                    </Box>
                ) : (
                    <LinearProgress />
                )}
                {renderActions?.()}
            </Box>
        </CustomFormProvider>
    );
}
