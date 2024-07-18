/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Url } from '../utils/api';
import { IdpSettings } from '../utils/AuthService';

export type Env = {
    appsMetadataServerUrl?: Url;
    mapBoxToken?: string;
    // https://github.com/gridsuite/deployment/blob/main/docker-compose/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-dev/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-integ/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/local/env.json
    // [key: string]: string;
};

export async function fetchEnv(): Promise<Env> {
    return (await fetch('env.json')).json();
}

export async function fetchIdpSettings() {
    // TODO get app base path, can cause problems if router use
    return (await (await fetch('idpSettings.json')).json()) as IdpSettings;
}
