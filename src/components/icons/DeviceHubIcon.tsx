/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DeviceHub from '@material-symbols/svg-400/outlined/device_hub.svg?react';
import { useTheme } from '@mui/material';

interface DeviceHubProps {
    style?: React.CSSProperties;
}
export function DeviceHubIcon({ style }: DeviceHubProps) {
    const theme = useTheme();

    const defaultStyle: React.CSSProperties = {
        width: 15,
        height: 15,
        fill: theme.palette.text.primary,
    };
    return <DeviceHub style={{ ...defaultStyle, ...style }} />;
}
