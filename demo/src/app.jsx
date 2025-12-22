/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* eslint-disable func-names, no-nested-ternary, no-return-assign, no-promise-executor-return, no-alert, no-undef, react/jsx-no-bind, react/prop-types */

import {
    Box,
    Button,
    Checkbox,
    Chip,
    createTheme,
    CssBaseline,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    styled,
    StyledEngineProvider,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Tooltip,
    Typography,
} from '@mui/material';
import { enUS, frFR } from '@mui/material/locale';
import { Comment as CommentIcon } from '@mui/icons-material';
import { BrowserRouter, useLocation, useMatch, useNavigate } from 'react-router';
import { IntlProvider, useIntl } from 'react-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import translations from './demo_intl';
import PowsyblLogo from '../images/powsybl_logo.svg?react';
import AppPackage from '../../package.json';
import TreeViewFinderConfig from './TreeViewFinderConfig';
import {
    fetchInfiniteTestDataList,
    fetchInfiniteTestDataTree,
    testDataList,
    testDataTree,
} from '../data/TreeViewFinder';
import searchEquipments from '../data/EquipmentSearchBar';
import FlatParametersTab from './FlatParametersTab';
import InputsTab from './InputsTab';
import { EquipmentSearchDialog } from './equipment-search';
import { InlineSearch } from './inline-search';
import {
    AuthenticationRouter,
    CardErrorBoundary,
    cardErrorBoundaryEn,
    cardErrorBoundaryFr,
    commonButtonEn,
    commonButtonFr,
    csvEn,
    csvFr,
    descriptionEn,
    descriptionFr,
    elementSearchEn,
    elementSearchFr,
    ElementType,
    EquipmentItem,
    equipmentSearchEn,
    equipmentSearchFr,
    equipmentsEn,
    equipmentsFr,
    equipmentStyles,
    EquipmentType,
    filterEn,
    filterExpertEn,
    filterExpertFr,
    filterFr,
    flatParametersEn,
    flatParametersFr,
    generateTreeViewFinderClass,
    getFileIcon,
    initializeAuthenticationDev,
    inputsEn,
    inputsFr,
    LANG_ENGLISH,
    LANG_FRENCH,
    LANG_SYSTEM,
    LIGHT_THEME,
    loginEn,
    loginFr,
    logout,
    MultipleSelectionDialog,
    multipleSelectionDialogEn,
    multipleSelectionDialogFr,
    networkModificationsEn,
    networkModificationsFr,
    OverflowableChipWithHelperText,
    OverflowableText,
    parametersEn,
    parametersFr,
    reportViewerEn,
    reportViewerFr,
    SnackbarProvider,
    tableEn,
    tableFr,
    toNestedGlobalSelectors,
    TopBar,
    topBarEn,
    topBarFr,
    TreeViewFinder,
    treeviewFinderEn,
    treeviewFinderFr,
    useSnackMessage,
} from '../../src';

const messages = {
    en: {
        ...reportViewerEn,
        ...loginEn,
        ...topBarEn,
        ...tableEn,
        ...treeviewFinderEn,
        ...elementSearchEn,
        ...equipmentSearchEn,
        ...filterEn,
        ...filterExpertEn,
        ...descriptionEn,
        ...equipmentsEn,
        ...csvEn,
        ...cardErrorBoundaryEn,
        ...flatParametersEn,
        ...multipleSelectionDialogEn,
        ...commonButtonEn,
        ...networkModificationsEn,
        ...inputsEn,
        ...parametersEn,
        ...translations.en,
    },
    fr: {
        ...reportViewerFr,
        ...loginFr,
        ...topBarFr,
        ...tableFr,
        ...treeviewFinderFr,
        ...elementSearchFr,
        ...equipmentSearchFr,
        ...filterFr,
        ...descriptionFr,
        ...equipmentsFr,
        ...csvFr,
        ...filterExpertFr,
        ...cardErrorBoundaryFr,
        ...flatParametersFr,
        ...commonButtonFr,
        ...networkModificationsFr,
        ...multipleSelectionDialogFr,
        ...inputsFr,
        ...parametersFr,
        ...translations.fr,
    },
};

const lightTheme = {
    palette: {
        mode: 'light',
    },
};

const darkTheme = {
    palette: {
        mode: 'dark',
    },
};

const useMuiTheme = (theme, language) => {
    return useMemo(
        () => createTheme(theme === LIGHT_THEME ? lightTheme : darkTheme, language === LANG_FRENCH ? frFR : enUS),
        [language, theme]
    );
};

const style = {
    button: {
        float: 'left',
        margin: '5px',
    },
};

/**
 * @param {import('@mui/material').Theme} theme Theme from ThemeProvider
 */
const TreeViewFinderCustomStyles = (theme) => ({
    icon: {
        width: '32px',
        height: '32px',
    },
    labelIcon: {
        backgroundColor: 'green',
        marginRight: theme.spacing(1),
    },
});

