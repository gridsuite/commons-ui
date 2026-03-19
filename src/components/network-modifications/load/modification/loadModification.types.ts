/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Property } from '../../common';
import { AttributeModification, ModificationType } from '../../../../utils';

export interface LoadModificationDto {
    type: ModificationType;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    loadType: AttributeModification<string> | null;
    p0: AttributeModification<number> | null;
    q0: AttributeModification<number> | null;
    voltageLevelId: AttributeModification<string> | null;
    busOrBusbarSectionId: AttributeModification<string> | null;
    connectionDirection: AttributeModification<string> | null;
    connectionName: AttributeModification<string> | null;
    connectionPosition: AttributeModification<number> | null;
    terminalConnected: AttributeModification<boolean> | null;
    pMeasurementValue: AttributeModification<number> | null;
    pMeasurementValidity: AttributeModification<boolean> | null;
    qMeasurementValue: AttributeModification<number> | null;
    qMeasurementValidity: AttributeModification<boolean> | null;
    properties: Property[] | null;
}
