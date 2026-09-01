/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { UUID } from 'node:crypto';
import { EquipmentType, ModificationType, PredefinedProperties } from '../../../utils';
import { TabularProperty } from './properties/tabularProperty.utils';

export enum TabularModificationType {
    CREATION = 'creation',
    MODIFICATION = 'modification',
}

export interface TabularModificationRow {
    [key: string]: any;
}

export interface TabularField {
    id: string;
    name?: string;
    index?: number;
    type?: string;
    options?: string[];
    required?: boolean;
    requiredIf?: { id: string };
}

export type TabularFields = Partial<Record<EquipmentType, TabularField[]>>;

export type TabularModificationDto = {
    uuid: UUID;
    type: ModificationType.TABULAR_MODIFICATION | ModificationType.TABULAR_CREATION;
    properties: TabularProperty[];
    csvFilename: string;
    modificationType: ModificationType;
    modifications: TabularModificationRow[];
};

/** Payload sent to the back-end for a tabular creation or modification. */
export type TabularFormDto = {
    type: ModificationType.TABULAR_MODIFICATION | ModificationType.TABULAR_CREATION;
    modificationType: string;
    modifications: TabularModificationRow[];
    csvFilename?: string;
    properties?: TabularProperty[];
};

export type PredefinedEquipmentProperties = {
    [p: string]: PredefinedProperties;
};
