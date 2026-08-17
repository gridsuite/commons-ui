/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ModificationType } from '../../../../../utils';

export type EquipmentAttributeModificationInfos = {
    type: string;
    equipmentId: string;
    equipmentAttributeName: string;
    equipmentAttributeValue: boolean;
    equipmentType: string;
};

export interface TopologyVoltageLevelModificationInfos {
    type: ModificationType;
    uuid: string | null;
    equipmentId: string;
    equipmentAttributeModificationList: EquipmentAttributeModificationInfos[];
}

export type SwitchRowForm = {
    switchId?: string;
    prevConnectionStatus?: boolean | null;
    currentConnectionStatus?: boolean | null;
    type?: string;
    isModified?: boolean;
};
