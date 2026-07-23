/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldConstants, ModificationType } from '../../../../utils';

export interface CreateVoltageLevelTopologyInfos {
    type: ModificationType;
    uuid?: string;
    voltageLevelId: string;
    sectionCount?: number | null;
    switchKinds?: string[] | null;
}

export type CreateVoltageLevelTopologyDialogSchemaForm = {
    [FieldConstants.SECTION_COUNT]?: number | null;
    [FieldConstants.SWITCH_KINDS]?: { [FieldConstants.SWITCH_KIND]: string }[] | null;
    [FieldConstants.SWITCHES_BETWEEN_SECTIONS]?: string | null;
};
