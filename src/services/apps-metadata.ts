/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PredefinedProperties } from '../utils/types';
import { Url } from '../utils/api';
import { fetchEnv } from './app-local';

// https://github.com/gridsuite/deployment/blob/main/docker-compose/version.json
// https://github.com/gridsuite/deployment/blob/main/k8s/resources/common/config/version.json
export type VersionJson = {
    deployVersion?: string;
};

// https://github.com/gridsuite/deployment/blob/main/docker-compose/apps-metadata.json
// https://github.com/gridsuite/deployment/blob/main/k8s/resources/common/config/apps-metadata.json
export type AppMetadata = AppMetadataCommon | AppMetadataStudy;

export type AppMetadataCommon = {
    name: string;
    url: Url;
    appColor: string;
    hiddenInAppsMenu: boolean;
};

export type AppMetadataStudy = AppMetadataCommon & {
    readonly name: 'Study';
    resources?: {
        types: string[];
        path: string;
    }[];
    predefinedEquipmentProperties?: {
        [networkElementType: string]: PredefinedProperties | null | undefined;
        /* substation?: {
            region?: string[];
            tso?: string[];
            totallyFree?: unknown[];
            Demo?: string[];
        };
        load?: {
            codeOI?: string[];
        }; */
    };
    defaultParametersValues?: {
        fluxConvention?: string;
        enableDeveloperMode?: string; // maybe 'true'|'false' type?
        mapManualRefresh?: string; // maybe 'true'|'false' type?
    };
    defaultCountry?: string;
};

export async function fetchAppsMetadata(): Promise<AppMetadataCommon[]> {
    console.info(`Fetching apps and urls...`);
    const env = await fetchEnv();
    const res = await fetch(`${env.appsMetadataServerUrl}/apps-metadata.json`);
    return res.json();
}

const isStudyMetadata = (
    metadata: AppMetadataCommon
): metadata is AppMetadataStudy => {
    return metadata.name === 'Study';
};

export async function fetchStudyMetadata(): Promise<AppMetadataStudy> {
    console.info(`Fetching study metadata...`);
    const studyMetadata = (await fetchAppsMetadata()).filter(isStudyMetadata);
    if (!studyMetadata) {
        throw new Error('Study entry could not be found in metadata');
    } else {
        return studyMetadata[0]; // There should be only one study metadata
    }
}

export async function fetchDefaultParametersValues(): Promise<
    AppMetadataStudy['defaultParametersValues']
> {
    console.debug('fetching default parameters values from apps-metadata file');
    return (await fetchStudyMetadata()).defaultParametersValues;
}

export async function fetchVersion(): Promise<VersionJson> {
    console.debug('Fetching global version...');
    const envData = await fetchEnv();
    return (
        await fetch(`${envData.appsMetadataServerUrl}/version.json`)
    ).json();
}

export async function fetchDeployedVersion() {
    return (await fetchVersion())?.deployVersion;
}
