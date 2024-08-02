/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createRoot } from 'react-dom/client';

import App from './app';

// eslint-disable-next-line no-undef
const container = document.querySelector('#demo');
const root = createRoot(container);
root.render(<App />);
