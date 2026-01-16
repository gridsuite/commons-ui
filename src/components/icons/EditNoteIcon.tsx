/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NoteAdd, StickyNote2Outlined } from '@mui/icons-material';

type EditNoteIconProps = {
    empty?: boolean;
    hidden?: boolean;
};

export function EditNoteIcon({ empty = false, hidden = false }: Readonly<EditNoteIconProps>) {
    const size = 25;

    const sx = {
        width: size,
        height: size,
        visibility: hidden ? 'hidden' : 'visible',
    };
    return empty ? <NoteAdd sx={sx} /> : <StickyNote2Outlined sx={sx} />;
}