/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { GridSuiteModule } from '../components/TopBar/modules';
import { ApiService, UserGetter } from './base-service';
import { UrlString } from '../utils/api';

// https://github.com/powsybl/powsybl-core/blob/main/iidm/iidm-api/src/main/java/com/powsybl/iidm/network/IdentifiableType.java#L14
export enum IdentifiableType {
    NETWORK = 'NETWORK',
    SUBSTATION = 'SUBSTATION',
    VOLTAGE_LEVEL = 'VOLTAGE_LEVEL',
    AREA = 'AREA',
    HVDC_LINE = 'HVDC_LINE',
    BUS = 'BUS',
    SWITCH = 'SWITCH',
    BUSBAR_SECTION = 'BUSBAR_SECTION',
    LINE = 'LINE',
    TIE_LINE = 'TIE_LINE',
    TWO_WINDINGS_TRANSFORMER = 'TWO_WINDINGS_TRANSFORMER',
    THREE_WINDINGS_TRANSFORMER = 'THREE_WINDINGS_TRANSFORMER',
    GENERATOR = 'GENERATOR',
    BATTERY = 'BATTERY',
    LOAD = 'LOAD',
    SHUNT_COMPENSATOR = 'SHUNT_COMPENSATOR',
    DANGLING_LINE = 'DANGLING_LINE',
    STATIC_VAR_COMPENSATOR = 'STATIC_VAR_COMPENSATOR',
    HVDC_CONVERTER_STATION = 'HVDC_CONVERTER_STATION',
    OVERLOAD_MANAGEMENT_SYSTEM = 'OVERLOAD_MANAGEMENT_SYSTEM',
    GROUND = 'GROUND',
}

// https://github.com/gridsuite/filter/blob/main/src/main/java/org/gridsuite/filter/identifierlistfilter/IdentifiableAttributes.java#L20
export type IdentifiableAttributes = {
    id: string;
    type: IdentifiableType;
    distributionKey: number; // double
};

export default class StudyComSvc extends ApiService {
    public constructor(userGetter: UserGetter, restGatewayPath?: UrlString) {
        super(userGetter, 'explore', restGatewayPath);
    }

    public async exportFilter(studyUuid: UUID, filterUuid?: UUID) {
        console.debug('get filter export on study root node');
        return this.backendFetchJson<IdentifiableAttributes[]>(
            `${this.getPrefix(1)}/studies/${studyUuid}/filters/${filterUuid}/elements`,
            'GET'
        );
    }

    public async getServersInfos(viewName: string) {
        console.debug('get backend servers informations');
        return this.backendFetchJson<GridSuiteModule[]>(`${this.getPrefix(1)}/servers/about?view=${viewName}`);
    }
}
