/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DatasetLinked from '@material-symbols/svg-400/outlined/dataset_linked.svg?react';
import { SvgIcon, type SvgIconProps } from '@mui/material';

export function DatasetLinkedIcon(props: SvgIconProps) {
    return <SvgIcon component={DatasetLinked} inheritViewBox {...props} />;
}
