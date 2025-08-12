/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import PhotoLibrary from '@material-symbols/svg-400/outlined/photo_library-fill.svg?react';
import { useTheme } from '@mui/material';

export function PhotoLibraryIcon() {
    const theme = useTheme();

    return (
        <PhotoLibrary
            style={{
                width: 14.4,
                height: 14.4,
                fill: theme.palette.text.primary,
            }}
        />
    );
}
