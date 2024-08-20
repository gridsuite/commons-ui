/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export { TreeViewFinder } from './components/TreeViewFinder';
export type { TreeViewFinderProps, TreeViewFinderNodeProps } from './components/TreeViewFinder';
export { TopBar } from './components/TopBar';
export type { TopBarProps } from './components/TopBar';
export { default as AboutDialog } from './components/TopBar/AboutDialog';
export type { AboutDialogProps, GridSuiteModule } from './components/TopBar/AboutDialog';
export { default as SnackbarProvider } from './components/SnackbarProvider';
export { default as AuthenticationRouter } from './components/AuthenticationRouter';
export type {
    AuthenticationRouterErrorState,
    AuthenticationRouterProps,
    UserManagerState,
} from './components/AuthenticationRouter';
export {
    MuiVirtualizedTable,
    KeyedColumnsRowIndexer,
    ChangeWays,
    DEFAULT_CELL_PADDING,
    DEFAULT_HEADER_HEIGHT,
    DEFAULT_ROW_HEIGHT,
} from './components/MuiVirtualizedTable';
export type { MuiVirtualizedTableProps, CustomColumnProps, RowProps } from './components/MuiVirtualizedTable';
export { default as ReportViewer } from './components/ReportViewer';
export type { ReportViewerProps } from './components/ReportViewer';
export { default as ReportViewerDialog } from './components/ReportViewerDialog';
export type { ReportViewerDialogProps } from './components/ReportViewerDialog';
export { default as OverflowableText } from './components/OverflowableText';
export type { OverflowableTextProps } from './components/OverflowableText';
export { ElementSearchDialog } from './components/ElementSearchDialog';
export type { ElementSearchDialogProps } from './components/ElementSearchDialog';
export { default as FlatParameters } from './components/FlatParameters';
export { default as CheckboxList } from './components/CheckBoxList/check-box-list';
export type { FlatParametersProps, Parameter } from './components/FlatParameters';
export { default as ExpandableGroup } from './components/ExpandableGroup';
export type { ExpandableGroupProps } from './components/ExpandableGroup';
export { default as MultipleSelectionDialog } from './components/MultipleSelectionDialog';
export type { MultipleSelectionDialogProps } from './components/MultipleSelectionDialog';
export { default as CustomMuiDialog } from './components/dialogs/custom-mui-dialog';
export type { CustomMuiDialogProps } from './components/dialogs/custom-mui-dialog';
export { default as DescriptionModificationDialog } from './components/dialogs/description-modification-dialog';
export type { DescriptionModificationDialogProps } from './components/dialogs/description-modification-dialog';
export { default as DescriptionField } from './components/inputs/react-hook-form/description-field';
export { default as ModifyElementSelection } from './components/dialogs/modify-element-selection';
export type { ModifyElementSelectionProps } from './components/dialogs/modify-element-selection';
export { default as CriteriaBasedForm } from './components/filter/criteria-based/criteria-based-form';
export type { CriteriaBasedFormProps } from './components/filter/criteria-based/criteria-based-form';
export { default as PopupConfirmationDialog } from './components/dialogs/popup-confirmation-dialog';
export type { PopupConfirmationDialogProps } from './components/dialogs/popup-confirmation-dialog';
export { default as BottomRightButtons } from './components/inputs/react-hook-form/ag-grid-table/bottom-right-buttons';
export type { BottomRightButtonsProps } from './components/inputs/react-hook-form/ag-grid-table/bottom-right-buttons';
export { default as CustomAgGridTable } from './components/inputs/react-hook-form/ag-grid-table/custom-ag-grid-table';
export type { CustomAgGridTableProps } from './components/inputs/react-hook-form/ag-grid-table/custom-ag-grid-table';
export { ROW_DRAGGING_SELECTION_COLUMN_DEF } from './components/inputs/react-hook-form/ag-grid-table/custom-ag-grid-table';
export {
    Line,
    Generator,
    Load,
    Battery,
    SVC,
    DanglingLine,
    LCC,
    VSC,
    Hvdc,
    BusBar,
    TwoWindingTransfo,
    ThreeWindingTransfo,
    ShuntCompensator,
    VoltageLevel,
    Substation,
    noSelectionForCopy,
} from './utils/equipment-types';

export { default as FieldConstants } from './utils/field-constants';

export { fields as EXPERT_FILTER_FIELDS } from './components/filter/expert/expert-filter-constants';
export { default as CustomReactQueryBuilder } from './components/inputs/react-query-builder/custom-react-query-builder';
export type { CustomReactQueryBuilderProps } from './components/inputs/react-query-builder/custom-react-query-builder';
export {
    EXPERT_FILTER_QUERY,
    rqbQuerySchemaValidator,
    getExpertFilterEmptyFormData,
} from './components/filter/expert/expert-filter-form';
export { importExpertRules, exportExpertRules } from './components/filter/expert/expert-filter-utils';
export type { RuleTypeExport, RuleGroupTypeExport } from './components/filter/expert/expert-filter.type';
export { formatQuery } from 'react-querybuilder';

