/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import TopBar from '../../src/components/TopBar';
import SnackbarProvider from '../../src/components/SnackbarProvider';
import AuthenticationRouter from '../../src/components/AuthenticationRouter';
import CardErrorBoundary from '../../src/components/CardErrorBoundary';
import {
    ElementType,
    EQUIPMENT_TYPE,
    equipmentStyles,
    getFileIcon,
    initializeAuthenticationDev,
    LANG_ENGLISH,
    LANG_FRENCH,
    LANG_SYSTEM,
    LIGHT_THEME,
    logout,
} from '../../src';
import { useSnackMessage } from '../../src/hooks/useSnackMessage';

import {
    Box,
    Button,
    Checkbox,
    createTheme,
    CssBaseline,
    FormControlLabel,
    FormGroup,
    Grid,
    StyledEngineProvider,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Typography,
} from '@mui/material';
import { styled } from '@mui/system';

import { useMatch } from 'react-router';
import { IntlProvider, useIntl } from 'react-intl';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';

import {
    card_error_boundary_en,
    card_error_boundary_fr,
    element_search_en,
    element_search_fr,
    equipment_search_en,
    equipment_search_fr,
    flat_parameters_en,
    flat_parameters_fr,
    login_en,
    login_fr,
    multiple_selection_dialog_en,
    multiple_selection_dialog_fr,
    report_viewer_en,
    report_viewer_fr,
    table_en,
    table_fr,
    top_bar_en,
    top_bar_fr,
    treeview_finder_en,
    treeview_finder_fr,
} from '../../src/index';
import translations from './demo_intl';

import PowsyblLogo from '../images/powsybl_logo.svg?react';
import AppPackage from '../../package.json';

import ReportViewerDialog from '../../src/components/ReportViewerDialog';
import TreeViewFinder, {
    generateTreeViewFinderClass,
} from '../../src/components/TreeViewFinder';
import TreeViewFinderConfig from './TreeViewFinderConfig';

import {
    fetchInfiniteTestDataList,
    fetchInfiniteTestDataTree,
    testDataList,
    testDataTree,
} from '../data/TreeViewFinder';

import { LOGS_JSON } from '../data/ReportViewer';

import { searchEquipments } from '../data/EquipmentSearchBar';
import { EquipmentItem } from '../../src/components/ElementSearchDialog/equipment-item';
import OverflowableText from '../../src/components/OverflowableText';

import { setShowAuthenticationRouterLogin } from '../../src/utils/actions';
import { TableTab } from './TableTab';
import { FlatParametersTab } from './FlatParametersTab';

import { toNestedGlobalSelectors } from '../../src/utils/styles';
import { InputsTab } from './InputsTab';
import inputs_en from '../../src/components/translations/inputs-en';
import inputs_fr from '../../src/components/translations/inputs-fr';

const messages = {
    en: {
        ...report_viewer_en,
        ...login_en,
        ...top_bar_en,
        ...table_en,
        ...treeview_finder_en,
        ...element_search_en,
        ...equipment_search_en,
        ...card_error_boundary_en,
        ...flat_parameters_en,
        ...multiple_selection_dialog_en,
        ...inputs_en,
        ...translations.en,
    },
    fr: {
        ...report_viewer_fr,
        ...login_fr,
        ...top_bar_fr,
        ...table_fr,
        ...treeview_finder_fr,
        ...element_search_fr,
        ...equipment_search_fr,
        ...card_error_boundary_fr,
        ...flat_parameters_fr,
        ...multiple_selection_dialog_fr,
        ...inputs_fr,
        ...translations.fr,
    },
};

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const getMuiTheme = (theme) => {
    if (theme === LIGHT_THEME) {
        return lightTheme;
    } else {
        return darkTheme;
    }
};

/**
 * @param {import('@mui/material/styles').Theme} theme Theme from ThemeProvider
 */
const TreeViewFinderCustomStyles = (theme) => ({
    '& .icon': {
        width: '32px',
        height: '32px',
    },
    '& .labelIcon': {
        backgroundColor: 'green',
        marginRight: theme.spacing(1),
    },
});

const TreeViewFinderCustomStylesEmotion = ({ theme }) =>
    toNestedGlobalSelectors(
        TreeViewFinderCustomStyles(theme),
        generateTreeViewFinderClass
    );
const CustomTreeViewFinder = styled(TreeViewFinder)(
    TreeViewFinderCustomStylesEmotion
);

const Crasher = () => {
    const [crash, setCrash] = useState(false);
    if (crash) {
        window.foonotexists.bar();
    }
    return <Button onClick={() => setCrash(true)}>CRASH ME</Button>;
};

