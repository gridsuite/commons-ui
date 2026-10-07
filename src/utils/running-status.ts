/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum RunningStatus {
    SUCCEED = 'SUCCEED',
    FAILED = 'FAILED',
    IDLE = 'IDLE',
    RUNNING = 'RUNNING',
}

export interface RunningStatusMessage {
    noCalculation: string;
    noLimitViolation?: string;
    running: string;
    failed: string;
    noData?: string;
    fetching?: string;
}
