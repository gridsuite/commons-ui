/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type LogSeverity = {
    name: 'UNKNOWN' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
    level: number;
    colorName: string;
    colorHexCode: string;
};

export const LogSeverities: Record<string, LogSeverity> = {
    UNKNOWN: {
        name: 'UNKNOWN',
        level: 0,
        colorName: 'cornflowerblue',
        colorHexCode: '#6495ED',
    },
    INFO: {
        name: 'INFO',
        level: 1,
        colorName: 'mediumseagreen',
        colorHexCode: '#3CB371',
    },
    WARN: {
        name: 'WARN',
        level: 2,
        colorName: 'orange',
        colorHexCode: '#FFA500',
    },
    ERROR: {
        name: 'ERROR',
        level: 3,
        colorName: 'crimson',
        colorHexCode: '#DC143C',
    },
    FATAL: {
        name: 'FATAL',
        level: 4,
        colorName: 'mediumorchid',
        colorHexCode: '#BA55D3',
    },
};
