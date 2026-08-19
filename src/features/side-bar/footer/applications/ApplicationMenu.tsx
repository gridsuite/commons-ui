import { Apps } from '@mui/icons-material';
import { OtherAppRedirection } from './OtherAppRedirection';
import { MinimizedSubMenuHeader } from '../common/MinimizedSubMenuHeader';
import { submenuFooterStyle } from '../common/submenu-footer-style';
import { CustomNestedMenuItem } from '../../../../components';
import { Metadata } from '../../../../utils';

export function ApplicationMenu({
    isMinimized,
    appsAndUrls,
}: Readonly<{ isMinimized: boolean; appsAndUrls: Metadata[] }>) {
    const applicationLabel = 'Mes applications';
    return (
        <CustomNestedMenuItem
            label={!isMinimized ? applicationLabel : ''}
            leftIcon={<Apps />}
            sx={submenuFooterStyle.subMenu}
        >
            {isMinimized && <MinimizedSubMenuHeader label={applicationLabel} />}

            {appsAndUrls
                ?.filter((item) => !item.hiddenInAppsMenu)
                .map((item) => (
                    <OtherAppRedirection key={item.name} app={item} />
                ))}
        </CustomNestedMenuItem>
    );
}
