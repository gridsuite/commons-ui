/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { backendFetchJson } from './utils';
import { VoltageInitParameters } from '../components/parameters/voltage-init/voltage-init.type';

export function getVoltageInitUrl() {
    return `${import.meta.env.VITE_API_GATEWAY}/voltage-init/v1/`;
}

export function getVoltageInitParameters(parameterUuid: UUID): Promise<VoltageInitParameters> {
    console.info('get voltage init parameters');
    const getVoltageInitParams = `${getVoltageInitUrl()}parameters/${encodeURIComponent(parameterUuid)}`;
    console.debug(getVoltageInitParams);
    return backendFetchJson(getVoltageInitParams);
}
