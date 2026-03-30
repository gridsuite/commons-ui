/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { VoltageLevelDto } from '../modification';
import { VoltageLevelTab } from './voltageLevel.constants';
import { PropertiesForm } from '../../common';
import { StructureTab, CharacteristicsTab, SubstationTab, type SubstationTabContentProps } from './tabs';

interface VoltageLevelTabsContentProps extends SubstationTabContentProps {
    voltageLevelToModify?: VoltageLevelDto | null;
    tabIndex: number;
}

export function VoltageLevelCreationTabsContent({
    tabIndex,
    substationOptions,
    showDeleteButton,
}: Readonly<VoltageLevelTabsContentProps>) {
    switch (tabIndex) {
        case VoltageLevelTab.SUBSTATION_TAB:
            return <SubstationTab substationOptions={substationOptions} showDeleteButton={showDeleteButton} />;
        case VoltageLevelTab.CHARACTERISTICS_TAB:
            return <CharacteristicsTab />;
        case VoltageLevelTab.STRUCTURE_TAB:
            return <StructureTab />;
        case VoltageLevelTab.ADDITIONAL_INFORMATION_TAB:
            return <PropertiesForm networkElementType="voltageLevel" />;
        default:
            return null;
    }
}
