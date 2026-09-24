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

export type Environment = 'DEV' | 'DCH' | 'REC' | 'PRE' | 'PRO';

export type Env = {
    appsMetadataServerUrl?: Url;
    mapBoxToken?: string;
    confidentialityMessageKey?: string;
    environment?: Environment;
    // https://github.com/gridsuite/deployment/blob/main/docker-compose/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-dev/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-integ/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/local/env.json
    // [key: string]: string;
};

// Cache fetchEnv, fetchAppsMetadata promise at module level to avoid multiple calls when mounting a composite component
// which mounts a lot of autonomous components which fetch apps metadata, e.g. expert filter
// These cached promises could be clear in authService#logout if needed. F5 will clear the cache
let envPromise: Promise<Env> | undefined;
let appsMetadataPromise: Promise<Metadata[]> | undefined;

export async function fetchEnv(): Promise<Env> {
    if (!envPromise) {
        console.info(`Fetching env.json...`);
        envPromise = fetch('env.json').then((res) => res.json());
    }
    return envPromise;
}

export async function fetchAppsMetadata(): Promise<Metadata[]> {
    if (!appsMetadataPromise) {
        console.info(`Fetching apps and urls...`);
        appsMetadataPromise = fetchEnv()
            .then((env) => fetch(`${env.appsMetadataServerUrl}/apps-metadata.json`))
            .then((res) => res.json());
    }
    return appsMetadataPromise;
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
