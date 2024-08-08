/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PredefinedProperties } from '../utils/types';
import { Url } from '../utils/api';
import AppLocalComSvc from './app-local';

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

function isStudyMetadata(metadata: AppMetadataCommon): metadata is AppMetadataStudy {
    return metadata.name === 'Study';
}

export default class AppsMetadataComSvc {
    private readonly appLocalSvc: AppLocalComSvc;

    public constructor(appLocalSvc?: AppLocalComSvc) {
        this.appLocalSvc = appLocalSvc ?? new AppLocalComSvc();
    }

    public async fetchAppsMetadata(): Promise<AppMetadata[]> {
        console.info(`Fetching apps and urls...`);
        const env = await this.appLocalSvc.fetchEnv();
        const res = await fetch(`${env.appsMetadataServerUrl}/apps-metadata.json`);
        return res.json();
    }

    public async fetchStudyMetadata(): Promise<AppMetadataStudy> {
        console.info(`Fetching study metadata...`);
        const studyMetadata = (await this.fetchAppsMetadata()).filter(isStudyMetadata);
        if (!studyMetadata) {
            throw new Error('Study entry could not be found in metadata');
        } else {
            return studyMetadata[0]; // There should be only one study metadata
        }
    }

    public async fetchDefaultParametersValues(): Promise<AppMetadataStudy['defaultParametersValues']> {
        console.debug('fetching default parameters values from apps-metadata file');
        return (await this.fetchStudyMetadata()).defaultParametersValues;
    }

    public async fetchVersion(): Promise<VersionJson> {
        console.debug('Fetching global version...');
        const envData = await this.appLocalSvc.fetchEnv();
        return (await fetch(`${envData.appsMetadataServerUrl}/version.json`)).json();
    }

    public async fetchDeployedVersion() {
        return (await this.fetchVersion())?.deployVersion;
    }
}
