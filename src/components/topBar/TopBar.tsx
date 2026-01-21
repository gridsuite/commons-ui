/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { MouseEvent, PropsWithChildren, ReactNode, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    AppBar,
    Box,
    Button,
    ClickAwayListener,
    darken,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    type MenuProps,
    Paper,
    Popper,
    styled,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
    Typography,
} from '@mui/material';
import {
    Apps as AppsIcon,
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
    Badge as BadgeIcon,
    Brightness3 as Brightness3Icon,
    Computer as ComputerIcon,
    ExitToApp as ExitToAppIcon,
    HelpOutline as HelpOutlineIcon,
    ManageAccounts,
    Person as PersonIcon,
    WbSunny as WbSunnyIcon,
} from '@mui/icons-material';
import type { User } from 'oidc-client';
import { GridLogo, GridLogoProps } from './GridLogo';
import { AboutDialog, AboutDialogProps } from './AboutDialog';
import { LogoutProps } from '../authentication/Logout';
import { useStateBoolean } from '../../hooks/customStates/useStateBoolean';
import UserInformationDialog from './UserInformationDialog';
import UserSettingsDialog from './UserSettingsDialog';
import { type Metadata } from '../../utils/types/metadata';
import { DARK_THEME, type GsTheme, LIGHT_THEME, type MuiStyles } from '../../utils/styles';
import { type GsLang, LANG_ENGLISH, LANG_FRENCH, LANG_SYSTEM } from '../../utils/langs';
import { DevModeBanner } from './DevModeBanner';

const getStyles = (dense: boolean = false) => {
    return {
        toolbar: (theme) => ({
            ...(dense && {
                minHeight: `${theme.spacing(6)} !important`,
                paddingLeft: `${theme.spacing(0.875)} !important`,
                paddingRight: `${theme.spacing(0.875)} !important`,
            }),
        }),
        grow: {
            flexGrow: 1,
            display: 'flex',
            overflow: 'hidden',
        },
        menuContainer: (theme) => ({
            marginLeft: theme.spacing(dense ? 0.5 : 1),
        }),
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
        name: (theme) => ({
            backgroundColor: darken(theme.palette.background.paper, 0.1),
            paddingTop: theme.spacing(dense ? 0.625 : 1.25),
            borderRadius: '100%',
            fontWeight: '400',
            textTransform: 'uppercase',
            height: theme.spacing(dense ? 4.5 : 6),
            width: theme.spacing(dense ? 4.5 : 6),
        }),
        arrowIcon: (theme) => ({
            fontSize: theme.spacing(dense ? 4 : 5),
        }),
        userMail: {
            fontSize: '14px',
            display: 'block',
        },
        borderBottom: {
            borderBottom: '1px solid #ccc',
        },
        borderTop: {
            borderTop: '1px solid #ccc',
        },
        settingsMenu: {
            maxWidth: '385px',
            zIndex: 60,
        },
        sizeLabel: {
            fontSize: '16px',
        },
        showHideMenu: (theme) => ({
            padding: 0,
            borderRadius: '50%',
            minWidth: theme.spacing(dense ? 5 : 6.875),
            minHeight: theme.spacing(dense ? 5 : 6.875),
        }),
        toggleButtonGroup: {
            marginLeft: '15px',
            pointerEvents: 'auto',
        },
        toggleButton: {
            height: '30px',
            width: '48px',
            padding: '7px',
            textTransform: 'capitalize',
        },
        languageToggleButton: {
            height: '30px',
            width: '48px',
        },
    } as const satisfies MuiStyles;
};

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
))({
    '& .MuiMenu-paper': {
        border: '1px solid #d3d4d5',
    },
});

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: theme.palette.common.white,
        },
    },
}));

const CustomListItemIcon = styled(ListItemIcon)({
    minWidth: '30px',
    paddingRight: '15px',
    borderRadius: '25px',
});

function abbreviationFromUserName(name: string) {
    const tab = name.split(' ').map((x) => x.charAt(0));
    if (tab.length === 1) {
        return tab[0];
    }
    return tab[0] + tab[tab.length - 1];
}

export type TopBarProps = Omit<GridLogoProps, 'onClick'> &
    Omit<LogoutProps, 'disabled'> &
    Omit<AboutDialogProps, 'open' | 'onClose'> & {
        onLogoClick: GridLogoProps['onClick'];
        user?: User;
        onAboutClick?: () => void;
        logoAboutDialog?: ReactNode;
        appsAndUrls: Metadata[];
        onThemeClick?: (theme: GsTheme) => void;
        theme?: GsTheme;
        onEquipmentLabellingClick?: (toggle: boolean) => void;
        equipmentLabelling?: boolean;
        onLanguageClick: (value: GsLang) => void;
        language: GsLang;
        developerMode?: boolean;
        onDeveloperModeClick?: (value: boolean) => void;
        dense?: boolean;
    };

