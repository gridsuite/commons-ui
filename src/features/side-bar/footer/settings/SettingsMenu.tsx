/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DisplaySettings } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { Box, Typography } from '@mui/material';
import { MinimizedSubMenuHeader } from '../common/MinimizedSubMenuHeader';
import { DarkModeToggle } from './DarkModeToggle';
import { LanguageSelection } from './LanguageSelection';
import { submenuFooterStyle } from '../common/submenu-footer.style';
import { GsLang, GsTheme } from '../../../../utils';
import { CustomNestedMenuItem } from '../../../../components';

interface SettingsMenuProps {
    isMinimized: boolean;
    currentTheme: GsTheme;
    setTheme: (newTheme: GsTheme) => void;
    selectedLanguage: GsLang;
    setSelectedLanguage: (newSelectedLanguage: GsLang) => void;
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
                sx={submenuFooterStyle.subMenuChildren}
                renderLabel={() => (
                    <Box>
                        {intl.formatMessage({ id: 'top-bar/language' })}
                        <Typography component="span" fontSize={12} sx={{ color: 'text.secondary' }}>
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
