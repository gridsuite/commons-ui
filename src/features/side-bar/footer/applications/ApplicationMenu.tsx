import { Apps } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { OtherAppRedirection } from './OtherAppRedirection';
import { MinimizedSubMenuHeader } from '../common/MinimizedSubMenuHeader';
import { submenuFooterStyle } from '../common/submenu-footer-style';
import { CustomNestedMenuItem } from '../../../../components';
import { Metadata } from '../../../../utils';

export function ApplicationMenu({
    isMinimized,
    appsAndUrls,
}: Readonly<{ isMinimized: boolean; appsAndUrls: Metadata[] }>) {
    const intl = useIntl();
    const applicationLabel = intl.formatMessage({ id: 'top-bar/myApps' });
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
