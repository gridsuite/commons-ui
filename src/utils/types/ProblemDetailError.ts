/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CustomError } from './CustomError';

export class ProblemDetailError extends CustomError {
    serverName: string;

    timestamp: Date;

    traceId: string;

    businessErrorCode?: string;

    businessErrorValues?: Record<string, unknown>;

    constructor(
        status: number,
        message: string,
        serverName: string,
        timestamp: Date,
        traceId: string,
        businessErrorCode?: string,
        businessErrorValues?: Record<string, unknown>
    ) {
        super(status, message);
        this.serverName = serverName;
        this.timestamp = timestamp;
        this.traceId = traceId;
        this.businessErrorCode = businessErrorCode;
        this.businessErrorValues = businessErrorValues;
    }
}

export function formatMessageValues(properties: Record<string, unknown>): Record<string, string> {
    return Object.fromEntries(
        Object.entries(properties).map(([key, value]) => [
            key,
            typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value),
        ])
    );
}
