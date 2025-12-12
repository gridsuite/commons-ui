/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import AddNote from '@material-symbols/svg-400/outlined/add_notes.svg?react';
import { useTheme } from '@mui/material';
import { StickyNote2Outlined } from '@mui/icons-material';
import { CSSProperties } from 'react';

type EditNoteIconProps = {
    empty?: boolean;
    hidden?: boolean;
};

export function EditNoteIcon({ empty = false, hidden = false }: Readonly<EditNoteIconProps>) {
    const theme = useTheme();
    const size = 25;

    const style: CSSProperties = {
        width: size,
        height: size,
        fill: theme.palette.text.primary,
        visibility: hidden ? 'hidden' : 'visible',
    };
    return empty ? <AddNote style={style} /> : <StickyNote2Outlined sx={style} />;
}
