import { DisplaySettings } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { MinimizedSubMenuHeader } from '../common/MinimizedSubMenuHeader';
import { DarkModeToggle } from './DarkModeToggle';
import { LanguageSelection } from './LanguageSelection';
import { submenuFooterStyle } from '../common/submenu-footer-style';
import { GsLang, GsTheme } from '../../../../utils';
import { CustomNestedMenuItem } from '../../../../components';
import { Box, Typography } from '@mui/material';

interface SettingsMenuProps {
    isMinimized: boolean;
    currentTheme: GsTheme;
    setTheme: (newTheme: GsTheme) => Promise<void>;
    selectedLanguage: GsLang;
    setSelectedLanguage: (newSelectedLanguage: GsLang) => Promise<void>;
}

export function SettingsMenu({
    isMinimized,
    currentTheme,
    setTheme,
    selectedLanguage,
    setSelectedLanguage,
}: Readonly<SettingsMenuProps>) {
    const intl = useIntl();
    const settingsLabel = intl.formatMessage({ id: 'top-bar/settings' });
    const availableLanguages: GsLang[] = ['sys', 'fr', 'en'];

    return (
        <CustomNestedMenuItem
            label={!isMinimized ? settingsLabel : ''}
            leftIcon={<DisplaySettings />}
            sx={submenuFooterStyle.subMenu}
        >
            {isMinimized && <MinimizedSubMenuHeader label={settingsLabel} />}
            <DarkModeToggle currentTheme={currentTheme} setTheme={setTheme} />
            <CustomNestedMenuItem
                renderLabel={() => (
                    <Box sx={submenuFooterStyle.subMenu}>
                        {intl.formatMessage({ id: 'top-bar/language' })}
                        <Typography component="span" fontSize={12} sx={{ opacity: 0.7 }}>
                            {' - '}
                            {intl.formatMessage({
                                id: `top-bar/language/${selectedLanguage}`,
                            })}
                        </Typography>
                    </Box>
                )}
            >
                {availableLanguages.map((language) => (
                    <LanguageSelection
                        language={language}
                        isSelectedLanguage={selectedLanguage === language}
                        setSelectedLanguage={setSelectedLanguage}
                        key={language}
                    />
                ))}
            </CustomNestedMenuItem>
        </CustomNestedMenuItem>
    );
}