export function TopBar({
    appName,
    appColor,
    appLogo,
    appVersion,
    appLicense,
    logoAboutDialog,
    onLogoutClick,
    onLogoClick,
    user,
    children,
    appsAndUrls,
    onAboutClick,
    globalVersionPromise,
    additionalModulesPromise,
    onThemeClick,
    theme,
    developerMode,
    onDeveloperModeClick,
    onEquipmentLabellingClick,
    equipmentLabelling,
    onLanguageClick,
    language,
    dense = false,
}: PropsWithChildren<TopBarProps>) {
    const styles = useMemo(() => getStyles(dense), [dense]);
    const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<Element | null>(null);
    const [anchorElAppsMenu, setAnchorElAppsMenu] = useState<Element | null>(null);
    const {
        value: userInformationDialogOpen,
        setFalse: closeUserInformationDialog,
        setTrue: openUserInformationDialog,
    } = useStateBoolean(false);

    const {
        value: userSettingsDialogOpen,
        setFalse: closeUserSettingsDialog,
        setTrue: openUserSettingsDialog,
    } = useStateBoolean(false);

    const handleToggleSettingsMenu = (event: MouseEvent) => {
        setAnchorElSettingsMenu(event.currentTarget);
    };

    const handleCloseSettingsMenu = () => {
        setAnchorElSettingsMenu(null);
    };

    const handleClickAppsMenu = (event: MouseEvent) => {
        setAnchorElAppsMenu(event.currentTarget);
    };

    const handleCloseAppsMenu = () => {
        setAnchorElAppsMenu(null);
    };

    const changeTheme = (_: MouseEvent, value: GsTheme) => {
        if (onThemeClick && value !== null) {
            onThemeClick(value);
        }
    };

    const changeEquipmentLabelling = (_: MouseEvent, value: boolean) => {
        if (onEquipmentLabellingClick && value !== null) {
            onEquipmentLabellingClick(value);
        }
    };

    const changeLanguage = (_: MouseEvent, value: GsLang) => {
        if (onLanguageClick && value !== null) {
            onLanguageClick(value);
        }
    };

    const [isAboutDialogOpen, setAboutDialogOpen] = useState(false);
    const onAboutClicked = () => {
        setAnchorElSettingsMenu(null);
        if (onAboutClick) {
            onAboutClick();
        } else {
            setAboutDialogOpen(true);
        }
    };

    const isHiddenUserInformation = (): boolean => {
        if (appsAndUrls) {
            const app = appsAndUrls.find((item) => item.name === appName);
            return app?.hiddenUserInformation ?? false;
        }
        return false;
    };

    const onUserInformationDialogClicked = () => {
        setAnchorElSettingsMenu(null);
        openUserInformationDialog();
    };

    const onUserSettingsDialogClicked = () => {
        setAnchorElSettingsMenu(null);
        openUserSettingsDialog();
    };

    const logoClickable = useMemo(
        () => <GridLogo onClick={onLogoClick} appLogo={appLogo} appName={appName} appColor={appColor} dense={dense} />,
        [onLogoClick, appLogo, appName, appColor, dense]
    );

    return (
        <AppBar position="static" color="default">
            {user && developerMode && <DevModeBanner />}
            <Toolbar variant={dense ? 'dense' : 'regular'} sx={styles.toolbar}>
                {logoClickable}
                <Box sx={styles.grow}>{children}</Box>
                {user && !dense && (
                    <Box>
                        <IconButton
                            aria-label="apps"
                            aria-controls="apps-menu"
                            aria-haspopup="true"
                            onClick={handleClickAppsMenu}
                            color="inherit"
                            data-testid="AppsMenu"
                        >
                            <AppsIcon />
                        </IconButton>

                        <StyledMenu
                            id="apps-menu"
                            anchorEl={anchorElAppsMenu}
                            keepMounted
                            open={Boolean(anchorElAppsMenu)}
                            onClose={handleCloseAppsMenu}
                        >
                            {appsAndUrls
                                ?.filter((item) => !item.hiddenInAppsMenu)
                                .map((item) => (
                                    <Box
                                        component="a"
                                        key={item.name}
                                        href={item.url?.toString()}
                                        sx={styles.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <StyledMenuItem onClick={handleCloseAppsMenu}>
                                            <ListItemText>
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Grid
                                                </span>
                                                <span
                                                    style={{
                                                        color: item.appColor ?? 'grey',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {item.name}
                                                </span>
                                            </ListItemText>
                                        </StyledMenuItem>
                                    </Box>
                                ))}
                        </StyledMenu>
                    </Box>
                )}
                {user && (
                    <Box sx={styles.menuContainer}>
                        {/* Button width abbreviation and arrow icon */}
                        <Button
                            aria-controls="settings-menu"
                            aria-haspopup="true"
                            sx={styles.showHideMenu}
                            onClick={handleToggleSettingsMenu}
                            color="inherit"
                            style={anchorElSettingsMenu ? { cursor: 'initial' } : { cursor: 'pointer' }}
                            data-testid="SettingsMenu"
                        >
                            <Box component="span" sx={styles.name}>
                                {user.profile.name !== undefined ? abbreviationFromUserName(user.profile.name) : ''}
                            </Box>
                            {!dense &&
                                (anchorElSettingsMenu ? (
                                    <ArrowDropUpIcon sx={styles.arrowIcon} />
                                ) : (
                                    <ArrowDropDownIcon sx={styles.arrowIcon} />
                                ))}
                        </Button>

                        {/* Settings menu */}
                        <Popper
                            sx={styles.settingsMenu}
                            open={Boolean(anchorElSettingsMenu)}
                            anchorEl={anchorElSettingsMenu}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleCloseSettingsMenu}>
                                    <MenuList id="settings-menu">
                                        {/* user info */}
                                        <StyledMenuItem sx={styles.borderBottom} disabled style={{ opacity: '1' }}>
                                            <CustomListItemIcon>
                                                <PersonIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Box component="span" sx={styles.sizeLabel}>
                                                    {user.profile.name} <br />
                                                    <Box component="span" sx={styles.userMail}>
                                                        {user.profile.email}
                                                    </Box>
                                                </Box>
                                            </ListItemText>
                                        </StyledMenuItem>

                                        {/* User information */}
                                        {!isHiddenUserInformation() && (
                                            <StyledMenuItem
                                                style={{ opacity: '1' }}
                                                onClick={onUserInformationDialogClicked}
                                            >
                                                <CustomListItemIcon>
                                                    <BadgeIcon fontSize="small" />
                                                </CustomListItemIcon>
                                                <ListItemText>
                                                    <Typography sx={styles.sizeLabel}>
                                                        <FormattedMessage
                                                            id="top-bar/userInformation"
                                                            defaultMessage="User information"
                                                        />
                                                    </Typography>
                                                </ListItemText>
                                            </StyledMenuItem>
                                        )}

                                        {/* User settings */}
                                        <StyledMenuItem onClick={onUserSettingsDialogClicked} sx={styles.borderBottom}>
                                            <CustomListItemIcon>
                                                <ManageAccounts fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Typography sx={styles.sizeLabel}>
                                                    <FormattedMessage
                                                        id="top-bar/userSettings"
                                                        defaultMessage="Settings"
                                                    />
                                                </Typography>
                                            </ListItemText>
                                        </StyledMenuItem>

                                        {/* About */}
                                        {/* If the callback onAboutClick is undefined, we open default about dialog */}
                                        <StyledMenuItem
                                            sx={styles.borderBottom}
                                            style={{ opacity: '1' }}
                                            onClick={onAboutClicked}
                                        >
                                            <CustomListItemIcon>
                                                <HelpOutlineIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Typography sx={styles.sizeLabel}>
                                                    <FormattedMessage id="top-bar/about" defaultMessage="About" />
                                                </Typography>
                                            </ListItemText>
                                        </StyledMenuItem>

                                        {/* Display mode */}
                                        <StyledMenuItem
                                            disabled
                                            style={{
                                                opacity: '1',
                                                paddingTop: '10px',
                                                paddingBottom: '10px',
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            <ListItemText>
                                                <Typography sx={styles.sizeLabel}>
                                                    <FormattedMessage
                                                        id="top-bar/displayMode"
                                                        defaultMessage="Display mode"
                                                    />
                                                </Typography>
                                            </ListItemText>
                                            <ToggleButtonGroup
                                                exclusive
                                                value={theme}
                                                size="large"
                                                sx={styles.toggleButtonGroup}
                                                onChange={changeTheme}
                                            >
                                                <ToggleButton
                                                    value={LIGHT_THEME}
                                                    aria-label={LIGHT_THEME}
                                                    sx={styles.toggleButton}
                                                >
                                                    <WbSunnyIcon fontSize="small" />
                                                </ToggleButton>
                                                <ToggleButton
                                                    value={DARK_THEME}
                                                    aria-label={DARK_THEME}
                                                    sx={styles.toggleButton}
                                                >
                                                    <Brightness3Icon fontSize="small" />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </StyledMenuItem>

                                        {/* Equipment labeling */}
                                        {/* If the callback onEquipmentLabellingClick is undefined, equipment labeling component should not be displayed */}
                                        {onEquipmentLabellingClick && (
                                            <StyledMenuItem
                                                disabled
                                                style={{
                                                    opacity: '1',
                                                    // padding: '0',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                    backgroundColor: 'transparent',
                                                }}
                                            >
                                                <ListItemText>
                                                    <Typography sx={styles.sizeLabel}>
                                                        <FormattedMessage
                                                            id="top-bar/equipmentLabel"
                                                            defaultMessage="Equipment label"
                                                        />
                                                    </Typography>
                                                </ListItemText>
                                                <ToggleButtonGroup
                                                    exclusive
                                                    value={equipmentLabelling}
                                                    sx={styles.toggleButtonGroup}
                                                    onChange={changeEquipmentLabelling}
                                                >
                                                    <ToggleButton value={false} sx={styles.toggleButton}>
                                                        <FormattedMessage id="top-bar/id" defaultMessage="Id" />
                                                    </ToggleButton>
                                                    <ToggleButton value sx={styles.toggleButton}>
                                                        <FormattedMessage id="top-bar/name" defaultMessage="Name" />
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            </StyledMenuItem>
                                        )}
                                        {/* Languages */}
                                        <StyledMenuItem
                                            disabled
                                            sx={styles.borderBottom}
                                            style={{
                                                opacity: '1',
                                                paddingTop: '10px',
                                                paddingBottom: '10px',
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            <ListItemText>
                                                <Typography sx={styles.sizeLabel}>
                                                    <FormattedMessage id="top-bar/language" defaultMessage="Language" />
                                                </Typography>
                                            </ListItemText>
                                            <ToggleButtonGroup
                                                exclusive
                                                value={language}
                                                sx={styles.toggleButtonGroup}
                                                onChange={changeLanguage}
                                            >
                                                <ToggleButton
                                                    value={LANG_SYSTEM}
                                                    aria-label={LANG_SYSTEM}
                                                    sx={styles.languageToggleButton}
                                                    data-testid="LangSystem"
                                                >
                                                    <ComputerIcon />
                                                </ToggleButton>
                                                <ToggleButton
                                                    value={LANG_ENGLISH}
                                                    aria-label={LANG_ENGLISH}
                                                    sx={styles.languageToggleButton}
                                                    data-testid="LangEnglish"
                                                >
                                                    EN
                                                </ToggleButton>
                                                <ToggleButton
                                                    value={LANG_FRENCH}
                                                    aria-label={LANG_FRENCH}
                                                    sx={styles.toggleButton}
                                                    data-testid="LangFrench"
                                                >
                                                    FR
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </StyledMenuItem>

                                        {/* Loggout */}
                                        <StyledMenuItem onClick={onLogoutClick}>
                                            <CustomListItemIcon>
                                                <ExitToAppIcon fontSize="small" />
                                            </CustomListItemIcon>
                                            <ListItemText>
                                                <Typography sx={styles.sizeLabel}>
                                                    <FormattedMessage id="top-bar/logout" defaultMessage="Logout" />
                                                </Typography>
                                            </ListItemText>
                                        </StyledMenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Popper>
                    </Box>
                )}

                <UserInformationDialog
                    openDialog={userInformationDialogOpen && !!user}
                    user={user}
                    onClose={closeUserInformationDialog}
                />

                <UserSettingsDialog
                    openDialog={userSettingsDialogOpen && !!user}
                    onClose={closeUserSettingsDialog}
                    developerMode={developerMode}
                    onDeveloperModeClick={onDeveloperModeClick}
                />

                <AboutDialog
                    open={isAboutDialogOpen && !!user}
                    onClose={() => setAboutDialogOpen(false)}
                    appName={appName}
                    appVersion={appVersion}
                    appLicense={appLicense}
                    globalVersionPromise={globalVersionPromise}
                    additionalModulesPromise={additionalModulesPromise}
                    logo={logoAboutDialog}
                />
            </Toolbar>
        </AppBar>
    );
}
