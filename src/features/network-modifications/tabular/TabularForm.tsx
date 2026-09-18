/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { type FieldValues, type UseFieldArrayReturn, useFormContext, useWatch } from 'react-hook-form';
import { Alert, Button, Grid, Stack } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import type { ParseConfig, ParseResult } from 'papaparse';
import { v4 as uuid4 } from 'uuid';
import {
    AutocompleteInput,
    CsvDownloadButton,
    CsvPicker,
    type CsvProps,
    CustomAgGridTable,
    DefaultCellRenderer,
    InputWithPopupConfirmation,
    NumericEditor,
    suppressNonNumericKeyboardEvent,
} from '../../../components';
import { useSnackMessage, useStateBoolean } from '../../../hooks';
import { fetchStudyMetadata } from '../../../services';
import { EquipmentType, FieldConstants, type GsLang, hasNonEmptyRows, transformIfFrenchNumber } from '../../../utils';
import { AGGRID_LOCALES } from '../../../translations/not-intl/aggrid-locales';
import { DefineTabularPropertiesDialog, type TabularPropertiesFormType, type TabularProperty } from './properties';
import {
    PROPERTY_CSV_COLUMN_PREFIX,
    TABULAR_BOOLEAN,
    TABULAR_ENUM,
    TABULAR_NUMBER,
    TabularFieldConstants,
} from './tabular.constants';
import { TABULAR_CREATION_FIELDS } from './tabularCreation.utils';
import { TABULAR_MODIFICATION_FIELDS } from './tabularModification.utils';
import { type PredefinedEquipmentProperties, type TabularField, TabularModificationType } from './tabular.types';
import {
    generateCommentLines,
    getSelectedTabularPropertyNames,
    isFieldTypeOk,
    sanitizeRowValue,
    setFieldTypeError,
} from './tabular.utils';

/** Context handed over to the host application when it renders its own actions in the form. */
export interface TabularFormActionsContext {
    dialogMode: TabularModificationType;
    equipmentType: EquipmentType;
    csvColumns: string[];
    commentLines: string[][];
    predefinedEquipmentProperties: PredefinedEquipmentProperties;
}

export interface TabularFormProps {
    dialogMode: TabularModificationType;
    dataFetching?: boolean;
    /**
     * Application specific actions rendered next to the CSV template buttons.
     */
    renderActions?: (context: TabularFormActionsContext) => ReactNode;
    /** Display the name of the CSV file the table was imported from. */
    showCsvFileName?: boolean;
}

