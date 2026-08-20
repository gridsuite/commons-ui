import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { submenuFooterStyle } from './submenu-footer-style';
import { CustomMenuItem } from '../../../../components';

interface SidebarMenuItemProps {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    showLabel?: boolean;
    disabled?: boolean;
}

export function SidebarMenuItem({
    label,
    icon,
    onClick,
    showLabel = true,
    disabled = false,
}: Readonly<SidebarMenuItemProps>) {
    const intl = useIntl();
    return (
        <CustomMenuItem disabled={disabled} onClick={onClick} sx={submenuFooterStyle.subMenu}>
            {icon} {showLabel && <Typography px={1}>{intl.formatMessage({ id: label })}</Typography>}
        </CustomMenuItem>
    );
}
