/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { CustomError } from './CustomError';

function formatMessageValues(properties: Record<string, unknown> | undefined): Record<string, string> | undefined {
    if (properties === undefined) {
        return undefined;
    }
    return Object.fromEntries(
        Object.entries(properties).map(([key, value]) => [
            key,
            typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value),
        ])
    );
}

export class ProblemDetailError extends CustomError {
    serverName: string;

    timestamp: string;

    traceId: string;

    businessErrorCode?: string;

    businessErrorValues?: Record<string, string>;

    constructor(
        status: number,
        message: string,
        serverName: string,
        timestamp: string,
        traceId: string,
        businessErrorCode?: string,
        businessErrorValues?: Record<string, unknown>
    ) {
        super(status, message);
        this.serverName = serverName;
        this.timestamp = timestamp;
        this.traceId = traceId;
        this.businessErrorCode = businessErrorCode;
        this.businessErrorValues = formatMessageValues(businessErrorValues);
    }
}
