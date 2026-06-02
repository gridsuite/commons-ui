/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AttributeModification, ModificationType } from '../../../../utils';
import { ReactiveCapabilityCurvePoints } from '../../common/reactiveLimits';
import { Property } from '../../common/properties';

export interface BatteryModificationDto {
    type: ModificationType;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    maxP: AttributeModification<number> | null;
    minP: AttributeModification<number> | null;
    targetP: AttributeModification<number> | null;
    targetQ: AttributeModification<number> | null;
    participate: AttributeModification<boolean> | null;
    droop: AttributeModification<number> | null;
    reactiveCapabilityCurve: AttributeModification<boolean> | null;
    minQ: AttributeModification<number> | null;
    maxQ: AttributeModification<number> | null;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[] | null;
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
    directTransX: AttributeModification<number> | null;
    stepUpTransformerX: AttributeModification<number> | null;
}
