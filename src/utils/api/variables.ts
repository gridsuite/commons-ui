/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* The problem we have here is that some front apps don't use Vite, and sont using VITE_* vars don't work...
 * What we do here is to try to use these variables as default, while permit to devs to overwrite these constants.
 */

let restGatewayPath: string = import.meta.env.VITE_API_GATEWAY;
let wsGatewayPath: string = import.meta.env.VITE_WS_GATEWAY;

export function setGatewayRestPath(restPath: string) {
    restGatewayPath = restPath;
}

export function getGatewayRestPath() {
    return restGatewayPath;
}

export function setGatewayWsPath(wsPath: string) {
    wsGatewayPath = wsPath;
}

export function getGatewayWsPath() {
    return wsGatewayPath;
}
