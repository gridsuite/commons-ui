/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v.2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    Grid,
    Stack,
    Tooltip,
    tooltipClasses,
    Typography,
    useMediaQuery,
    useTheme,
    Zoom,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Apps, DnsOutlined, ExpandMore, Gavel, QuestionMark, Refresh, WidgetsOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { LogoText } from './GridLogo';
import type { MuiStyles } from '../../utils/styles';

const styles = {
    general: {
        '.MuiAccordion-root': {
            // dunno why the theme has the background as black in dark mode
            bgcolor: 'unset',
        },
    },
    mainSection: { height: '5em' },
    logoSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainInfos: {
        textAlign: 'center',
        marginTop: 0,
    },
    versionField: { fontStyle: 'italic' },
    versionFieldUnknown: { fontSize: '1.5em', fontWeight: 'bold' },
    detailsSection: {
        '.MuiAccordionSummary-content > .MuiSvgIcon-root': {
            marginRight: '0.5rem',
        },
    },
} as const satisfies MuiStyles;

function getGlobalVersion(
    fnPromise: (() => Promise<string>) | undefined,
    type: string,
    setData: (data: string | null) => void,
    setLoader?: (loader: boolean) => void
) {
    if (fnPromise) {
        console.debug('Getting', type, 'global version...');
        return new Promise((resolve) => {
            if (setLoader) {
                setLoader(true);
            }
            resolve(null);
        })
            .then(() => fnPromise())
            .then(
                (value) => {
                    console.debug(type, 'global version is', value);
                    setData(value ?? null);
                },
                (reason) => {
                    console.debug(type, "global version isn't available", reason);
                    setData(null);
                }
            )
            .finally(() => {
                if (setLoader) {
                    setLoader(false);
                }
            });
    }
    console.debug('No getter for global version');
    setData(null);
    return Promise.resolve(null);
}

const moduleTypeSort = {
    app: 1,
    server: 10,
    other: 20,
};

type ModuleType = keyof typeof moduleTypeSort;

type ModuleDefinition = { name: string; type: ModuleType };

function compareModules(c1: ModuleDefinition, c2: ModuleDefinition) {
    // sort by type then by name
    return (
        (moduleTypeSort[c1.type] || 100) - (moduleTypeSort[c2.type] || 100) ||
        (c1.name || '').localeCompare(c2.name || '')
    );
}

export type GridSuiteModule = {
    name: string;
    type: ModuleType;
    version?: string;
    gitTag?: string;
};

export interface AboutDialogProps {
    open: boolean;
    onClose: () => void;
    globalVersionPromise?: () => Promise<string>;
    appName: string;
    appVersion?: string;
    appGitTag?: string;
    appLicense?: string;
    additionalModulesPromise?: () => Promise<GridSuiteModule[]>;
    logo?: ReactNode;
}

const moduleStyles = {
    icons: {
        flexGrow: 0,
        position: 'relative',
        top: '4px',
        flexShrink: 0,
    },
    version: {
        flexGrow: 0,
        alignSelf: 'flex-end',
        flexShrink: 0,
    },
    tooltip: (theme) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            border: '1px solid #dadde9',
            boxShadow: theme.shadows[1],
        },
    }),
    tooltipDetails: {
        display: 'grid',
        gridTemplateColumns: 'max-content auto',
        margin: 0,
        dt: {
            gridColumnStart: 1,
            '&:after': {
                content: '" :"',
            },
        },
        dd: {
            gridColumnStart: 2,
            paddingLeft: '0.5em',
        },
    },
} as const satisfies MuiStyles;

const ModuleTypesIcons = {
    app: <WidgetsOutlined sx={moduleStyles.icons} fontSize="small" color="primary" />,
    server: <DnsOutlined sx={moduleStyles.icons} fontSize="small" color="secondary" />,
    other: <QuestionMark sx={moduleStyles.icons} fontSize="small" />,
};

