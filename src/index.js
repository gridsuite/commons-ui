/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export { default as TreeViewFinder } from './components/TreeViewFinder';
export { default as TopBar } from './components/TopBar';
export { default as AboutDialog } from './components/TopBar/AboutDialog';
export { default as SnackbarProvider } from './components/SnackbarProvider';
export { default as AuthenticationRouter } from './components/AuthenticationRouter';
export { default as MuiVirtualizedTable } from './components/MuiVirtualizedTable';
export {
    KeyedColumnsRowIndexer,
    CHANGE_WAYS,
} from './components/MuiVirtualizedTable';
export { default as ReportViewer } from './components/ReportViewer';
export { default as ReportViewerDialog } from './components/ReportViewerDialog';
export { default as OverflowableText } from './components/OverflowableText';
export { default as ElementSearchDialog } from './components/ElementSearchDialog';
export { default as FlatParameters } from './components/FlatParameters';
export { default as MultipleSelectionDialog } from './components/MultipleSelectionDialog';

export { ElementType } from './utils/ElementType';

export {
    EQUIPMENT_TYPE,
    EquipmentType,
    getEquipmentsInfosForSearchBar,
    equipmentStyles,
} from './utils/EquipmentType';

export {
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    logout,
    dispatchUser,
    getPreLoginPath,
} from './utils/AuthService';

export { getFileIcon } from './utils/ElementIcon';

export {
    DEFAULT_CELL_PADDING,
    DEFAULT_HEADER_HEIGHT,
    DEFAULT_ROW_HEIGHT,
} from './components/MuiVirtualizedTable/MuiVirtualizedTable';

export { DARK_THEME, LIGHT_THEME } from './components/TopBar/TopBar';

export {
    LANG_SYSTEM,
    LANG_ENGLISH,
    LANG_FRENCH,
} from './components/TopBar/topBarConstants';

export {
    USER,
    setLoggedUser,
    SIGNIN_CALLBACK_ERROR,
    setSignInCallbackError,
    UNAUTHORIZED_USER_INFO,
    LOGOUT_ERROR,
    USER_VALIDATION_ERROR,
    RESET_AUTHENTICATION_ROUTER_ERROR,
    SHOW_AUTH_INFO_LOGIN,
} from './utils/actions';
export { default as report_viewer_en } from './components/translations/report-viewer-en';
export { default as report_viewer_fr } from './components/translations/report-viewer-fr';
export { default as login_en } from './components/translations/login-en';
export { default as login_fr } from './components/translations/login-fr';
export { default as top_bar_en } from './components/translations/top-bar-en';
export { default as top_bar_fr } from './components/translations/top-bar-fr';
export { default as table_en } from './components/translations/table-en';
export { default as table_fr } from './components/translations/table-fr';
export { default as treeview_finder_en } from './components/translations/treeview-finder-en';
export { default as treeview_finder_fr } from './components/translations/treeview-finder-fr';
export { default as element_search_en } from './components/translations/element-search-en';
export { default as element_search_fr } from './components/translations/element-search-fr';
export { default as equipment_search_en } from './components/translations/equipment-search-en';
export { default as equipment_search_fr } from './components/translations/equipment-search-fr';
export { default as card_error_boundary_en } from './components/translations/card-error-boundary-en';
export { default as card_error_boundary_fr } from './components/translations/card-error-boundary-fr';
export { default as flat_parameters_en } from './components/translations/flat-parameters-en';
export { default as flat_parameters_fr } from './components/translations/flat-parameters-fr';
export { default as multiple_selection_dialog_en } from './components/translations/multiple-selection-dialog-en';
export { default as multiple_selection_dialog_fr } from './components/translations/multiple-selection-dialog-fr';
export { default as common_button_en } from './components/translations/common-button-en';
export { default as common_button_fr } from './components/translations/common-button-fr';
export { default as directory_items_input_en } from './components/translations/directory-items-input-en';
export { default as directory_items_input_fr } from './components/translations/directory-items-input-fr';

export { TagRenderer } from './components/ElementSearchDialog';
export { EquipmentItem } from './components/ElementSearchDialog/equipment-item';
export { default as CardErrorBoundary } from './components/CardErrorBoundary';
export { useIntlRef } from './hooks/useIntlRef';
export { useSnackMessage } from './hooks/useSnackMessage';
export { useDebounce } from './hooks/useDebounce';
export { default as AutocompleteInput } from './components/react-hook-form/autocomplete-input';
export { default as TextInput } from './components/react-hook-form/text-input';
export { default as ExpandingTextField } from './components/react-hook-form/ExpandingTextField';
export { default as RadioInput } from './components/react-hook-form/radio-input';
export { default as SliderInput } from './components/react-hook-form/slider-input';
export { default as FloatInput } from './components/react-hook-form/numbers/float-input';
export { default as IntegerInput } from './components/react-hook-form/numbers/integer-input';
export { default as SelectInput } from './components/react-hook-form/select-input';
export { default as CheckboxInput } from './components/react-hook-form/booleans/checkbox-input';
export { default as SwitchInput } from './components/react-hook-form/booleans/switch-input';
export { default as ErrorInput } from './components/react-hook-form/error-management/error-input';
export { default as FieldErrorAlert } from './components/react-hook-form/error-management/field-error-alert';
export { default as MidFormError } from './components/react-hook-form/error-management/mid-form-error';
export { default as TextFieldWithAdornment } from './components/react-hook-form/utils/text-field-with-adornment';
export { default as FieldLabel } from './components/react-hook-form/utils/field-label';
export { default as SubmitButton } from './components/react-hook-form/utils/submit-button';
export { default as CancelButton } from './components/react-hook-form/utils/cancel-button';
export {
    genHelperPreviousValue,
    genHelperError,
    identity,
    isFieldRequired,
} from './components/react-hook-form/utils/functions';
export { default as DirectoryItemsInput } from './components/react-hook-form/directory-items-input';
export { default as DirectoryItemSelector } from './components/DirectoryItemSelector/directory-item-selector';
export { RawReadOnlyInput } from './components/react-hook-form/raw-read-only-input';

export { default as FilterCreationDialog } from './components/filter/filter-creation-dialog';
export { default as ExpertFilterEditionDialog } from './components/filter/expert/expert-filter-edition-dialog';
export { default as ExplicitNamingFilterEditionDialog } from './components/filter/explicit-naming/explicit-naming-filter-edition-dialog';
export { default as CriteriaBasedFilterEditionDialog } from './components/filter/criteria-based/criteria-based-filter-edition-dialog';
export {
    saveExplicitNamingFilter,
    saveCriteriaBasedFilter,
    saveExpertFilter,
} from './components/filter/filters-utils';
export {
    default as RangeInput,
    DEFAULT_RANGE_VALUE,
    getRangeInputDataForm,
    getRangeInputSchema,
} from './utils/rhf-inputs/range-input';
export { default as InputWithPopupConfirmation } from './utils/rhf-inputs/select-inputs/input-with-popup-confirmation';
export { default as MuiSelectInput } from './utils/rhf-inputs/select-inputs/mui-select-input';
export {
    default as CountriesInput,
    PARAM_LANGUAGE,
    getSystemLanguage,
    getComputedLanguage,
} from './utils/rhf-inputs/select-inputs/countries-input';
export { default as MultipleAutocompleteInput } from './utils/rhf-inputs/autocomplete-inputs/multiple-autocomplete-input';
export { default as CsvUploader } from './utils/rhf-inputs/ag-grid-table-rhf/csv-uploader/csv-uploader';
export { UniqueNameInput } from './components/commons/unique-name-input';
export { UserManagerMock } from './utils/UserManagerMock';
