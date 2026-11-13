/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AttributeModification, ModificationType } from '../../../../utils';
import { Property } from '../../common/properties';

export interface StaticVarCompensatorModificationDto {
    type: ModificationType.STATIC_VAR_COMPENSATOR_MODIFICATION;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    voltageLevelId: AttributeModification<string> | null;
    busOrBusbarSectionId: AttributeModification<string> | null;
    connectionDirection: AttributeModification<string> | null;
    connectionName: AttributeModification<string> | null;
    connectionPosition: AttributeModification<number> | null;
    terminalConnected: AttributeModification<boolean> | null;
    maxSusceptance: AttributeModification<number> | null;
    minSusceptance: AttributeModification<number> | null;
    maxQAtNominalV: AttributeModification<number> | null;
    minQAtNominalV: AttributeModification<number> | null;
    regulationMode: AttributeModification<string> | null;
    regulating: AttributeModification<boolean> | null;
    voltageSetpoint: AttributeModification<number> | null;
    reactivePowerSetpoint: AttributeModification<number> | null;
    voltageRegulationType: AttributeModification<string> | null;
    regulatingTerminalId: AttributeModification<string> | null;
    regulatingTerminalType: AttributeModification<string> | null;
    regulatingTerminalVlId: AttributeModification<string> | null;
    properties: Property[] | null;
}
