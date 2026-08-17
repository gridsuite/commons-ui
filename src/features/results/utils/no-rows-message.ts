/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { RunningStatus, RunningStatusMessage } from '../../../utils/running-status';

export function getNoRowsMessage(
    messages: RunningStatusMessage,
    rows: any[] | undefined,
    status: string,
    isDataReady?: boolean
): string | undefined {
    switch (status) {
        case RunningStatus.IDLE:
            return messages.noCalculation;
        case RunningStatus.RUNNING:
            return messages.running;
        case RunningStatus.FAILED:
            return messages.failed;
        case RunningStatus.SUCCEED:
            if (!isDataReady || !rows) {
                return messages.fetching;
            }
            if (rows?.length === 0) {
                return messages.noData ? messages.noData : messages.noLimitViolation;
            }
            return undefined;
        default:
            return messages.noCalculation;
    }
}
