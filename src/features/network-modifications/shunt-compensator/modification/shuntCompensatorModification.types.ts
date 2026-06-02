/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AttributeModification, ModificationType } from '../../../../utils';
import { Property } from '../../common';

export interface ShuntCompensatorModificationDto {
    type: ModificationType;
    uuid?: string;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    maxSusceptance: AttributeModification<number> | null;
    maxQAtNominalV: AttributeModification<number> | null;
    shuntCompensatorType: AttributeModification<string> | null;
    sectionCount: AttributeModification<number> | null;
    maximumSectionCount: AttributeModification<number> | null;
    voltageLevelId: AttributeModification<string> | null;
    busOrBusbarSectionId: AttributeModification<string> | null;
    connectionDirection: AttributeModification<string> | null;
    connectionName?: AttributeModification<string> | null;
    connectionPosition?: AttributeModification<number> | null;
    terminalConnected?: AttributeModification<boolean> | null;
    qMeasurementValue: AttributeModification<number> | null;
    qMeasurementValidity: AttributeModification<boolean> | null;
    properties: Property[] | null;
}
