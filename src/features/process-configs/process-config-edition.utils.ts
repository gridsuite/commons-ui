/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { PersistedProcessConfigBackend, ProcessConfigBackend } from './process-config.type';
import { ProcessType } from './common';

export interface ProcessConfigEditionDialogProps<TProcessType extends ProcessType> {
    processConfigUuid: UUID;
    processConfigName: string;
    description: string | null;
    directory: UUID;
    open: boolean;
    onClose: () => void;
    fetchProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend<TProcessType>>;
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<TProcessType>
    ) => Promise<Response>;
}
