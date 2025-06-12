/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid, LinearProgress, Tab, Tabs } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { User } from 'oidc-client';
import { UseNetworkVisualizationParametersFormReturn } from './use-network-visualizations-parameters-form';
import { CustomFormProvider } from '../../inputs';
import { NetworkVisualizationTabValues as TabValues } from './constants';
import { MapParameters } from './map-parameters';
import { SingleLineDiagramParameters } from './single-line-diagram-parameters';
import { NetworkAreaDiagramParameters } from './network-area-diagram-parameters';
import { TabPanel } from '../common';
import { getAvailableComponentLibraries } from '../../../services';

const useGetAvailableComponentLibraries = (user: User | null) => {
    const [componentLibraries, setComponentLibraries] = useState<string[]>([]);

    useEffect(() => {
        if (user !== null) {
            getAvailableComponentLibraries().then((libraries) => {
                if (libraries != null) {
                    setComponentLibraries(libraries);
                }
            });
        }
    }, [user]);

    return componentLibraries;
};

interface NetworkVisualizationParametersFormProps {
    networkVisuMethods: UseNetworkVisualizationParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
    user: User | null;
}

export function NetworkVisualizationParametersForm({
    networkVisuMethods,
    renderTitleFields,
    renderActions,
    user,
}: Readonly<NetworkVisualizationParametersFormProps>) {
    const componentLibraries = useGetAvailableComponentLibraries(user);
    const { formMethods, formSchema, selectedTab, handleTabChange, paramsLoading } = networkVisuMethods;

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods} removeOptional>
            <Grid container direction="column">
                <Grid item container direction="column">
                    {renderTitleFields?.()}
                </Grid>
                {paramsLoading ? (
                    <LinearProgress />
                ) : (
                    <Grid item container direction="column">
                        <Tabs value={selectedTab} variant="scrollable" onChange={handleTabChange}>
                            <Tab label={<FormattedMessage id="Map" />} value={TabValues.MAP} />
                            <Tab
                                label={<FormattedMessage id="SingleLineDiagram" />}
                                value={TabValues.SINGLE_LINE_DIAGRAM}
                            />
                            <Tab
                                label={<FormattedMessage id="NetworkAreaDiagram" />}
                                value={TabValues.NETWORK_AREA_DIAGRAM}
                            />
                        </Tabs>
                        <TabPanel value={selectedTab} index={TabValues.MAP}>
                            <MapParameters />
                        </TabPanel>
                        <TabPanel value={selectedTab} index={TabValues.SINGLE_LINE_DIAGRAM}>
                            <SingleLineDiagramParameters componentLibraries={componentLibraries} />
                        </TabPanel>
                        <TabPanel value={selectedTab} index={TabValues.NETWORK_AREA_DIAGRAM}>
                            <NetworkAreaDiagramParameters />
                        </TabPanel>
                    </Grid>
                )}
                <Grid
                    item
                    container
                    direction="column"
                    sx={{
                        position: 'absolute',
                        bottom: '30px',
                    }}
                >
                    {renderActions?.()}
                </Grid>
            </Grid>
        </CustomFormProvider>
    );
}
