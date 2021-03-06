export TopBar from './components/TopBar';
export SnackbarProvider from './components/SnackbarProvider';
export AuthenticationRouter from './components/AuthenticationRouter';
export MuiVirtualizedTable from './components/MuiVirtualizedTable';
export ReportViewer from './components/ReportViewer';

export {
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    logout,
    dispatchUser,
    getPreLoginPath,
} from './utils/AuthService';

export {
    DEFAULT_CELL_PADDING,
    DEFAULT_HEADER_HEIGHT,
    DEFAULT_ROW_HEIGHT,
} from './components/MuiVirtualizedTable/MuiVirtualizedTable';

export {
    DARK_THEME,
    LIGHT_THEME,
    LANG_SYSTEM,
    LANG_ENGLISH,
    LANG_FRENCH,
} from './components/TopBar/TopBar';
export {
    USER,
    setLoggedUser,
    SIGNIN_CALLBACK_ERROR,
    setSignInCallbackError,
} from './utils/actions';
export login_en from './components/translations/login-en';
export login_fr from './components/translations/login-fr';
export top_bar_en from './components/translations/top-bar-en';
export top_bar_fr from './components/translations/top-bar-fr';
