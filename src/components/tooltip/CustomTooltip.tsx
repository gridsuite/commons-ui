/*
 * Copyright © 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Tooltip, TooltipProps } from '@mui/material';

// Wrapper around MUI Tooltip that applies the app's UX guidelines (arrow + 250ms enter delay) by default.
export function CustomTooltip(props: TooltipProps) {
    const { children, ...tooltipProps } = props;
    return (
        <Tooltip arrow enterDelay={250} {...tooltipProps}>
            <span>{children}</span>
        </Tooltip>
    );
}
