/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export { TreeViewFinder } from './components/treeViewFinder';
export type { TreeViewFinderProps, TreeViewFinderNodeProps } from './components/treeViewFinder';
export { TopBar } from './components/topBar';
export type { TopBarProps } from './components/topBar';
export { default as AboutDialog } from './components/topBar/AboutDialog';
export type { AboutDialogProps, GridSuiteModule } from './components/topBar/AboutDialog';
export { default as SnackbarProvider } from './components/snackbarProvider';
export * from './components/authentication';
export {
    MuiVirtualizedTable,
    KeyedColumnsRowIndexer,
    ChangeWays,
    DEFAULT_CELL_PADDING,
    DEFAULT_HEADER_HEIGHT,
    DEFAULT_ROW_HEIGHT,
} from './components/muiVirtualizedTable';
export type { MuiVirtualizedTableProps, CustomColumnProps, RowProps } from './components/muiVirtualizedTable';
export { default as OverflowableText } from './components/overflowableText';
export type { OverflowableTextProps } from './components/overflowableText';
export { ElementSearchDialog } from './components/elementSearch';
export type { ElementSearchDialogProps } from './components/elementSearch';
export { default as FlatParameters } from './components/flatParameters';
export { default as CheckboxList } from './components/checkBoxList/CheckBoxList';
export type { FlatParametersProps, Parameter } from './components/flatParameters';
export { default as ExpandableGroup } from './components/expandableGroup';
export type { ExpandableGroupProps } from './components/expandableGroup';
export { default as MultipleSelectionDialog } from './components/multipleSelectionDialog';
export type { MultipleSelectionDialogProps } from './components/multipleSelectionDialog';
export { default as CustomMuiDialog } from './components/dialogs/customMuiDialog/CustomMuiDialog';
export type { CustomMuiDialogProps } from './components/dialogs/customMuiDialog/CustomMuiDialog';
export { default as DescriptionModificationDialog } from './components/dialogs/descriptionModificationDialog/DescriptionModificationDialog';
export type { DescriptionModificationDialogProps } from './components/dialogs/descriptionModificationDialog/DescriptionModificationDialog';
export { default as DescriptionField } from './components/inputs/reactHookForm/text/DescriptionField';
export { default as ModifyElementSelection } from './components/dialogs/modifyElementSelection/ModifyElementSelection';
export type { ModifyElementSelectionProps } from './components/dialogs/modifyElementSelection/ModifyElementSelection';
export { default as CriteriaBasedForm } from './components/filter/criteriaBased/CriteriaBasedForm';
export type { CriteriaBasedFormProps } from './components/filter/criteriaBased/CriteriaBasedForm';
export { default as PopupConfirmationDialog } from './components/dialogs/popupConfirmationDialog/PopupConfirmationDialog';
export type { PopupConfirmationDialogProps } from './components/dialogs/popupConfirmationDialog/PopupConfirmationDialog';
export { default as BottomRightButtons } from './components/inputs/reactHookForm/agGridTable/BottomRightButtons';
export type { BottomRightButtonsProps } from './components/inputs/reactHookForm/agGridTable/BottomRightButtons';
export { default as CustomAgGridTable } from './components/inputs/reactHookForm/agGridTable/CustomAgGridTable';
export type { CustomAgGridTableProps } from './components/inputs/reactHookForm/agGridTable/CustomAgGridTable';
export { ROW_DRAGGING_SELECTION_COLUMN_DEF } from './components/inputs/reactHookForm/agGridTable/CustomAgGridTable';
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
} from './utils/types/equipmentTypes';

export { default as FieldConstants } from './utils/constants/fieldConstants';

export { fields as EXPERT_FILTER_FIELDS } from './components/filter/expert/expertFilterConstants';
export { default as CustomReactQueryBuilder } from './components/inputs/reactQueryBuilder/CustomReactQueryBuilder';
export type { CustomReactQueryBuilderProps } from './components/inputs/reactQueryBuilder/CustomReactQueryBuilder';
export {
    EXPERT_FILTER_QUERY,
    rqbQuerySchemaValidator,
    getExpertFilterEmptyFormData,
} from './components/filter/expert/ExpertFilterForm';
export { importExpertRules, exportExpertRules } from './components/filter/expert/expertFilterUtils';
export type { RuleTypeExport, RuleGroupTypeExport } from './components/filter/expert/expertFilter.type';
export { formatQuery } from 'react-querybuilder';

