/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import AddNote from '@material-symbols/svg-400/outlined/add_notes.svg?react';
import { useTheme } from '@mui/material';
import { StickyNote2 } from '@mui/icons-material';

type EditNoteIconProps = {
    empty?: boolean;
};

export function EditNoteIcon({ empty }: Readonly<EditNoteIconProps>) {
    const theme = useTheme();

    return empty ? (
        <AddNote
            style={{
                width: 20,
                height: 20,
                fill: theme.palette.text.primary,
            }}
        />
    ) : (
        <StickyNote2 />
    );
}
