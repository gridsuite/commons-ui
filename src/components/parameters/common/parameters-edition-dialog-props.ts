/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { User } from 'oidc-client';
import { GsLang } from '../../../utils';
import { BUILD_STATUS } from '../../node/constant';

export interface ParametersEditionDialogProps {
    id: UUID;
    open: boolean;
    onClose: () => void;
    titleId: string;
    name: string;
    description: string | null;
    activeDirectory: UUID;
    language?: GsLang;
    user: User | null;
    globalBuildStatus: BUILD_STATUS | undefined;
    isDeveloperMode?: boolean;
}