const TreeViewFinderCustomStylesEmotion = ({ theme }) =>
    toNestedGlobalSelectors(TreeViewFinderCustomStyles(theme), generateTreeViewFinderClass);
const CustomTreeViewFinder = styled(TreeViewFinder)(TreeViewFinderCustomStylesEmotion);

function Crasher() {
    const [crash, setCrash] = useState(false);
    if (crash) {
        window.foonotexists.bar();
    }
    return <Button onClick={() => setCrash(true)}>CRASH ME</Button>;
}

function SnackErrorButton() {
    const { snackError } = useSnackMessage();
    return (
        <Button
            variant="contained"
            color="error"
            style={style.button}
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
            style={style.button}
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
            style={style.button}
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

function SnackSuccessButton() {
    const { snackSuccess } = useSnackMessage();
    return (
        <Button
            variant="contained"
            color="success"
            style={style.button}
            onClick={() => {
                snackSuccess({
                    messageTxt: 'Snack success message',
                    headerTxt: 'Header',
                });
            }}
        >
            success snack hook
        </Button>
    );
}

function PermanentSnackButton() {
    const { snackInfo, closeSnackbar } = useSnackMessage();
    const [snackKey, setSnackKey] = useState(undefined);
    return (
        <>
            <Button
                variant="contained"
                color="info"
                style={style.button}
                onClick={() => {
                    const key = snackInfo({
                        messageTxt: 'Permanent Snack info message',
                        headerTxt: 'Header',
                        persist: true,
                    });
                    setSnackKey(key);
                }}
            >
                permanent snack
            </Button>
            <Button
                variant="contained"
                color="info"
                style={style.button}
                onClick={() => {
                    closeSnackbar(snackKey);
                    setSnackKey(undefined);
                }}
            >
                close snack
            </Button>
        </>
    );
}

function AppContent({ language, onLanguageClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const intl = useIntl();
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [userManager, setUserManager] = useState({
        instance: null,
        error: null,
    });
    const [user, setUser] = useState(null);
    const [authenticationRouterError, setAuthenticationRouterError] = useState(null);
    const [showAuthenticationRouterLoginState, setShowAuthenticationRouterLoginState] = useState(false);

    const [theme, setTheme] = useState(LIGHT_THEME);

    const [tabIndex, setTabIndex] = useState(0);

    const [equipmentLabelling, setEquipmentLabelling] = useState(false);

    const [openMultiChoiceDialog, setOpenMultiChoiceDialog] = useState(false);
    const [openDraggableMultiChoiceDialog, setOpenDraggableMultiChoiceDialog] = useState(false);

    const [openTreeViewFinderDialog, setOpenTreeViewFinderDialog] = useState(false);
    const [openTreeViewFinderDialogCustomDialog, setOpenTreeViewFinderDialogCustomDialog] = useState(false);

    const [developerMode, setDeveloperMode] = useState(false);

    // Can't use lazy initializer because useMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(useMatch('/silent-renew-callback'));

    // TreeViewFinder data
    const [nodesTree, setNodesTree] = useState(testDataTree);
    const [nodesList, setNodesList] = useState(testDataList);

    const countNodes = (nodesList) => {
        return nodesList
            .map((node) => {
                if (node.children && node.children.length > 0) {
                    return 1 + countNodes(node.children);
                }
                return 1;
            })
            .reduce((a, b) => {
                return a + b;
            }, 0);
    };

    // TreeViewFinder Controlled parameters
    const [dynamicData, setDynamicData] = useState(false);
    const [dataFormat, setDataFormat] = useState('Tree');
    const [multiSelect, setMultiSelect] = useState(false);
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
            if (equipment.type === EquipmentType.SUBSTATION) {
                alert(`Equipment ${equipment.label} found !`);
            } else {
                alert(`Equipment ${equipment.label} (${equipment.voltageLevelLabel}) found !`);
            }
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
            setShowAuthenticationRouterLoginState(e.showAuthenticationRouterLogin);
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
        initializeAuthenticationDev(dispatch, initialMatchSilentRenewCallbackUrl != null)
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
            <Grid container direction="column">
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

    const handleToggleDisableSearch = useCallback(() => setSearchDisabled((oldState) => !oldState), []);

    const aboutTimerVersion = useRef();
    const aboutTimerCmpnt = useRef();

    function simulateGetGlobalVersion() {
        console.log('getGlobalVersion() called');
        return new Promise(
            (resolve, _reject) => (aboutTimerVersion.current = window.setTimeout(() => resolve('1.0.0-demo'), 1250))
        );
    }

    function simulateGetAdditionalComponents() {
        console.log('getAdditionalComponents() called');
        return new Promise(
            (resolve, _reject) =>
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

    const [checkBoxListOption, setCheckBoxListOption] = useState([
        { id: 'kiki', label: 'Kylian Mbappe' },
        {
            id: 'ney',
            label: 'Neymar',
            labelSecondary: (
                <Tooltip title="this is the Chip tooltip">
                    <Chip
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Chip click doesn't proc click in list item");
                        }}
                        size="small"
                        label="GOAT"
                    />
                </Tooltip>
            ),
        },
        { id: 'lapulga', label: 'Lionel Messi' },
        { id: 'ibra', label: 'Zlatan Ibrahimovic' },
        {
            id: 'john',
            label: 'Johannes Vennegoor of Hesselink is the football player with the longest name in history',
            labelSecondary: (
                <Tooltip title="this is the Chip tooltip">
                    <Chip
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Chip click doesn't proc click in list item");
                        }}
                        size="small"
                        label="GOAT"
                    />
                </Tooltip>
            ),
        },
    ]);

    const secondaryAction = (item, isItemHovered) =>
        isItemHovered && (
            <IconButton aria-label="comment">
                <CommentIcon />
            </IconButton>
        );
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

            <PermanentSnackButton />
            <SnackErrorButton />
            <SnackWarningButton />
            <SnackInfoButton />
            <SnackSuccessButton />

            <Button
                variant="contained"
                style={{
                    float: 'left',
                    margin: '5px',
                }}
                onClick={() => setOpenMultiChoiceDialog(true)}
            >
                Checkbox list
            </Button>
            <MultipleSelectionDialog
                items={checkBoxListOption}
                selectedItems={[]}
                open={openMultiChoiceDialog}
                getItemLabel={(o) => o.label}
                getItemLabelSecondary={(o) => o.labelSecondary}
                getItemId={(o) => o.id}
                handleClose={() => setOpenMultiChoiceDialog(false)}
                handleValidate={() => setOpenMultiChoiceDialog(false)}
                titleId="Checkbox list"
                divider
                secondaryAction={secondaryAction}
                addSelectAllCheckbox
                onItemClick={(item) => console.log('clicked', item)}
                isItemClickable={(item) => item.id === 'ney' || item.id === 'john'}
            />

            <Button
                variant="contained"
                style={{
                    float: 'left',
                    margin: '5px',
                }}
                onClick={() => setOpenDraggableMultiChoiceDialog(true)}
            >
                Draggable checkbox list
            </Button>
            <MultipleSelectionDialog
                items={checkBoxListOption}
                selectedItems={[]}
                open={openDraggableMultiChoiceDialog}
                getItemLabel={(o) => o.label}
                getItemLabelSecondary={(o) => o.labelSecondary}
                getItemId={(o) => o.id}
                handleClose={() => setOpenDraggableMultiChoiceDialog(false)}
                handleValidate={() => setOpenDraggableMultiChoiceDialog(false)}
                titleId="Draggable checkbox list"
                divider
                secondaryAction={secondaryAction}
                isDndActive
                onDragEnd={({ source, destination }) => {
                    if (destination !== null && source.index !== destination.index) {
                        const res = [...checkBoxListOption];
                        const [item] = res.splice(source.index, 1);
                        res.splice(destination ? destination.index : checkBoxListOption.length, 0, item);
                        setCheckBoxListOption(res);
                    }
                }}
                addSelectAllCheckbox
                onItemClick={(item) => console.log('clicked', item)}
                isItemClickable={(item) => item.id.indexOf('i') >= 0}
                sx={{
                    items: (item) => ({
                        label: {
                            color: item.id.indexOf('i') >= 0 ? 'blue' : 'red',
                        },
                    }),
                }}
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
                    multiSelect={multiSelect}
                    onlyLeaves={onlyLeaves}
                    sortedAlphabetically={sortedAlphabetically}
                    onDynamicDataChange={(event) => setDynamicData(event.target.value === 'dynamic')}
                    onDataFormatChange={(event) => setDataFormat(event.target.value)}
                    onSelectionTypeChange={(event) => setMultiSelect(event.target.value === 'multiselect')}
                    onOnlyLeavesChange={(event) => setOnlyLeaves(event.target.checked)}
                    onSortedAlphabeticallyChange={(event) => setSortedAlphabetically(event.target.checked)}
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
                    multiSelect={multiSelect}
                    onTreeBrowse={
                        dynamicData
                            ? dataFormat === 'Tree'
                                ? updateInfiniteTestDataTreeCallback
                                : updateInfiniteTestDataListCallback
                            : undefined
                    }
                    onlyLeaves={onlyLeaves}
                    sortMethod={sortedAlphabetically ? sortAlphabetically : undefined}
                    // Customisation props to pass the counter in the title
                    title={`Number of nodes : ${countNodes(dataFormat === 'Tree' ? nodesTree : nodesList)}`}
                />
                <Button
                    variant="contained"
                    style={{
                        float: 'left',
                        margin: '5px',
                    }}
                    onClick={() => setOpenTreeViewFinderDialogCustomDialog(true)}
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
                    multiSelect={multiSelect}
                    onTreeBrowse={
                        dynamicData
                            ? dataFormat === 'Tree'
                                ? updateInfiniteTestDataTreeCallback
                                : updateInfiniteTestDataListCallback
                            : undefined
                    }
                    onlyLeaves={onlyLeaves}
                    // Customisation props
                    title={`Custom Title TreeViewFinder, Number of nodes : ${countNodes(
                        dataFormat === 'Tree' ? nodesTree : nodesList
                    )}`}
                    validationButtonText="Move To this location"
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
                    size="small"
                    defaultValue="Set large text here to test"
                    onChange={onChangeOverflowableText}
                />
                <OverflowableText
                    text={overflowableText}
                    style={{
                        width: '200px',
                        border: '1px solid black',
                    }}
                />
                <OverflowableText
                    text={overflowableText}
                    maxLineCount={2}
                    style={{
                        width: '200px',
                        border: '1px solid black',
                    }}
                />
                <OverflowableChipWithHelperText
                    label="Chip with helper text which is very very long and will be truncated"
                    helperText="HELPER TEXT"
                />
            </div>
            <Box mt={2} width={500}>
                <InlineSearch />
            </Box>
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
                                    setTimeout(() => setSearchTermDisabled(false), 4000);
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
            <ThemeProvider theme={useMuiTheme(theme, language)}>
                <SnackbarProvider hideIconVariant={false}>
                    <CssBaseline />
                    <CardErrorBoundary>
                        <TopBar
                            appName="Demo"
                            appColor="#808080"
                            appLogo={<PowsyblLogo />}
                            onDeveloperModeClick={() => setDeveloperMode(!developerMode)}
                            developerMode={developerMode}
                            onLogoutClick={() => logout(dispatch, userManager.instance)}
                            onLogoClick={() => console.log('logo')}
                            onThemeClick={handleThemeClick}
                            theme={theme}
                            appVersion={AppPackage.version}
                            appLicense={AppPackage.license}
                            globalVersionPromise={simulateGetGlobalVersion}
                            additionalModulesPromise={simulateGetAdditionalComponents}
                            onEquipmentLabellingClick={handleEquipmentLabellingClick}
                            equipmentLabelling={equipmentLabelling}
                            withElementsSearch
                            searchingLabel={intl.formatMessage({ id: 'equipment_search/label' })}
                            onSearchTermChange={searchMatchingEquipments}
                            onSelectionChange={displayEquipment}
                            searchDisabled={searchDisabled}
                            searchTermDisabled={searchTermDisabled}
                            searchTermDisableReason={searchTermDisableReason}
                            elementsFound={equipmentsFound}
                            renderElement={(props) => (
                                <EquipmentItem styles={equipmentStyles} {...props} key={props.element.key} />
                            )}
                            onLanguageClick={onLanguageClick}
                            language={language}
                            user={user}
                            appsAndUrls={apps}
                            dense
                        >
                            <Crasher />
                            <EquipmentSearchDialog />
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
                                    <Tabs value={tabIndex} onChange={(event, newTabIndex) => setTabIndex(newTabIndex)}>
                                        <Tab label="others" />
                                        <Tab label="parameters" />
                                        <Tab label="inputs" />
                                    </Tabs>
                                    {tabIndex === 0 && defaultTab}
                                    {tabIndex === 1 && <FlatParametersTab />}
                                    {tabIndex === 2 && <InputsTab />}
                                </div>
                            ) : (
                                <AuthenticationRouter
                                    userManager={userManager}
                                    signInCallbackError={null}
                                    authenticationRouterError={authenticationRouterError}
                                    showAuthenticationRouterLogin={showAuthenticationRouterLoginState}
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
}

function App() {
    const [computedLanguage, setComputedLanguage] = useState(LANG_ENGLISH);
    const [language, setLanguage] = useState(LANG_ENGLISH);

    const handleLanguageClick = (pickedLanguage) => {
        setLanguage(pickedLanguage);
        if (pickedLanguage === LANG_SYSTEM) {
            const sysLanguage = navigator.language.split(/[-_]/)[0];
            setComputedLanguage([LANG_FRENCH, LANG_ENGLISH].includes(sysLanguage) ? sysLanguage : LANG_ENGLISH);
        } else {
            setComputedLanguage(pickedLanguage);
        }
    };

    return (
        <BrowserRouter basename="/">
            <IntlProvider locale={computedLanguage} messages={messages[computedLanguage]}>
                <AppContent language={language} onLanguageClick={handleLanguageClick} />
            </IntlProvider>
        </BrowserRouter>
    );
}

export default App;
