/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ConnectablePositionFormInfos } from '../../common/connectivity/connectivity.type';
import { MeasurementInfo } from '../../common/measurements/measurement.type';

export interface ShuntCompensatorFormInfos {
    id: string;
    name: string;
    voltageLevelId: string;
    terminalConnected: boolean | null;
    busOrBusbarSectionId?: string;
    connectablePosition: ConnectablePositionFormInfos;
    q?: number;
    targetV?: number;
    targetDeadband?: number;
    sectionCount: number;
    bPerSection?: number;
    qAtNominalV?: number;
    maximumSectionCount: number;
    isLinear?: boolean;
    measurementQ: MeasurementInfo | undefined;
    properties: Record<string, string> | undefined;
}