function insensitiveCaseCompare(str: string, obj: string) {
    return str.localeCompare(obj, undefined, {
        sensitivity: 'base',
    });
}
function tooltipTypeLabel(type: string) {
    if (insensitiveCaseCompare('app', type) === 0) {
        return 'about-dialog/module-tooltip-app';
    }
    if (insensitiveCaseCompare('server', type) === 0) {
        return 'about-dialog/module-tooltip-server';
    }
    return 'about-dialog/module-tooltip-other';
}

function Module({ type, name, version, gitTag }: GridSuiteModule) {
    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
                '.MuiTypography-root': {
                    minWidth: '3em',
                },
            }}
        >
            <Tooltip
                TransitionComponent={Zoom}
                enterDelay={2500}
                enterNextDelay={350}
                leaveDelay={200}
                placement="bottom-start"
                arrow
                sx={moduleStyles.tooltip}
                title={
                    <>
                        <Typography variant="body1">{name || '<?>'}</Typography>
                        <Box component="dl" sx={moduleStyles.tooltipDetails}>
                            <Typography variant="body2" component="dt">
                                <FormattedMessage id="about-dialog/label-type" />
                            </Typography>
                            <Typography variant="body2" component="dd">
                                <FormattedMessage id={tooltipTypeLabel(type)} />
                            </Typography>
                            {version && (
                                <>
                                    <Typography variant="body2" component="dt">
                                        <FormattedMessage id="about-dialog/label-version" />
                                    </Typography>
                                    <Typography variant="body2" component="dd">
                                        {version}
                                    </Typography>
                                </>
                            )}
                            {gitTag && (
                                <>
                                    <Typography variant="body2" component="dt">
                                        <FormattedMessage id="about-dialog/label-git-version" />
                                    </Typography>
                                    <Typography variant="body2" component="dd">
                                        {gitTag}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </>
                }
            >
                <Stack direction="row" justifyContent="flex-start" alignItems="baseline" spacing={1}>
                    {ModuleTypesIcons[type] || ModuleTypesIcons.other}
                    <Typography display="inline" noWrap>
                        {name || '<?>'}
                    </Typography>
                    <Typography
                        variant="caption"
                        color={(theme) => theme.palette.text.secondary}
                        display="inline"
                        noWrap
                        sx={moduleStyles.version}
                    >
                        {gitTag || version || null}
                    </Typography>
                </Stack>
            </Tooltip>
        </Grid>
    );
}

