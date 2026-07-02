/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { LinearProgress, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import type { UserProfile } from 'oidc-client-ts';
import { UseNetworkVisualizationParametersFormReturn } from './use-network-visualizations-parameters-form';
import { NetworkVisualizationTabValues as TabValues } from './constants';
import { MapParameters } from './map-parameters';
import { SingleLineDiagramParameters } from './single-line-diagram-parameters';
import { NetworkAreaDiagramParameters } from './network-area-diagram-parameters';
import { TabPanel } from '../common';
import { getAvailableComponentLibraries } from '../../../services';

const useGetAvailableComponentLibraries = (userProfile: UserProfile | null) => {
    const [componentLibraries, setComponentLibraries] = useState<string[]>([]);

    useEffect(() => {
        if (userProfile !== null) {
            getAvailableComponentLibraries().then((libraries) => {
                if (libraries != null) {
                    setComponentLibraries(libraries);
                }
            });
        }
    }, [userProfile]);

    return componentLibraries;
};

interface NetworkVisualizationParametersFormProps {
    networkVisuMethods: UseNetworkVisualizationParametersFormReturn;
    userProfile: UserProfile | null;
}

export function NetworkVisualizationParametersForm({
    networkVisuMethods,
    userProfile,
}: Readonly<NetworkVisualizationParametersFormProps>) {
    const componentLibraries = useGetAvailableComponentLibraries(userProfile);
    const { selectedTab, handleTabChange, paramsLoading } = networkVisuMethods;

    if (paramsLoading) {
        return <LinearProgress />;
    }

    return (
        <>
            <Tabs value={selectedTab} variant="scrollable" onChange={handleTabChange}>
                <Tab label={<FormattedMessage id="Map" />} value={TabValues.MAP} />
                <Tab label={<FormattedMessage id="SingleLineDiagram" />} value={TabValues.SINGLE_LINE_DIAGRAM} />
                <Tab label={<FormattedMessage id="NetworkAreaDiagram" />} value={TabValues.NETWORK_AREA_DIAGRAM} />
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
        </>
    );
}
