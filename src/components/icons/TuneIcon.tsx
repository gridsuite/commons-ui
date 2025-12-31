/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Tune } from '@mui/icons-material';
import { useTheme } from '@mui/material';

type TuneIconProps = {
    disabled?: boolean;
    size?: number;
    color?: string;
};

export function TuneIcon({ disabled = false, size = 14.4, color }: TuneIconProps) {
    const theme = useTheme();

    const fillColor = color ?? (disabled ? theme.palette.action.disabled : theme.palette.text.primary);

    return <Tune sx={{ width: size, height: size, color: fillColor }} />;
}