export { default as yup } from './utils/yupConfig';

export {
    GRIDSUITE_DEFAULT_PRECISION,
    roundToPrecision,
    roundToDefaultPrecision,
    isBlankOrEmpty,
    unitToMicroUnit,
    microUnitToUnit,
} from './utils/conversionUtils';

export { ElementType } from './utils/types/elementType';
export type { ElementAttributes, Option } from './utils/types/types';

export {
    EQUIPMENT_TYPE,
    EquipmentType,
    getEquipmentsInfosForSearchBar,
    equipmentStyles,
} from './utils/types/equipmentType';

export type { Identifiable, Equipment, EquipmentInfos } from './utils/types/equipmentType';

export { default as getFileIcon } from './utils/mapper/elementIcon';

export { DARK_THEME, LIGHT_THEME, LANG_SYSTEM, LANG_ENGLISH, LANG_FRENCH } from './components/topBar/TopBar';
export type { GsLang, GsLangUser, GsTheme } from './components/topBar/TopBar';

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
} from './redux/actions/authActions';
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
} from './redux/actions/authActions';
export { default as report_viewer_en } from './translations/en/reportViewerEn';
export { default as report_viewer_fr } from './translations/fr/reportViewerFr';
export { default as login_en } from './translations/en/loginEn';
export { default as login_fr } from './translations/fr/loginFr';
export { default as top_bar_en } from './translations/en/topBarEn';
export { default as top_bar_fr } from './translations/fr/topBarFr';
export { default as table_en } from './translations/en/tableEn';
export { default as table_fr } from './translations/fr/tableFr';
export { default as treeview_finder_en } from './translations/en/treeviewFinderEn';
export { default as treeview_finder_fr } from './translations/fr/treeviewFinderFr';
export { default as element_search_en } from './translations/en/elementSearchEn';
export { default as element_search_fr } from './translations/fr/elementSearchFr';
export { default as equipment_search_en } from './translations/en/equipmentSearchEn';
export { default as equipment_search_fr } from './translations/fr/equipmentSearchFr';
export { default as filter_en } from './translations/en/filterEn';
export { default as filter_fr } from './translations/fr/filterFr';
export { default as filter_expert_en } from './translations/en/filterExpertEn';
export { default as filter_expert_fr } from './translations/fr/filterExpertFr';
export { default as description_fr } from './translations/fr/descriptionFr';
export { default as description_en } from './translations/en/descriptionEn';
export { default as equipments_fr } from './translations/fr/equipmentsFr';
export { default as equipments_en } from './translations/en/equipmentsEn';
export { default as csv_fr } from './translations/fr/csvFr';
export { default as csv_en } from './translations/en/csvEn';
export { default as card_error_boundary_en } from './translations/en/cardErrorBoundaryEn';
export { default as card_error_boundary_fr } from './translations/fr/cardErrorBoundaryFr';
export { default as flat_parameters_en } from './translations/en/flatParametersEn';
export { default as flat_parameters_fr } from './translations/fr/flatParametersFr';
export { default as multiple_selection_dialog_en } from './translations/en/multipleSelectionDialogEn';
export { default as multiple_selection_dialog_fr } from './translations/fr/multipleSelectionDialogFr';
export { default as common_button_en } from './translations/en/commonButtonEn';
export { default as common_button_fr } from './translations/fr/commonButtonFr';
export { default as directory_items_input_en } from './translations/en/directoryItemsInputEn';
export { default as directory_items_input_fr } from './translations/fr/directoryItemsInputFr';

