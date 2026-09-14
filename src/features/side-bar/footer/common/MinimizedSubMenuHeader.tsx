/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListSubheader } from '@mui/material';

export function MinimizedSubMenuHeader({ label }: Readonly<{ label: string }>) {
    return (
        <ListSubheader
            sx={{
                backgroundImage: 'var(--Paper-overlay)',
                '.MuiMenuItem-root, .MuiTypography-root': {
                    px: 1.5, // customize padding for text
                },
                px: 1.5, // customize padding for the whole menu item
            }}
        >
            {label}
        </ListSubheader>
    );
}