export { default as yup } from './utils/yup-config';

export {
    GRIDSUITE_DEFAULT_PRECISION,
    roundToPrecision,
    roundToDefaultPrecision,
    isBlankOrEmpty,
    unitToMicroUnit,
    microUnitToUnit,
} from './utils/conversion-utils';

export { ElementType } from './utils/ElementType';
export type { ElementAttributes, Option, Equipment } from './utils/types';

export { EQUIPMENT_TYPE, EquipmentType, getEquipmentsInfosForSearchBar, equipmentStyles } from './utils/EquipmentType';

export {
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    logout,
    dispatchUser,
    getPreLoginPath,
} from './utils/AuthService';

export { default as getFileIcon } from './utils/ElementIcon';

export { DARK_THEME, LIGHT_THEME, LANG_SYSTEM, LANG_ENGLISH, LANG_FRENCH } from './components/TopBar/TopBar';
export type { GsLang, GsLangUser, GsTheme } from './components/TopBar/TopBar';

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
} from './redux/authActions';
export type {
    AuthenticationActions,
    AuthenticationRouterErrorBase,
    AuthenticationRouterErrorAction,
    LogoutErrorAction,
    ShowAuthenticationRouterLoginAction,
    SignInCallbackErrorAction,
    UnauthorizedUserAction,
    UserAction,
    UserValidationErrorAction,
} from './redux/authActions';
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
export { default as filter_en } from './components/translations/filter-en';
export { default as filter_fr } from './components/translations/filter-fr';
export { default as filter_expert_en } from './components/translations/filter-expert-en';
export { default as filter_expert_fr } from './components/translations/filter-expert-fr';
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

export { TagRenderer, ElementSearchInput, useElementSearch } from './components/ElementSearchDialog';
export type { Paginated, TagRendererProps } from './components/ElementSearchDialog';
export { EquipmentItem } from './components/ElementSearchDialog/equipment-item';
export type { EquipmentItemProps } from './components/ElementSearchDialog/equipment-item';
export { default as CardErrorBoundary } from './components/CardErrorBoundary';
export { default as useIntlRef } from './hooks/useIntlRef';
export { useSnackMessage } from './hooks/useSnackMessage';
export { default as useDebounce } from './hooks/useDebounce';
export { default as usePrevious } from './hooks/usePrevious';
export { default as useConfidentialityWarning } from './hooks/useConfidentialityWarning';
export { default as SelectClearable } from './components/inputs/select-clearable';
export type { SelectClearableProps } from './components/inputs/select-clearable';
export { default as useCustomFormContext } from './components/inputs/react-hook-form/provider/use-custom-form-context';
export { default as CustomFormProvider } from './components/inputs/react-hook-form/provider/custom-form-provider';
export type { MergedFormContextProps } from './components/inputs/react-hook-form/provider/custom-form-provider';
export { default as AutocompleteInput } from './components/inputs/react-hook-form/autocomplete-inputs/autocomplete-input';
export type { AutocompleteInputProps } from './components/inputs/react-hook-form/autocomplete-inputs/autocomplete-input';
export { default as TextInput } from './components/inputs/react-hook-form/text-input';
export type { TextInputProps } from './components/inputs/react-hook-form/text-input';
export { default as ExpandingTextField } from './components/inputs/react-hook-form/ExpandingTextField';
export type { ExpandingTextFieldProps } from './components/inputs/react-hook-form/ExpandingTextField';
export { default as RadioInput } from './components/inputs/react-hook-form/radio-input';
export type { RadioInputProps } from './components/inputs/react-hook-form/radio-input';
export { default as SliderInput } from './components/inputs/react-hook-form/slider-input';
export type { SliderInputProps } from './components/inputs/react-hook-form/slider-input';
export { default as FloatInput } from './components/inputs/react-hook-form/numbers/float-input';
export type { FloatInputProps } from './components/inputs/react-hook-form/numbers/float-input';
export { default as IntegerInput } from './components/inputs/react-hook-form/numbers/integer-input';
export { default as SelectInput } from './components/inputs/react-hook-form/select-inputs/select-input';
export type { SelectInputProps } from './components/inputs/react-hook-form/select-inputs/select-input';
export { default as CheckboxInput } from './components/inputs/react-hook-form/booleans/checkbox-input';
export type { CheckboxInputProps } from './components/inputs/react-hook-form/booleans/checkbox-input';
export { default as SwitchInput } from './components/inputs/react-hook-form/booleans/switch-input';
export type { SwitchInputProps } from './components/inputs/react-hook-form/booleans/switch-input';
export { default as ErrorInput } from './components/inputs/react-hook-form/error-management/error-input';
export type { ErrorInputProps } from './components/inputs/react-hook-form/error-management/error-input';
export { default as FieldErrorAlert } from './components/inputs/react-hook-form/error-management/field-error-alert';
export type { FieldErrorAlertProps } from './components/inputs/react-hook-form/error-management/field-error-alert';
export { default as MidFormError } from './components/inputs/react-hook-form/error-management/mid-form-error';
export type { MidFormErrorProps } from './components/inputs/react-hook-form/error-management/mid-form-error';
export { default as TextFieldWithAdornment } from './components/inputs/react-hook-form/utils/text-field-with-adornment';
export type { TextFieldWithAdornmentProps } from './components/inputs/react-hook-form/utils/text-field-with-adornment';
export { default as FieldLabel } from './components/inputs/react-hook-form/utils/field-label';
export type { FieldLabelProps } from './components/inputs/react-hook-form/utils/field-label';
export { default as SubmitButton } from './components/inputs/react-hook-form/utils/submit-button';
export { default as CancelButton } from './components/inputs/react-hook-form/utils/cancel-button';
export {
    genHelperPreviousValue,
    genHelperError,
    identity,
    isFieldRequired,
    gridItem,
    isFloatNumber,
    toFloatOrNullValue,
} from './components/inputs/react-hook-form/utils/functions';
export { keyGenerator, areArrayElementsUnique, isObjectEmpty } from './utils/functions';
export { default as DirectoryItemsInput } from './components/inputs/react-hook-form/directory-items-input';
export type { DirectoryItemsInputProps } from './components/inputs/react-hook-form/directory-items-input';
export { default as DirectoryItemSelector } from './components/DirectoryItemSelector/directory-item-selector';
export type { DirectoryItemSelectorProps } from './components/DirectoryItemSelector/directory-item-selector';
export { default as CustomAGGrid } from './components/CustomAGGrid/custom-aggrid';
export type { CustomAGGridProps } from './components/CustomAGGrid/custom-aggrid';
export { default as RawReadOnlyInput } from './components/inputs/react-hook-form/raw-read-only-input';
export type { RawReadOnlyInputProps } from './components/inputs/react-hook-form/raw-read-only-input';

