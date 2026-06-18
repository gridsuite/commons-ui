/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { ReactNode } from 'react';
import { UseLoadFlowParametersFormReturn } from './use-load-flow-parameters-form';
import LoadFlowParametersHeader from './load-flow-parameters-header';
import LoadFlowParametersContent from './load-flow-parameters-content';
import { CustomFormProvider } from '../../../components/ui';
import { ParameterLayout, ParameterActions } from '../common';
import type { GsLang } from '../../../utils/langs';
import type { MuiStyles } from '../../../utils/styles';

interface LoadFlowParametersFormProps {
    loadflowMethods: UseLoadFlowParametersFormReturn;
    language: GsLang;
    renderTitleFields?: () => ReactNode;
    actions?: ParameterActions;
}

const styles = {
    form: {
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        maxHeight: '100%',
    },
    loadflowParameters: {
        flexGrow: 1,
        paddingLeft: 1,
        overflow: 'auto',
    },
    actions: {
        flexGrow: 0,
    },
    content: (theme) => ({
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        flexGrow: 1,
    }),
} as const satisfies MuiStyles;

export function LoadFlowParametersForm({
    loadflowMethods,
    language,
    renderTitleFields,
    actions,
}: Readonly<LoadFlowParametersFormProps>) {
    const {
        formMethods,
        formSchema,
        selectedTab,
        handleTabChange,
        tabIndexesWithError,
        formattedProviders,
        specificParametersDescriptionForProvider,
        params,
        watchProvider,
        defaultLimitReductions,
        paramsLoaded,
    } = loadflowMethods;

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods} removeOptional language={language}>
            <ParameterLayout
                title="LoadFlow"
                header={
                    <>
                        {renderTitleFields?.()}
                        {paramsLoaded && (
                            <LoadFlowParametersHeader
                                selectedTab={selectedTab}
                                handleTabChange={handleTabChange}
                                tabIndexesWithError={tabIndexesWithError}
                                formattedProviders={formattedProviders}
                            />
                        )}
                    </>
                }
                isLoading={!paramsLoaded}
                actions={actions}
                contentSx={{ paddingLeft: 1 }}
            >
                <Grid container sx={styles.content}>
                    <LoadFlowParametersContent
                        selectedTab={selectedTab}
                        currentProvider={watchProvider ?? ''}
                        specificParameters={specificParametersDescriptionForProvider}
                        params={params}
                        defaultLimitReductions={defaultLimitReductions}
                    />
                </Grid>
            </ParameterLayout>
        </CustomFormProvider>
    );
}
