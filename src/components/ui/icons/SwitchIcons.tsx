/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SvgIcon, type SvgIconProps } from '@mui/material';
import BreakerClose from '../../../images/switchIcons/breaker-close.svg?react';
import BreakerOpen from '../../../images/switchIcons/breaker-open.svg?react';
import BreakerUndetermined from '../../../images/switchIcons/breaker-undetermined.svg?react';
import DisconnectorClose from '../../../images/switchIcons/disconnector-close.svg?react';
import DisconnectorOpen from '../../../images/switchIcons/disconnector-open.svg?react';
import LoadBreakerSwitchClose from '../../../images/switchIcons/load-breaker-switch-close.svg?react';
import LoadBreakerSwitchOpen from '../../../images/switchIcons/load-breaker-switch-open.svg?react';
import LoadBreakerSwitchUndetermined from '../../../images/switchIcons/load-breaker-switch-undetermined.svg?react';

export function BreakerCloseIcon(props: SvgIconProps) {
    return <SvgIcon component={BreakerClose} inheritViewBox {...props} />;
}

export function BreakerOpenIcon(props: SvgIconProps) {
    return <SvgIcon component={BreakerOpen} inheritViewBox {...props} />;
}

export function BreakerUndeterminedIcon(props: SvgIconProps) {
    return <SvgIcon component={BreakerUndetermined} inheritViewBox {...props} />;
}

export function DisconnectorCloseIcon(props: SvgIconProps) {
    return <SvgIcon component={DisconnectorClose} inheritViewBox {...props} />;
}

export function DisconnectorOpenIcon(props: SvgIconProps) {
    return <SvgIcon component={DisconnectorOpen} inheritViewBox {...props} />;
}

export function LoadBreakerSwitchCloseIcon(props: SvgIconProps) {
    return <SvgIcon component={LoadBreakerSwitchClose} inheritViewBox {...props} />;
}

export function LoadBreakerSwitchOpenIcon(props: SvgIconProps) {
    return <SvgIcon component={LoadBreakerSwitchOpen} inheritViewBox {...props} />;
}

export function LoadBreakerSwitchUndeterminedIcon(props: SvgIconProps) {
    return <SvgIcon component={LoadBreakerSwitchUndetermined} inheritViewBox {...props} />;
}