function SnackErrorButton() {
    const { snackError } = useSnackMessage();
    return (
        <Button
            variant="contained"
            color="error"
            style={{ float: 'left', margin: '5px' }}
            onClick={() => {
                snackError({
                    messageTxt: 'Snack error message',
                    headerTxt: 'Header',
                });
            }}
        >
            error snack hook
        </Button>
    );
}

function SnackWarningButton() {
    const { snackWarning } = useSnackMessage();
    return (
        <Button
            variant="contained"
            color="warning"
            style={{ float: 'left', margin: '5px' }}
            onClick={() => {
                snackWarning({
                    messageTxt: 'Snack warning message',
                    headerTxt: 'Header',
                });
            }}
        >
            warning snack hook
        </Button>
    );
}

function SnackInfoButton() {
    const { snackInfo } = useSnackMessage();
    return (
        <Button
            variant="contained"
            color="info"
            style={{ float: 'left', margin: '5px' }}
            onClick={() => {
                snackInfo({
                    messageTxt: 'Snack info message',
                    headerTxt: 'Header',
                });
            }}
        >
            info snack hook
        </Button>
    );
}

const validateUser = (user) => {
    // change to false to simulate user unauthorized access
    return new Promise((resolve) =>
        window.setTimeout(() => resolve(true), 500)
    );
};

