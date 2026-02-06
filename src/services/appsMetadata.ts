/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { BaseVoltage, ExploreMetadata, Metadata, StudyMetadata } from '../utils';

// https://github.com/gridsuite/deployment/blob/main/docker-compose/docker-compose.base.yml
// https://github.com/gridsuite/deployment/blob/main/k8s/resources/common/config/apps-metadata.json
export type UrlString = `${string}://${string}` | `/${string}` | `./${string}`;
export type Url = UrlString | URL;

export type Env = {
    appsMetadataServerUrl?: Url;
    mapBoxToken?: string;
    confidentialityMessageKey?: string;
    // https://github.com/gridsuite/deployment/blob/main/docker-compose/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-dev/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-integ/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/local/env.json
    // [key: string]: string;
};

export async function fetchEnv(): Promise<Env> {
    return (await fetch('env.json')).json();
}

export async function fetchAppsMetadata(): Promise<Metadata[]> {
    console.info(`Fetching apps and urls...`);
    const env = await fetchEnv();
    const res = await fetch(`${env.appsMetadataServerUrl}/apps-metadata.json`);
    return res.json();
}

export function isStudyMetadata(metadata: Metadata): metadata is StudyMetadata {
    return metadata.name === 'Study';
}

export function isExploreMetadata(metadata: Metadata): metadata is ExploreMetadata {
    return metadata.name === 'Explore';
}

export async function fetchStudyMetadata(): Promise<StudyMetadata> {
    console.info(`Fetching study metadata...`);
    const studyMetadata = (await fetchAppsMetadata()).find(isStudyMetadata);
    if (!studyMetadata) {
        throw new Error('Study entry could not be found in metadata');
    } else {
        return studyMetadata; // There should be only one study metadata
    }
}

export async function fetchBaseVoltages(): Promise<BaseVoltage[]> {
    console.info(`Fetching apps' base voltages...`);
    const env = await fetchEnv();
    const res = await fetch(`${env.appsMetadataServerUrl}/apps-metadata-base-voltages.json`);
    return res.json();
}

export async function fetchFavoriteAndDefaultCountries(): Promise<{
    favoriteCountries: string[];
    defaultCountry?: string;
}> {
    const { favoriteCountries = [], defaultCountry } = await fetchStudyMetadata();
    return {
        favoriteCountries,
        defaultCountry,
    };
}
export const fetchDefaultCountry = async (): Promise<string | undefined> => {
    const studyMetadata = await fetchStudyMetadata();
    return studyMetadata.defaultCountry;
};
