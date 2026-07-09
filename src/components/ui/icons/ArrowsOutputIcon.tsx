/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SvgIcon, type SvgIconProps } from '@mui/material';
import ArrowsOutput from '@material-symbols/svg-400/outlined/arrows_output.svg?react';

export function ArrowsOutputIcon(props: SvgIconProps) {
    return <SvgIcon component={ArrowsOutput} inheritViewBox {...props} />;
}
