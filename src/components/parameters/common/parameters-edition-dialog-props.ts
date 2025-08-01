/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { User } from 'oidc-client';

export interface ParametersEditionDialogProps {
    id: UUID;
    open: boolean;
    onClose: () => void;
    titleId: string;
    name: string;
    description: string | null;
    activeDirectory: UUID;
    language?: string;
    user: User | null;
    enableDeveloperMode?: boolean;
}
