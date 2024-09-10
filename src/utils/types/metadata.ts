/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PredefinedProperties } from './types';

export interface Metadata {
    name: string;
    url: string;
    appColor: string;
    hiddenInAppsMenu: boolean;
    resources: unknown;
}

export interface StudyMetadata extends Metadata {
    name: 'Study';
    predefinedEquipmentProperties: {
        [networkElementType: string]: PredefinedProperties;
    };
}