export { default as FilterCreationDialog } from './components/filter/filter-creation-dialog';
export type { FilterCreationDialogProps } from './components/filter/filter-creation-dialog';
export { default as ExpertFilterEditionDialog } from './components/filter/expert/expert-filter-edition-dialog';
export type { ExpertFilterEditionDialogProps } from './components/filter/expert/expert-filter-edition-dialog';
export { default as ExplicitNamingFilterEditionDialog } from './components/filter/explicit-naming/explicit-naming-filter-edition-dialog';
export type { ExplicitNamingFilterEditionDialogProps } from './components/filter/explicit-naming/explicit-naming-filter-edition-dialog';
export { default as CriteriaBasedFilterEditionDialog } from './components/filter/criteria-based/criteria-based-filter-edition-dialog';
export type { CriteriaBasedFilterEditionDialogProps } from './components/filter/criteria-based/criteria-based-filter-edition-dialog';
export {
    saveExplicitNamingFilter,
    saveCriteriaBasedFilter,
    saveExpertFilter,
} from './components/filter/utils/filter-api';
export {
    default as RangeInput,
    DEFAULT_RANGE_VALUE,
    getRangeInputDataForm,
    getRangeInputSchema,
} from './components/inputs/react-hook-form/range-input';
export { default as InputWithPopupConfirmation } from './components/inputs/react-hook-form/select-inputs/input-with-popup-confirmation';
export { default as MuiSelectInput } from './components/inputs/react-hook-form/select-inputs/mui-select-input';
export type { MuiSelectInputProps } from './components/inputs/react-hook-form/select-inputs/mui-select-input';
export { default as CountriesInput } from './components/inputs/react-hook-form/select-inputs/countries-input';
export type { CountryInputProps } from './components/inputs/react-hook-form/select-inputs/countries-input';
export { getSystemLanguage, getComputedLanguage, useLocalizedCountries } from './hooks/localized-countries-hook';
export { default as MultipleAutocompleteInput } from './components/inputs/react-hook-form/autocomplete-inputs/multiple-autocomplete-input';
export { default as CsvUploader } from './components/inputs/react-hook-form/ag-grid-table/csv-uploader/csv-uploader';
export type { CsvUploaderProps } from './components/inputs/react-hook-form/ag-grid-table/csv-uploader/csv-uploader';
export { default as UniqueNameInput } from './components/inputs/react-hook-form/unique-name-input';
export type { UniqueNameInputProps } from './components/inputs/react-hook-form/unique-name-input';
export { default as UserManagerMock } from './utils/UserManagerMock';
export { FILTER_EQUIPMENTS, CONTINGENCY_LIST_EQUIPMENTS } from './components/filter/utils/filter-form-utils';
export type { FormEquipment } from './components/filter/utils/filter-form-utils';

export {
    getCriteriaBasedFormData,
    getCriteriaBasedSchema,
} from './components/filter/criteria-based/criteria-based-filter-utils';

export { mergeSx } from './utils/styles';
export { setCommonStore } from './redux/commonStore';
export type { CommonStoreState } from './redux/commonStore';
export type { EquipmentInfos } from './utils/EquipmentType';

export * from './services';
