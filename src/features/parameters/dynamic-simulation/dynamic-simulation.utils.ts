/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TabValues } from './dynamic-simulation.type';

export const TAB_FIELDS: Record<TabValues, string[]> = Object.fromEntries(
    Object.values(TabValues).map((tab) => [tab, [tab]])
) as Record<TabValues, string[]>;