const AppContent = ({ language, onLanguageClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const intl = useIntl();
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [userManager, setUserManager] = useState({
        instance: null,
        error: null,
    });
    const [user, setUser] = useState(null);
    const [authenticationRouterError, setAuthenticationRouterError] =
        useState(null);
    const [
        showAuthenticationRouterLoginState,
        setShowAuthenticationRouterLoginState,
    ] = useState(false);

    const [theme, setTheme] = useState(LIGHT_THEME);

    const [tabIndex, setTabIndex] = useState(0);

    const [equipmentLabelling, setEquipmentLabelling] = useState(false);

    const [openReportViewer, setOpenReportViewer] = useState(false);
    const [openTreeViewFinderDialog, setOpenTreeViewFinderDialog] =
        useState(false);
    const [
        openTreeViewFinderDialogCustomDialog,
        setOpenTreeViewFinderDialogCustomDialog,
    ] = useState(false);

    // Can't use lazy initializer because useMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useMatch('/silent-renew-callback')
    );

    // TreeViewFinder data
    const [nodesTree, setNodesTree] = useState(testDataTree);
    const [nodesList, setNodesList] = useState(testDataList);

    const countNodes = (nodesList) => {
        return nodesList
            .map((node) => {
                if (node.children && node.children.length > 0) {
                    return 1 + countNodes(node.children);
                } else {
                    return 1;
                }
            })
            .reduce((a, b) => {
                return a + b;
            }, 0);
    };

    // TreeViewFinder Controlled parameters
    const [dynamicData, setDynamicData] = useState(false);
    const [dataFormat, setDataFormat] = useState('Tree');
    const [multiselect, setMultiselect] = useState(false);
    const [onlyLeaves, setOnlyLeaves] = useState(true);
    const [sortedAlphabetically, setSortedAlphabetically] = useState(false);

    // TreeViewFinder data update callbacks
    const updateInfiniteTestDataTreeCallback = (nodeId) => {
        setNodesTree(fetchInfiniteTestDataTree(nodeId));
    };
    const updateInfiniteTestDataListCallback = (nodeId) => {
        setNodesList(fetchInfiniteTestDataList(nodeId));
    };

    // OverFlowableText
    const [overflowableText, setOverflowableText] = useState('no overflow');

    const onChangeOverflowableText = (event) => {
        setOverflowableText(event.target.value);
    };
    // Equipments search bar
    const [equipmentsFound, setEquipmentsFound] = useState([]);
    const searchMatchingEquipments = (searchTerm) => {
        setEquipmentsFound(searchEquipments(searchTerm, equipmentLabelling));
    };
    const displayEquipment = (equipment) => {
        if (equipment != null) {
            equipment.type === EQUIPMENT_TYPE.SUBSTATION.name
                ? alert(`Equipment ${equipment.label} found !`)
                : alert(
                      `Equipment ${equipment.label} (${equipment.voltageLevelLabel}) found !`
                  );
        }
    };
    const [searchTermDisableReason] = useState('search disabled');
    const [searchTermDisabled, setSearchTermDisabled] = useState(false);

    const dispatch = (e) => {
        if (e.type === 'USER') {
            setUser(e.user);
        } else if (
            e.type === 'UNAUTHORIZED_USER_INFO' ||
            e.type === 'USER_VALIDATION_ERROR' ||
            e.type === 'LOGOUT_ERROR'
        ) {
            setAuthenticationRouterError({ ...e.authenticationRouterError });
        } else if (e.type === 'RESET_AUTHENTICATION_ROUTER_ERROR') {
            setAuthenticationRouterError(null);
        } else if (e.type === 'SHOW_AUTH_INFO_LOGIN') {
            setShowAuthenticationRouterLoginState(
                e.showAuthenticationRouterLogin
            );
        }
    };

    const handleThemeClick = (theme) => {
        setTheme(theme);
    };

    const handleEquipmentLabellingClick = (labelling) => {
        setEquipmentLabelling(labelling);
    };

    const apps = [
        {
            name: 'App1',
            url: '/app1',
            appColor: 'red',
            hiddenInAppsMenu: false,
        },
        { name: 'App2', url: '/app2' },
        { name: 'App3', url: '/app3', hiddenInAppsMenu: true },
    ];

    useEffect(() => {
        initializeAuthenticationDev(
            dispatch,
            initialMatchSilentRenewCallbackUrl != null,
            validateUser
        )
            .then((userManager) => {
                setUserManager({
                    instance: userManager,
                    error: null,
                });
                userManager.signinSilent().catch((error) => {
                    console.log(error);
                    dispatch(setShowAuthenticationRouterLogin(true));
                });
            })
            .catch(function (exception) {
                setUserManager({
                    instance: null,
                    error: exception.message,
                });
                dispatch(setShowAuthenticationRouterLogin(true));
                console.debug('error when creating userManager');
            });
        // Note: initialMatchSilentRenewCallbackUrl doesn't change
    }, [initialMatchSilentRenewCallbackUrl]);

    function testIcons() {
        return (
            <Grid container direction={'column'}>
                {Object.keys(ElementType).map((type) => (
                    <Grid container item key={type}>
                        <Grid item>{getFileIcon(type)}</Grid>
                        <Grid item>{type}</Grid>
                    </Grid>
                ))}
            </Grid>
        );
    }

    function sortAlphabetically(a, b) {
        return a.name.localeCompare(b.name);
    }

    const handleToggleDisableSearch = useCallback(
        () => setSearchDisabled((oldState) => !oldState),
        []
    );

    const aboutTimerVersion = useRef();
    const aboutTimerCmpnt = useRef();
    function simulateGetGlobalVersion() {
        console.log('getGlobalVersion() called');
        return new Promise(
            (resolve, reject) =>
                (aboutTimerVersion.current = window.setTimeout(
                    () => resolve('1.0.0-demo'),
                    1250
                ))
        );
    }
    function simulateGetAdditionalComponents() {
        console.log('getAdditionalComponents() called');
        return new Promise(
            (resolve, reject) =>
                (aboutTimerCmpnt.current = window.setTimeout(
                    () =>
                        resolve(
                            [
                                {
                                    type: 'server',
                                    name: 'Server 1',
                                    version: '1.0.0',
                                },
                                {
                                    type: 'server',
                                    name: 'Server 2',
                                    version: '1.0.0',
                                },
                                {
                                    type: 'server',
                                    name: 'Server 3',
                                    version: '1.0.0',
                                    gitTag: 'v1.0.0',
                                    license: 'MPL',
                                },
                                {
                                    type: 'server',
                                    name: 'Server 4',
                                    version: '1.0.0',
                                },
                                {
                                    type: 'server',
                                    name: 'Server 5',
                                    version: '1.0.0',
                                },
                                {
                                    type: 'server',
                                    name: 'Server 6',
                                    version: '1.0.0',
                                },
                                {
                                    type: 'server',
                                    name: 'Server 7',
                                    version: '1.0.0',
                                },
                                {
                                    type: 'server',
                                    name: 'Server 8',
                                    version: '1.0.0',
                                },
                                {
                                    type: 'server',
                                    name: 'Server 9',
                                    version: '1.0.0',
                                },
                                {
                                    type: 'app',
                                    name: 'My App 1',
                                    version: 'demo',
                                },
                                {
                                    type: 'app',
                                    name: 'My application with a long name',
                                    version: 'v0.0.1-long-tag',
                                },
                                {
                                    type: 'other',
                                    name: 'Something',
                                    version: 'none',
                                },
                                {
                                    name: 'Component with a very long name without version',
                                },
                            ].concat(
                                [...new Array(30)].map(() => ({
                                    name: 'Filling for demo',
                                    version: '???',
                                }))
                            )
                        ),
                    3000
                ))
        );
    }

    const defaultTab = (
        <div>
            <Box mt={3}>
                <Typography variant="h3" color="textPrimary" align="center">
                    Connected
                </Typography>
            </Box>
            <hr />
            <hr />
            {testIcons()}
            <hr />

            <SnackErrorButton />
            <SnackWarningButton />
            <SnackInfoButton />
            <Button
                variant="contained"
                style={{
                    float: 'left',
                    margin: '5px',
                }}
                onClick={() => setOpenReportViewer(true)}
            >
                Logs
            </Button>
            <ReportViewerDialog
                title={'Logs test'}
                open={openReportViewer}
                onClose={() => setOpenReportViewer(false)}
                jsonReport={LOGS_JSON}
            />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <TreeViewFinderConfig
                    dynamicData={dynamicData}
                    dataFormat={dataFormat}
                    multiselect={multiselect}
                    onlyLeaves={onlyLeaves}
                    sortedAlphabetically={sortedAlphabetically}
                    onDynamicDataChange={(event) =>
                        setDynamicData(event.target.value === 'dynamic')
                    }
                    onDataFormatChange={(event) =>
                        setDataFormat(event.target.value)
                    }
                    onSelectionTypeChange={(event) =>
                        setMultiselect(event.target.value === 'multiselect')
                    }
                    onOnlyLeavesChange={(event) =>
                        setOnlyLeaves(event.target.checked)
                    }
                    onSortedAlphabeticallyChange={(event) =>
                        setSortedAlphabetically(event.target.checked)
                    }
                />
                <Button
                    variant="contained"
                    style={{
                        float: 'left',
                        margin: '5px',
                    }}
                    onClick={() => setOpenTreeViewFinderDialog(true)}
                >
                    Open TreeViewFinder ...
                </Button>
                <Button
                    variant="contained"
                    style={{
                        float: 'left',
                        margin: '5px',
                    }}
                    onClick={handleToggleDisableSearch}
                >
                    Toggle search ...
                </Button>
                <TreeViewFinder
                    open={openTreeViewFinderDialog}
                    onClose={(nodes) => {
                        setOpenTreeViewFinderDialog(false);
                        console.log('Elements chosen : ', nodes);
                    }}
                    data={dataFormat === 'Tree' ? nodesTree : nodesList}
                    multiselect={multiselect}
                    onTreeBrowse={
                        dynamicData
                            ? dataFormat === 'Tree'
                                ? updateInfiniteTestDataTreeCallback
                                : updateInfiniteTestDataListCallback
                            : undefined
                    }
                    onlyLeaves={onlyLeaves}
                    sortMethod={
                        sortedAlphabetically ? sortAlphabetically : undefined
                    }
                    // Customisation props to pass the counter in the title
                    title={
                        'Number of nodes : ' +
                        countNodes(
                            dataFormat === 'Tree' ? nodesTree : nodesList
                        )
                    }
                />
                <Button
                    variant="contained"
                    style={{
                        float: 'left',
                        margin: '5px',
                    }}
                    onClick={() =>
                        setOpenTreeViewFinderDialogCustomDialog(true)
                    }
                >
                    Open Custom TreeViewFinder…
                </Button>
                <CustomTreeViewFinder
                    open={openTreeViewFinderDialogCustomDialog}
                    onClose={(nodes) => {
                        setOpenTreeViewFinderDialogCustomDialog(false);
                        console.log('Elements chosen : ', nodes);
                    }}
                    data={dataFormat === 'Tree' ? nodesTree : nodesList}
                    multiselect={multiselect}
                    onTreeBrowse={
                        dynamicData
                            ? dataFormat === 'Tree'
                                ? updateInfiniteTestDataTreeCallback
                                : updateInfiniteTestDataListCallback
                            : undefined
                    }
                    onlyLeaves={onlyLeaves}
                    // Customisation props
                    title={
                        'Custom Title TreeViewFinder, Number of nodes : ' +
                        countNodes(
                            dataFormat === 'Tree' ? nodesTree : nodesList
                        )
                    }
                    validationButtonText={'Move To this location'}
                />
            </div>
            <div
                style={{
                    margin: '10px 0px 0px 0px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <TextField
                    style={{
                        marginRight: '10px',
                    }}
                    label="text"
                    id="overflowableText-textField"
                    size={'small'}
                    defaultValue={'Set large text here to test'}
                    onChange={onChangeOverflowableText}
                />
                <OverflowableText
                    text={overflowableText}
                    style={{
                        width: '200px',
                        border: '1px solid black',
                    }}
                />
            </div>
            <hr />
            <div
                style={{
                    margin: '10px 0px 0px 0px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={searchTermDisabled}
                                onChange={() => {
                                    setSearchTermDisabled(!searchTermDisabled);
                                    // TO TEST search activation after some times
                                    setTimeout(
                                        () => setSearchTermDisabled(false),
                                        4000
                                    );
                                }}
                                name="search-disabled"
                            />
                        }
                        label="Disable Search"
                    />
                </FormGroup>
            </div>
            <hr />
            <Crasher />
        </div>
    );

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={getMuiTheme(theme)}>
                <SnackbarProvider hideIconVariant={false}>
                    <CssBaseline />
                    <CardErrorBoundary>
                        <TopBar
                            appName="Demo"
                            appColor="#808080"
                            appLogo={<PowsyblLogo />}
                            onParametersClick={() => console.log('settings')}
                            onLogoutClick={() =>
                                logout(dispatch, userManager.instance)
                            }
                            onLogoClick={() => console.log('logo')}
                            onThemeClick={handleThemeClick}
                            theme={theme}
                            appVersion={AppPackage.version}
                            appLicense={AppPackage.license}
                            globalVersionPromise={simulateGetGlobalVersion}
                            additionalModulesPromise={
                                simulateGetAdditionalComponents
                            }
                            onEquipmentLabellingClick={
                                handleEquipmentLabellingClick
                            }
                            equipmentLabelling={equipmentLabelling}
                            withElementsSearch={true}
                            searchingLabel={intl.formatMessage({
                                id: 'equipment_search/label',
                            })}
                            onSearchTermChange={searchMatchingEquipments}
                            onSelectionChange={displayEquipment}
                            searchDisabled={searchDisabled}
                            searchTermDisabled={searchTermDisabled}
                            searchTermDisableReason={searchTermDisableReason}
                            elementsFound={equipmentsFound}
                            renderElement={(props) => (
                                <EquipmentItem
                                    styles={equipmentStyles}
                                    {...props}
                                    key={props.element.key}
                                />
                            )}
                            onLanguageClick={onLanguageClick}
                            language={language}
                            user={user}
                            appsAndUrls={apps}
                        >
                            <Crasher />
                            <div
                                style={{
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    alignSelf: 'center',
                                }}
                            >
                                foobar-bazfoobar
                            </div>
                            <div style={{ flexGrow: 1 }} />
                            <div style={{ alignSelf: 'center' }}>baz</div>
                        </TopBar>
                        <CardErrorBoundary>
                            {user !== null ? (
                                <div>
                                    <Tabs
                                        value={tabIndex}
                                        onChange={(event, newTabIndex) =>
                                            setTabIndex(newTabIndex)
                                        }
                                    >
                                        <Tab label="others" />
                                        <Tab label="virtual table" />
                                        <Tab label="parameters" />
                                        <Tab label="inputs" />
                                    </Tabs>
                                    {tabIndex === 0 && defaultTab}
                                    {tabIndex === 1 && <TableTab />}
                                    {tabIndex === 2 && <FlatParametersTab />}
                                    {tabIndex === 3 && <InputsTab />}
                                </div>
                            ) : (
                                <AuthenticationRouter
                                    userManager={userManager}
                                    signInCallbackError={null}
                                    authenticationRouterError={
                                        authenticationRouterError
                                    }
                                    showAuthenticationRouterLogin={
                                        showAuthenticationRouterLoginState
                                    }
                                    dispatch={dispatch}
                                    navigate={navigate}
                                    location={location}
                                />
                            )}
                        </CardErrorBoundary>
                    </CardErrorBoundary>
                </SnackbarProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

const App = () => {
    const [computedLanguage, setComputedLanguage] = useState(LANG_ENGLISH);
    const [language, setLanguage] = useState(LANG_ENGLISH);

    const handleLanguageClick = (pickedLanguage) => {
        setLanguage(pickedLanguage);
        if (pickedLanguage === LANG_SYSTEM) {
            const sysLanguage = navigator.language.split(/[-_]/)[0];
            setComputedLanguage(
                [LANG_FRENCH, LANG_ENGLISH].includes(sysLanguage)
                    ? sysLanguage
                    : LANG_ENGLISH
            );
        } else {
            setComputedLanguage(pickedLanguage);
        }
    };

    return (
        <BrowserRouter basename={'/'}>
            <IntlProvider
                locale={computedLanguage}
                messages={messages[computedLanguage]}
            >
                <AppContent
                    language={language}
                    onLanguageClick={handleLanguageClick}
                />
            </IntlProvider>
        </BrowserRouter>
    );
};

export default App;