export { TagRenderer, ElementSearchInput, useElementSearch } from './components/elementSearch';
export type { Paginated, TagRendererProps } from './components/elementSearch';
export { EquipmentItem } from './components/elementSearch/elementItem/EquipmentItem';
export type { EquipmentItemProps } from './components/elementSearch/elementItem/EquipmentItem';
export { default as CardErrorBoundary } from './components/cardErrorBoundary';
export { default as useIntlRef } from './hooks/useIntlRef';
export { useSnackMessage } from './hooks/useSnackMessage';
export type { UseSnackMessageReturn } from './hooks/useSnackMessage';
export { default as useDebounce } from './hooks/useDebounce';
export { default as usePrevious } from './hooks/usePrevious';
export { default as useConfidentialityWarning } from './hooks/useConfidentialityWarning';
export { default as usePredefinedProperties } from './hooks/usePredefinedProperties';
export { default as useStateBoolean } from './hooks/customStates/useStateBoolean';
export type { UseStateBooleanReturn } from './hooks/customStates/useStateBoolean';
export { default as useStateNumber } from './hooks/customStates/useStateNumber';
export type { UseStateNumberReturn } from './hooks/customStates/useStateNumber';
export { default as SelectClearable } from './components/inputs/SelectClearable';
export type { SelectClearableProps } from './components/inputs/SelectClearable';
export { default as useCustomFormContext } from './components/inputs/reactHookForm/provider/useCustomFormContext';
export { default as CustomFormProvider } from './components/inputs/reactHookForm/provider/CustomFormProvider';
export type { MergedFormContextProps } from './components/inputs/reactHookForm/provider/CustomFormProvider';
export { default as AutocompleteInput } from './components/inputs/reactHookForm/autocompleteInputs/AutocompleteInput';
export type { AutocompleteInputProps } from './components/inputs/reactHookForm/autocompleteInputs/AutocompleteInput';
export { default as TextInput } from './components/inputs/reactHookForm/text/TextInput';
export type { TextInputProps } from './components/inputs/reactHookForm/text/TextInput';
export { default as ExpandingTextField } from './components/inputs/reactHookForm/text/ExpandingTextField';
export type { ExpandingTextFieldProps } from './components/inputs/reactHookForm/text/ExpandingTextField';
export { default as RadioInput } from './components/inputs/reactHookForm/booleans/RadioInput';
export type { RadioInputProps } from './components/inputs/reactHookForm/booleans/RadioInput';
export { default as SliderInput } from './components/inputs/reactHookForm/numbers/SliderInput';
export type { SliderInputProps } from './components/inputs/reactHookForm/numbers/SliderInput';
export { default as FloatInput } from './components/inputs/reactHookForm/numbers/FloatInput';
export type { FloatInputProps } from './components/inputs/reactHookForm/numbers/FloatInput';
export { default as IntegerInput } from './components/inputs/reactHookForm/numbers/IntegerInput';
export { default as SelectInput } from './components/inputs/reactHookForm/selectInputs/SelectInput';
export type { SelectInputProps } from './components/inputs/reactHookForm/selectInputs/SelectInput';
export { default as CheckboxInput } from './components/inputs/reactHookForm/booleans/CheckboxInput';
export type { CheckboxInputProps } from './components/inputs/reactHookForm/booleans/CheckboxInput';
export { default as SwitchInput } from './components/inputs/reactHookForm/booleans/SwitchInput';
export type { SwitchInputProps } from './components/inputs/reactHookForm/booleans/SwitchInput';
export { default as ErrorInput } from './components/inputs/reactHookForm/errorManagement/ErrorInput';
export type { ErrorInputProps } from './components/inputs/reactHookForm/errorManagement/ErrorInput';
export { default as FieldErrorAlert } from './components/inputs/reactHookForm/errorManagement/FieldErrorAlert';
export type { FieldErrorAlertProps } from './components/inputs/reactHookForm/errorManagement/FieldErrorAlert';
export { default as MidFormError } from './components/inputs/reactHookForm/errorManagement/MidFormError';
export type { MidFormErrorProps } from './components/inputs/reactHookForm/errorManagement/MidFormError';
export { default as TextFieldWithAdornment } from './components/inputs/reactHookForm/utils/TextFieldWithAdornment';
export type { TextFieldWithAdornmentProps } from './components/inputs/reactHookForm/utils/TextFieldWithAdornment';
export { default as FieldLabel } from './components/inputs/reactHookForm/utils/FieldLabel';
export type { FieldLabelProps } from './components/inputs/reactHookForm/utils/FieldLabel';
export { default as SubmitButton } from './components/inputs/reactHookForm/utils/SubmitButton';
export { default as CancelButton } from './components/inputs/reactHookForm/utils/CancelButton';
export {
    genHelperPreviousValue,
    genHelperError,
    identity,
    isFieldRequired,
    gridItem,
    isFloatNumber,
    toFloatOrNullValue,
} from './components/inputs/reactHookForm/utils/functions';
export { keyGenerator, areArrayElementsUnique, isObjectEmpty } from './utils/functions';
export { default as DirectoryItemsInput } from './components/inputs/reactHookForm/DirectoryItemsInput';
export type { DirectoryItemsInputProps } from './components/inputs/reactHookForm/DirectoryItemsInput';
export { default as DirectoryItemSelector } from './components/directoryItemSelector/DirectoryItemSelector';
export type { DirectoryItemSelectorProps } from './components/directoryItemSelector/DirectoryItemSelector';
export { default as CustomAGGrid } from './components/customAGGrid/customAggrid';
export type { CustomAGGridProps } from './components/customAGGrid/customAggrid';
export { default as RawReadOnlyInput } from './components/inputs/reactHookForm/RawReadOnlyInput';
export type { RawReadOnlyInputProps } from './components/inputs/reactHookForm/RawReadOnlyInput';

