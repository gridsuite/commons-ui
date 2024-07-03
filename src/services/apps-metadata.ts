/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PredefinedProperties } from '../utils/types';

// https://github.com/gridsuite/deployment/blob/main/docker-compose/docker-compose.base.yml
// https://github.com/gridsuite/deployment/blob/main/k8s/resources/common/config/apps-metadata.json
export type Url = string | URL;

export type Env = {
    appsMetadataServerUrl?: Url;
    mapBoxToken?: string;
    // https://github.com/gridsuite/deployment/blob/main/docker-compose/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-dev/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-integ/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/local/env.json
    //[key: string]: string;
};

export async function fetchEnv(): Promise<Env> {
    return (await fetch('env.json')).json();
}

export type CommonMetadata = {
    name: string;
    url: Url;
    appColor: string;
    hiddenInAppsMenu: boolean;
};

export type StudyMetadata = CommonMetadata & {
    readonly name: 'Study';
    resources?: {
        types: string[];
        path: string;
    }[];
    predefinedEquipmentProperties?: {
        [networkElementType: string]: PredefinedProperties;
    };
    defaultParametersValues?: {
        fluxConvention?: string;
        enableDeveloperMode?: string; //maybe 'true'|'false' type?
        mapManualRefresh?: string; //maybe 'true'|'false' type?
    };
    defaultCountry?: string;
};

export async function fetchAppsMetadata(): Promise<CommonMetadata[]> {
    console.info(`Fetching apps and urls...`);
    const env = await fetchEnv();
    const res = await fetch(env.appsMetadataServerUrl + '/apps-metadata.json');
    return res.json();
}

const isStudyMetadata = (
    metadata: CommonMetadata
): metadata is StudyMetadata => {
    return metadata.name === 'Study';
};

export async function fetchStudyMetadata(): Promise<StudyMetadata> {
    console.info(`Fetching study metadata...`);
    const studyMetadata = (await fetchAppsMetadata()).filter(isStudyMetadata);
    if (!studyMetadata) {
        throw new Error('Study entry could not be found in metadata');
    } else {
        return studyMetadata[0]; // There should be only one study metadata
    }
}
