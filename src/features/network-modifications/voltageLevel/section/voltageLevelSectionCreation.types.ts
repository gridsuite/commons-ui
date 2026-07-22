/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ModificationType } from '../../../../utils';

export interface CreateVoltageLevelSectionInfos {
    type: ModificationType;
    uuid?: string;
    voltageLevelId: string;
    busbarIndex: string | null;
    busbarSectionId: string | null;
    allBusbars: boolean;
    afterBusbarSectionId: boolean;
    leftSwitchKind: string | null;
    rightSwitchKind: string | null;
    switchOpen: boolean;
}

export type CreateVoltageLevelSectionDialogSchemaForm = {
    busbarIndex: { id: string };
    busbarSectionId: { id: string };
    isAfterBusBarSectionId: string | null;
    switchesBeforeSections?: string | null;
    switchesAfterSections?: string | null;
    allBusbarSections?: boolean;
    newSwitchStates?: boolean;
    switchBeforeNotRequired?: boolean;
    switchAfterNotRequired?: boolean;
};

export type BusBarSections = Record<string, string[]>;

export const POSITION_NEW_SECTION_SIDE = {
    BEFORE: { id: 'BEFORE', label: 'Before' },
    AFTER: { id: 'AFTER', label: 'After' },
} as const;