export { default as FilterCreationDialog } from './components/filter/FilterCreationDialog';
export type { FilterCreationDialogProps } from './components/filter/FilterCreationDialog';
export { default as ExpertFilterEditionDialog } from './components/filter/expert/ExpertFilterEditionDialog';
export type { ExpertFilterEditionDialogProps } from './components/filter/expert/ExpertFilterEditionDialog';
export { default as ExplicitNamingFilterEditionDialog } from './components/filter/explicitNaming/ExplicitNamingFilterEditionDialog';
export type { ExplicitNamingFilterEditionDialogProps } from './components/filter/explicitNaming/ExplicitNamingFilterEditionDialog';
export { default as CriteriaBasedFilterEditionDialog } from './components/filter/criteriaBased/CriteriaBasedFilterEditionDialog';
export type { CriteriaBasedFilterEditionDialogProps } from './components/filter/criteriaBased/CriteriaBasedFilterEditionDialog';
export {
    saveExplicitNamingFilter,
    saveCriteriaBasedFilter,
    saveExpertFilter,
} from './components/filter/utils/filterApi';
export {
    default as RangeInput,
    DEFAULT_RANGE_VALUE,
    getRangeInputDataForm,
    getRangeInputSchema,
} from './components/inputs/reactHookForm/numbers/RangeInput';
export { default as InputWithPopupConfirmation } from './components/inputs/reactHookForm/selectInputs/InputWithPopupConfirmation';
export { default as MuiSelectInput } from './components/inputs/reactHookForm/selectInputs/MuiSelectInput';
export type { MuiSelectInputProps } from './components/inputs/reactHookForm/selectInputs/MuiSelectInput';
export { default as CountriesInput } from './components/inputs/reactHookForm/selectInputs/CountriesInput';
export type { CountryInputProps } from './components/inputs/reactHookForm/selectInputs/CountriesInput';
export { getSystemLanguage, getComputedLanguage, useLocalizedCountries } from './hooks/useLocalizedCountries';
export { default as MultipleAutocompleteInput } from './components/inputs/reactHookForm/autocompleteInputs/MultipleAutocompleteInput';
export { default as CsvUploader } from './components/inputs/reactHookForm/agGridTable/csvUploader/CsvUploader';
export type { CsvUploaderProps } from './components/inputs/reactHookForm/agGridTable/csvUploader/CsvUploader';
export { default as UniqueNameInput } from './components/inputs/reactHookForm/text/UniqueNameInput';
export type { UniqueNameInputProps } from './components/inputs/reactHookForm/text/UniqueNameInput';
export { FILTER_EQUIPMENTS, CONTINGENCY_LIST_EQUIPMENTS } from './components/filter/utils/filterFormUtils';
export type { FormEquipment } from './components/filter/utils/filterFormUtils';

export {
    getCriteriaBasedFormData,
    getCriteriaBasedSchema,
} from './components/filter/criteriaBased/criteriaBasedFilterUtils';

export { mergeSx } from './utils/styles';
export { setCommonStore } from './redux/commonStore';
export type { CommonStoreState } from './redux/commonStore';

export * from './services';