export function TabularForm({
    dialogMode,
    dataFetching = false,
    renderActions,
    showCsvFileName = true,
}: Readonly<TabularFormProps>) {
    const intl = useIntl();
    const language = intl.locale as GsLang;
    const { snackWarning } = useSnackMessage();
    const [isFetching, setIsFetching] = useState<boolean>(dataFetching);
    const { setValue, clearErrors, setError, getValues } = useFormContext();
    const tableRef = useRef<UseFieldArrayReturn<FieldValues, string>>(null);
    const propertiesDialogOpen = useStateBoolean(false);
    const [predefinedEquipmentProperties, setPredefinedEquipmentProperties] = useState<PredefinedEquipmentProperties>(
        {}
    );

    const getTypeLabel = useCallback((type: string) => intl.formatMessage({ id: type }), [intl]);

    const equipmentType = useWatch({
        name: FieldConstants.TYPE,
    });
    const tabularProperties = useWatch({
        name: TabularFieldConstants.TABULAR_PROPERTIES,
    });
    const watchFileName = useWatch({
        name: TabularFieldConstants.CSV_FILENAME,
    });

    const csvFields = useMemo(() => {
        const fields =
            dialogMode === TabularModificationType.CREATION ? TABULAR_CREATION_FIELDS : TABULAR_MODIFICATION_FIELDS;
        return fields[equipmentType as EquipmentType] ?? [];
    }, [equipmentType, dialogMode]);

    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [fileErrorMessage, setFileErrorMessage] = useState<string | undefined>();
    const [fileWarningMessage, setFileWarningMessage] = useState<string | undefined>();

    const parseConfig = useMemo<Partial<ParseConfig<Record<string, unknown>>>>(
        () => ({
            dynamicTyping: (field: string | number) =>
                // "property_*" (user added property) columns should remain as strings
                typeof field !== 'string' || !field.startsWith(PROPERTY_CSV_COLUMN_PREFIX),
            transform: (value: string, field: string | number) => {
                if (typeof field === 'string' && field.startsWith(PROPERTY_CSV_COLUMN_PREFIX)) {
                    // don't transform property_* columns (user added property), keep them string
                    return value;
                }
                return transformIfFrenchNumber(value, language);
            },
        }),
        [language]
    );

    // Boolean values never raise a blocking error: an invalid one is silently replaced by false
    // (see sanitizeRowValue). When the field is a boolean we only warn the user it was replaced and
    // return true to tell the caller to skip the regular error checks for this cell.
    const handleBooleanValue = useCallback(
        (key: string, value: unknown, fieldDef: TabularField | undefined): boolean => {
            if (fieldDef?.type !== TABULAR_BOOLEAN) {
                return false;
            }
            if (fieldDef.required && typeof value !== 'boolean') {
                setFileWarningMessage(
                    intl.formatMessage({ id: 'WrongBooleanValueWarning' }, { field: intl.formatMessage({ id: key }) })
                );
            }
            return true;
        },
        [intl]
    );

    const handleTabularCreationParsingError = useCallback(
        (results: ParseResult<Record<string, unknown>>) => {
            let requiredFieldNameInError: string = '';
            let requiredDependantFieldNameInError: string = '';
            let dependantFieldNameInError: string = '';
            let fieldTypeInError: string = '';
            let expectedTypeForFieldInError: string = '';
            let expectedValues: string[] | undefined;

            // check if the csv contains an error
            if (
                results.data
                    .flatMap((result) =>
                        Object.entries(result).map(([key, value]): [Record<string, unknown>, string, unknown] => [
                            result,
                            key,
                            value,
                        ])
                    )
                    .some(([result, key, value]) => {
                        const fieldDef = csvFields.find((field) => field.id === key);
                        // boolean fields never raise a blocking error (see handleBooleanValue)
                        if (handleBooleanValue(key, value, fieldDef)) {
                            return false; // keep looking
                        }
                        // check required fields are defined
                        if (fieldDef !== undefined && fieldDef.required && (value === undefined || value === null)) {
                            requiredFieldNameInError = key;
                            return true; // “yes, we found an error here” → break loop
                        }

                        // check requiredIf rule
                        if (fieldDef?.requiredIf) {
                            const dependentValue = result[fieldDef.requiredIf.id];
                            if (
                                dependentValue !== undefined &&
                                dependentValue !== null &&
                                (value === undefined || value === null)
                            ) {
                                dependantFieldNameInError = key;
                                requiredDependantFieldNameInError = fieldDef.requiredIf.id;
                                return true; // “yes, we found an error here” → break loop
                            }
                        }

                        // check the field types
                        if (!isFieldTypeOk(value, fieldDef)) {
                            fieldTypeInError = key;
                            expectedTypeForFieldInError = fieldDef?.type ?? '';
                            expectedValues = fieldDef?.options;
                            return true; // “yes, we found an error here” → break loop
                        }
                        return false; // keep looking
                    })
            ) {
                if (requiredFieldNameInError !== '') {
                    setError(TabularFieldConstants.MODIFICATIONS_TABLE, {
                        type: 'custom',
                        message: intl.formatMessage(
                            { id: 'FieldRequired' },
                            { requiredFieldNameInError: intl.formatMessage({ id: requiredFieldNameInError }) }
                        ),
                    });
                } else if (dependantFieldNameInError !== '' && requiredDependantFieldNameInError !== '') {
                    setError(TabularFieldConstants.MODIFICATIONS_TABLE, {
                        type: 'custom',
                        message: intl.formatMessage(
                            { id: 'DependantFieldMissing' },
                            {
                                requiredField: intl.formatMessage({ id: dependantFieldNameInError }),
                                dependantField: intl.formatMessage({ id: requiredDependantFieldNameInError }),
                            }
                        ),
                    });
                } else if (fieldTypeInError !== '') {
                    setFieldTypeError(
                        intl.formatMessage({ id: fieldTypeInError }),
                        expectedTypeForFieldInError,
                        TabularFieldConstants.MODIFICATIONS_TABLE,
                        setError,
                        intl,
                        expectedValues
                    );
                }
            }

            // For shunt compensators, display a warning message if maxSusceptance is set along with shuntCompensatorType or maxQAtNominalV
            if (
                equipmentType === EquipmentType.SHUNT_COMPENSATOR &&
                results.data.some(
                    (creation) =>
                        creation.maxSusceptance != null &&
                        (creation.shuntCompensatorType || creation.maxQAtNominalV != null)
                )
            ) {
                snackWarning({
                    messageId: 'TabularCreationShuntWarning',
                });
            }
        },
        [csvFields, equipmentType, handleBooleanValue, intl, setError, snackWarning]
    );

    const handleTabularModificationParsingError = useCallback(
        (results: ParseResult<Record<string, unknown>>) => {
            let fieldTypeInError: string = '';
            let expectedTypeForFieldInError: string = '';
            let expectedValues: string[] | undefined;

            // check if the csv contains an error
            if (
                results.data.flatMap(Object.entries).some(([key, value]) => {
                    const fieldDef = csvFields.find((field) => field.id === key);
                    // boolean fields never raise a blocking error (see handleBooleanValue)
                    if (handleBooleanValue(key, value, fieldDef)) {
                        return false; // keep looking
                    }
                    // check the field types
                    if (!isFieldTypeOk(value, fieldDef)) {
                        fieldTypeInError = key;
                        expectedTypeForFieldInError = fieldDef?.type ?? '';
                        expectedValues = fieldDef?.options;
                        return true; // “yes, we found an error here” → break some() loop
                    }
                    return false; // keep looking
                })
            ) {
                setFieldTypeError(
                    intl.formatMessage({ id: fieldTypeInError }),
                    expectedTypeForFieldInError,
                    TabularFieldConstants.MODIFICATIONS_TABLE,
                    setError,
                    intl,
                    expectedValues
                );
            }

            // For shunt compensators, display a warning message if maxSusceptance is modified along with shuntCompensatorType or maxQAtNominalV
            if (
                equipmentType === EquipmentType.SHUNT_COMPENSATOR &&
                results.data.some(
                    (modification) =>
                        modification.maxSusceptance != null &&
                        (modification.shuntCompensatorType || modification.maxQAtNominalV != null)
                )
            ) {
                snackWarning({ messageId: 'TabularModificationShuntWarning' });
            }
        },
        [equipmentType, csvFields, handleBooleanValue, setError, intl, snackWarning]
    );

    const selectedProperties = useMemo(
        (): string[] => getSelectedTabularPropertyNames(tabularProperties),
        [tabularProperties]
    );

    const csvColumns = useMemo((): string[] => {
        return csvFields
            .map((field: TabularField) => field.id)
            .concat(selectedProperties.map((propertyName: string) => PROPERTY_CSV_COLUMN_PREFIX + propertyName));
    }, [csvFields, selectedProperties]);

    const requiredColumns = useMemo(
        () => csvFields.filter((field) => field.required).map((field) => field.id),
        [csvFields]
    );

    const commentLines = useMemo(() => {
        return generateCommentLines({
            fields: csvFields,
            selectedProperties,
            intl,
            equipmentType,
            language,
            formType: dialogMode,
            predefinedEquipmentProperties,
        });
    }, [csvFields, selectedProperties, intl, equipmentType, language, dialogMode, predefinedEquipmentProperties]);

    const getTemplateData = useCallback(() => [csvColumns, ...commentLines], [csvColumns, commentLines]);

    const getTableData = useCallback(() => {
        const rows = (getValues(TabularFieldConstants.MODIFICATIONS_TABLE) ?? []) as Record<string, unknown>[];
        return [...getTemplateData(), ...rows.map((row) => csvColumns.map((col) => row[col] ?? ''))];
    }, [csvColumns, getValues, getTemplateData]);

    const csvProps = useMemo<CsvProps>(
        () => ({
            fileName: `${equipmentType}${
                dialogMode === TabularModificationType.CREATION ? '_creation' : '_modification'
            }_template`,
            language,
            getTableData,
        }),
        [equipmentType, dialogMode, language, getTableData]
    );

    const getDataFromCsvFile = useCallback(
        (results: ParseResult<Record<string, unknown>>, file: File) => {
            clearErrors(TabularFieldConstants.MODIFICATIONS_TABLE);
            setFileWarningMessage(undefined);
            if (dialogMode === TabularModificationType.CREATION) {
                handleTabularCreationParsingError(results);
            } else {
                handleTabularModificationParsingError(results);
            }
            setValue(TabularFieldConstants.CSV_FILENAME, file.name);
            // sanitize each cell: drop wrong-format values (kept out of the table) and default
            // mandatory boolean checkboxes to false, so invalid data is never injected.
            return results.data.map((row) => {
                const sanitizedRow: Record<string, unknown> = {
                    [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
                };
                Object.entries(row).forEach(([key, value]) => {
                    sanitizedRow[key] = sanitizeRowValue(
                        value,
                        csvFields.find((field) => field.id === key)
                    );
                });
                return sanitizedRow;
            });
        },
        [
            clearErrors,
            csvFields,
            dialogMode,
            handleTabularCreationParsingError,
            handleTabularModificationParsingError,
            setValue,
        ]
    );

    useEffect(() => {
        fetchStudyMetadata().then((studyMetadata) => {
            setPredefinedEquipmentProperties(studyMetadata?.predefinedEquipmentProperties ?? {});
        });
    }, []);

    useEffect(() => {
        if (!showCsvFileName) {
            return;
        }
        setSelectedFile(watchFileName ? new File([], watchFileName) : undefined);
    }, [watchFileName, showCsvFileName]);

    useEffect(() => {
        setIsFetching(dataFetching);
    }, [dataFetching]);

    const typesOptions = useMemo(() => {
        return Object.keys(
            dialogMode === TabularModificationType.CREATION ? TABULAR_CREATION_FIELDS : TABULAR_MODIFICATION_FIELDS
        );
    }, [dialogMode]);

    const resetOnTypeChange = useCallback(() => {
        setValue(TabularFieldConstants.CSV_FILENAME, undefined);
        setValue(TabularFieldConstants.TABULAR_PROPERTIES, []);
        setSelectedFile(undefined);
        setFileErrorMessage(undefined);
        setFileWarningMessage(undefined);
        clearErrors(TabularFieldConstants.MODIFICATIONS_TABLE);
        tableRef.current?.replace([]);
    }, [clearErrors, setValue]);

    const equipmentTypeField = (
        <InputWithPopupConfirmation
            Input={AutocompleteInput}
            name={FieldConstants.TYPE}
            label="Type"
            options={typesOptions}
            getOptionLabel={(option: string) => getTypeLabel(option)}
            size="small"
            formProps={{ variant: 'outlined' }}
            shouldOpenPopup={() => hasNonEmptyRows(getValues(TabularFieldConstants.MODIFICATIONS_TABLE))}
            onValueChange={resetOnTypeChange}
            message="changeTypeMessage"
            validateButtonLabel="button.changeType"
        />
    );

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            resizable: false,
            lockPinned: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            cellRenderer: DefaultCellRenderer,
        }),
        []
    );

    const columnDefs = useMemo(() => {
        return csvFields
            .map((field) => {
                const columnDef: ColDef = {
                    field: field.id,
                    headerName: intl.formatMessage({ id: field.id }) + (field.required ? ' (*)' : ''),
                    editable: true,
                    singleClickEdit: true,
                };
                if (field.id === TabularFieldConstants.EQUIPMENT_ID) {
                    columnDef.pinned = true;
                }
                // Force the cell data type from the field definition instead of relying on AG Grid's
                // type inference from the data: inference is per-column and based on the cell values,
                // so a CSV providing unexpected values (e.g. 0/1 in a boolean column) would mistype the
                // whole column (numbers/text instead of checkboxes, and vice versa).
                switch (field.type) {
                    case TABULAR_BOOLEAN:
                        columnDef.cellDataType = TABULAR_BOOLEAN;
                        break;
                    case TABULAR_NUMBER:
                        columnDef.cellDataType = TABULAR_NUMBER;
                        columnDef.cellEditor = NumericEditor;
                        columnDef.cellEditorParams = { allowNegativeValues: true };
                        columnDef.suppressKeyboardEvent = suppressNonNumericKeyboardEvent;
                        break;
                    case TABULAR_ENUM:
                        columnDef.cellDataType = 'text';
                        columnDef.cellEditor = 'agSelectCellEditor';
                        columnDef.cellEditorParams = { values: [null, ...(field.options ?? [])] };
                        break;
                    default:
                        break;
                }
                return columnDef;
            })
            .concat(
                selectedProperties.map((propertyName: string) => ({
                    field: PROPERTY_CSV_COLUMN_PREFIX + propertyName,
                    headerName: propertyName,
                    // property values are always kept as strings (see parseConfig)
                    cellDataType: 'text',
                    editable: true,
                    singleClickEdit: true,
                }))
            );
    }, [csvFields, selectedProperties, intl]);

    const makeDefaultRowData = useCallback(() => {
        const row: Record<string, any> = { [FieldConstants.AG_GRID_ROW_UUID]: uuid4() };
        csvFields.forEach((field) => {
            row[field.id] = null;
        });
        selectedProperties.forEach((propertyName) => {
            row[PROPERTY_CSV_COLUMN_PREFIX + propertyName] = null;
        });
        return row;
    }, [csvFields, selectedProperties]);

    const onPropertiesChange = (formData: TabularPropertiesFormType) => {
        const newSelectedProperties = getSelectedTabularPropertyNames(
            formData[TabularFieldConstants.TABULAR_PROPERTIES] as TabularProperty[]
        );
        if (newSelectedProperties.toString() !== selectedProperties.toString()) {
            // sync property columns on existing rows without discarding their data
            clearErrors(TabularFieldConstants.MODIFICATIONS_TABLE);
            const removedPropertyColumns = selectedProperties
                .filter((name) => !newSelectedProperties.includes(name))
                .map((name) => PROPERTY_CSV_COLUMN_PREFIX + name);
            const addedPropertyColumns = newSelectedProperties
                .filter((name) => !selectedProperties.includes(name))
                .map((name) => PROPERTY_CSV_COLUMN_PREFIX + name);
            const currentRows = (getValues(TabularFieldConstants.MODIFICATIONS_TABLE) ?? []) as Record<
                string,
                unknown
            >[];
            const updatedRows = currentRows.map((row) => {
                const newRow = { ...row };
                removedPropertyColumns.forEach((col) => {
                    delete newRow[col];
                });
                addedPropertyColumns.forEach((col) => {
                    newRow[col] = null;
                });
                return newRow;
            });
            tableRef.current?.replace(updatedRows);
        }
        setValue(TabularFieldConstants.TABULAR_PROPERTIES, formData[TabularFieldConstants.TABULAR_PROPERTIES], {
            shouldDirty: true,
        });
    };

    return (
        <Stack spacing={2} paddingTop={1} sx={{ height: '100%' }}>
            <Grid sx={{ width: 400, maxWidth: '100%' }}>{equipmentTypeField}</Grid>
            {equipmentType && (
                <>
                    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                        <Grid container alignItems="center">
                            <Grid>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        propertiesDialogOpen.setTrue();
                                    }}
                                >
                                    <FormattedMessage id="DefinePropertiesButton" />
                                </Button>
                            </Grid>
                            <Grid>
                                <CsvDownloadButton
                                    data={getTemplateData}
                                    fileName={csvProps.fileName}
                                    language={language}
                                    labelId="GenerateCSV"
                                    variant="contained"
                                />
                            </Grid>
                            {renderActions?.({
                                dialogMode,
                                equipmentType,
                                csvColumns,
                                commentLines,
                                predefinedEquipmentProperties,
                            })}
                        </Grid>
                        <Grid sx={{ flex: 1, minWidth: 0 }}>
                            <CsvPicker<Record<string, unknown>>
                                label="UploadCSV"
                                requiredColumns={requiredColumns}
                                language={language}
                                parseConfig={parseConfig}
                                selectedFile={showCsvFileName ? selectedFile : undefined}
                                onFileChange={setSelectedFile}
                                onFileError={setFileErrorMessage}
                                getTableData={() => getValues(TabularFieldConstants.MODIFICATIONS_TABLE)}
                                onReplace={(results, file) =>
                                    tableRef.current?.replace(getDataFromCsvFile(results, file))
                                }
                                onAppend={(results, file) =>
                                    tableRef.current?.append(getDataFromCsvFile(results, file))
                                }
                            />
                        </Grid>
                    </Grid>
                    {fileErrorMessage && (
                        <Grid>
                            <Alert severity="error">{fileErrorMessage}</Alert>
                        </Grid>
                    )}
                    {fileWarningMessage && (
                        <Grid>
                            <Alert severity="warning">{fileWarningMessage}</Alert>
                        </Grid>
                    )}
                    <Grid sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        <CustomAgGridTable
                            ref={tableRef}
                            name={TabularFieldConstants.MODIFICATIONS_TABLE}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            makeDefaultRowData={makeDefaultRowData}
                            loading={isFetching}
                            pagination
                            rowSelection={{
                                mode: 'multiRow',
                            }}
                            overrideLocales={AGGRID_LOCALES}
                            csvProps={csvProps}
                        />
                    </Grid>
                </>
            )}
            <DefineTabularPropertiesDialog
                open={propertiesDialogOpen}
                equipmentType={equipmentType}
                currentProperties={tabularProperties}
                predefinedEquipmentProperties={predefinedEquipmentProperties}
                onValidate={onPropertiesChange}
            />
        </Stack>
    );
}
