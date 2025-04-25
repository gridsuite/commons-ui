/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import LeftPanelClose from '@material-symbols/svg-400/outlined/left_panel_close.svg?react';
import { useTheme } from '@mui/material';

export function LeftPanelCloseIcon() {
    const theme = useTheme();

    return (
        <LeftPanelClose
            style={{
                width: 24,
                height: 24,
                fill: theme.palette.text.primary,
            }}
        />
    );
}
