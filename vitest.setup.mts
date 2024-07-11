/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});
