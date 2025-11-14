/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export class CustomError extends Error {
    status: number;

    businessErrorCode?: string;

    businessErrorValues?: Record<string, unknown>;

    constructor(message: string, status: number, businessErrorCode?: string, properties?: Record<string, unknown>) {
        super(message);
        this.status = status;
        this.businessErrorCode = businessErrorCode;
        this.businessErrorValues = properties;
    }
}

export function formatMessageValues(properties: Record<string, unknown>): Record<string, string> {
    return Object.fromEntries(
        Object.entries(properties).map(([key, value]) => [
            key,
            typeof value === 'object' ? JSON.stringify(value) : String(value),
        ])
    );
}
