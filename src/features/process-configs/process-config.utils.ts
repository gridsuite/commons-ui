/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ProcessType } from './common';
import { getNamedLFProcessConfigFormData } from './loadflow';
import { getNamedSAProcessConfigFormData } from './security-analysis';
import { getNamedSCProcessConfigFormData } from './shortcircuit';

export function isProcessType(type: string): type is ProcessType {
    return Object.values(ProcessType).includes(type as ProcessType);
}

export async function getNamedProcessConfigFormData(processConfig: any, name: string, description: string | null) {
    switch (processConfig.processType) {
        case ProcessType.LOADFLOW:
            return getNamedLFProcessConfigFormData(processConfig, name, description);
        case ProcessType.SECURITY_ANALYSIS:
            return getNamedSAProcessConfigFormData(processConfig, name, description);
        case ProcessType.SHORT_CIRCUIT:
            return getNamedSCProcessConfigFormData(processConfig, name, description);
        default:
            throw new Error(`Unsupported process type: ${processConfig.processType}`);
    }
}