export function AboutDialog({
    open,
    onClose,
    globalVersionPromise,
    appName,
    appVersion,
    appGitTag,
    appLicense,
    additionalModulesPromise,
    logo,
}: AboutDialogProps) {
    const theme = useTheme();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loadingGlobalVersion, setLoadingGlobalVersion] = useState(false);
    const [showGlobalVersion, setShowGlobalVersion] = useState(false);

    /* We want to get the initial version once at first render to detect later a new deploy */
    const [initialGlobalVersion, setInitialGlobalVersion] = useState<unknown>(undefined);
    useEffect(() => {
        if (initialGlobalVersion === undefined) {
            getGlobalVersion(globalVersionPromise, 'Initial', setInitialGlobalVersion);
        }
    }, [globalVersionPromise, initialGlobalVersion]);

    const [actualGlobalVersion, setActualGlobalVersion] = useState<string | null>(null);
    useEffect(() => {
        if (open) {
            getGlobalVersion(globalVersionPromise, 'Actual', setActualGlobalVersion, (loading) => {
                setLoadingGlobalVersion(loading);
                setShowGlobalVersion(false);
            });
        }
    }, [open, globalVersionPromise]);

    const [loadingAdditionalModules, setLoadingAdditionalModules] = useState(false);
    const [modules, setModules] = useState<GridSuiteModule[] | null>(null);
    useEffect(() => {
        if (open) {
            const currentApp: GridSuiteModule = {
                name: `Grid${appName}`,
                type: 'app',
                version: appVersion,
                gitTag: appGitTag,
                // license: appLicense,
            };
            (additionalModulesPromise
                ? Promise.resolve(setLoadingAdditionalModules(true)).then(() => additionalModulesPromise())
                : Promise.reject(new Error('no getter'))
            )
                .then(
                    (values) => (Array.isArray(values) ? values : []),
                    () => []
                )
                .then((values) => {
                    setModules([currentApp, ...values]);
                })
                .finally(() => setLoadingAdditionalModules(false));
        }
    }, [open, additionalModulesPromise, appName, appVersion, appGitTag, appLicense]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            fullWidth
            maxWidth="md"
            fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
            sx={styles.general}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            TransitionProps={{
                onExited: () => {
                    setModules(null);
                    setActualGlobalVersion(null);
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">
                <FormattedMessage id="about-dialog/title" />

                {/* we insert content in the title as a trick to have the main content not in the dialog's scrollable section */}
                {initialGlobalVersion !== undefined &&
                    initialGlobalVersion !== null &&
                    actualGlobalVersion !== null &&
                    initialGlobalVersion !== actualGlobalVersion && (
                        <Collapse in={open}>
                            <Alert
                                severity="warning"
                                variant="outlined"
                                action={
                                    <LoadingButton
                                        color="inherit"
                                        size="small"
                                        startIcon={<Refresh fontSize="small" />}
                                        loadingPosition="start"
                                        loading={isRefreshing}
                                        onClick={() => {
                                            setIsRefreshing(true);
                                            window.location.reload();
                                        }}
                                    >
                                        <FormattedMessage id="refresh" />
                                    </LoadingButton>
                                }
                                sx={{ marginBottom: 2 }}
                            >
                                <FormattedMessage id="about-dialog/alert-running-old-version-msg" />
                            </Alert>
                        </Collapse>
                    )}
                <Box sx={styles.mainSection}>
                    <Box sx={styles.logoSection}>
                        {logo || <LogoText appName="Suite" appColor={theme.palette.grey['500']} />}
                    </Box>
                    <Box sx={styles.mainInfos}>
                        <Fade
                            in={loadingGlobalVersion}
                            appear
                            unmountOnExit
                            onExited={() => setShowGlobalVersion(true)}
                        >
                            <CircularProgress />
                        </Fade>
                        {showGlobalVersion && (
                            <Typography>
                                <FormattedMessage
                                    id="about-dialog/version"
                                    defaultMessage="Version {version}"
                                    values={{
                                        version: (
                                            <Typography
                                                component="span"
                                                sx={
                                                    !loadingGlobalVersion && !!actualGlobalVersion
                                                        ? styles.versionFieldUnknown
                                                        : styles.versionField
                                                }
                                            >
                                                {actualGlobalVersion || 'unknown'}
                                            </Typography>
                                        ),
                                    }}
                                />
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent id="alert-dialog-description">
                <Box sx={styles.detailsSection}>
                    <Accordion disableGutters variant="outlined" disabled sx={{ display: 'none' }}>
                        {/* disabled, todo for future update */}
                        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
                            <Gavel fontSize="small" />
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                <FormattedMessage id="about-dialog/license" />
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{appLicense}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>license app summary text</AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters variant="outlined" TransitionProps={{ unmountOnExit: true }}>
                        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel2-content" id="panel2-header">
                            <Apps fontSize="small" />
                            <FormattedMessage id="about-dialog/modules-section" />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container sx={{ pl: 2 }} spacing={1}>
                                {loadingAdditionalModules ? (
                                    <Grid item xs display="inline-flex" justifyContent="center">
                                        <CircularProgress color="inherit" />
                                    </Grid>
                                ) : (
                                    (Array.isArray(modules) && (
                                        <>
                                            {[...modules].sort(compareModules).map((module, idx) => (
                                                <Module
                                                    // eslint-disable-next-line react/no-array-index-key -- modules aren't necessary uniques in the API, so we need something else for the key that must be unique
                                                    key={`module-${idx}`}
                                                    type={module.type}
                                                    name={module.name}
                                                    version={module.version}
                                                    gitTag={module.gitTag}
                                                    // license={module.license}
                                                />
                                            ))}
                                        </>
                                    )) || (
                                        <Typography color={(selectedTheme) => selectedTheme.palette.error.main}>
                                            Error
                                        </Typography>
                                    )
                                )}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    <FormattedMessage id="close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
