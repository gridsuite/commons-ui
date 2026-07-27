/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ProcessType } from './common';
import { NamedProcessConfigFormData, ProcessConfigFormData } from './process-config.type';

export function getNamedProcessConfigFormData<TProcessType extends ProcessType>(
    processConfig: ProcessConfigFormData<TProcessType>,
    name: string,
    description: string | null
): NamedProcessConfigFormData<TProcessType> {
    return {
        name,
        description: description ?? undefined,
        ...processConfig,
    } as NamedProcessConfigFormData<TProcessType>;
}

// function get modifications ?
