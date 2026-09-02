/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Tooltip, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { submenuFooterStyle } from './submenu-footer.style';
import { CustomMenuItem } from '../../../../components';

interface SideBarMenuItemProps {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    showLabel?: boolean;
    disabled?: boolean;
    tooltip?: string;
}

export function SideBarMenuItem({
    label,
    icon,
    onClick,
    tooltip = '',
    showLabel = true,
    disabled = false,
}: Readonly<SideBarMenuItemProps>) {
    const intl = useIntl();
    return (
        <Tooltip placement="right-start" title={tooltip && intl.formatMessage({ id: tooltip })}>
            <CustomMenuItem disabled={disabled} onClick={onClick} sx={submenuFooterStyle.subMenu}>
                {icon} {showLabel && <Typography px={1}>{intl.formatMessage({ id: label })}</Typography>}
            </CustomMenuItem>
        </Tooltip>
    );
}
