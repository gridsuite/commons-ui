/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const moduleTypeSort = {
    app: 1,
    server: 10,
    other: 20,
};

export type ModuleType = keyof typeof moduleTypeSort;

export type GridSuiteModule = {
    name: string;
    type: ModuleType;
    version?: string;
    gitTag?: string;
    // license?: string;
};
