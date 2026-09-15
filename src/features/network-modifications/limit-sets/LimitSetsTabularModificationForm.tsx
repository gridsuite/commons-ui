/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { type FieldValues, useFormContext, type UseFieldArrayReturn, useWatch } from 'react-hook-form';
import { Alert, Grid, Stack } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import type { ParseConfig, ParseResult } from 'papaparse';
import { v4 as uuid4 } from 'uuid';
import {
    AutocompleteInput,
    BooleanNullableCellRenderer,
    CsvDownloadButton,
    CsvPicker,
    type CsvProps,
    CustomAgGridTable,
    DefaultCellRenderer,
    InputWithPopupConfirmation,
    IntegerInput,
} from '../../../components';
import { FieldConstants, getCsvDelimiter, type GsLang, hasNonEmptyRows, transformIfFrenchNumber } from '../../../utils';
import { AGGRID_LOCALES } from '../../../translations/not-intl/aggrid-locales';
import { TABULAR_BOOLEAN, TabularFieldConstants } from '../tabular/tabular.constants';
import type { TabularField } from '../tabular/tabular.types';
import { isFieldTypeOk, setFieldTypeError } from '../tabular/tabular.utils';
import {
    LIMIT_SETS_TABULAR_MODIFICATION_EQUIPMENT_TYPES,
    LIMIT_SETS_TABULAR_MODIFICATION_FIXED_FIELDS,
    LIMIT_SETS_TABULAR_MODIFICATION_REPEATABLE_FIELDS,
} from './limitSetsTabular.constants';

export interface LimitSetsTabularModificationFormProps {
    dataFetching?: boolean;
}

export function LimitSetsTabularModificationForm({
    dataFetching = false,
}: Readonly<LimitSetsTabularModificationFormProps>) {
    const intl = useIntl();
    const language = intl.locale as GsLang;
    const [isFetching, setIsFetching] = useState<boolean>(dataFetching);
    const [repeatableColumns, setRepeatableColumns] = useState<TabularField[]>([]);
    const tableRef = useRef<UseFieldArrayReturn<FieldValues, string>>(null);

    const { setValue, clearErrors, getValues, setError, trigger } = useFormContext();

    const getTypeLabel = useCallback((type: string) => intl.formatMessage({ id: type }), [intl]);

    const csvColumns = useMemo<TabularField[]>(
        () => [...LIMIT_SETS_TABULAR_MODIFICATION_FIXED_FIELDS, ...repeatableColumns],
        [repeatableColumns]
    );

    const requiredColumns = useMemo(
        () => csvColumns.filter((column) => column.required).map((column) => column.id),
        [csvColumns]
    );

    const amountTemporaryLimits = useWatch({
        name: FieldConstants.AMOUNT_TEMPORARY_LIMITS,
    });
    const equipmentType = useWatch({
        name: FieldConstants.TYPE,
    });

    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [fileErrorMessage, setFileErrorMessage] = useState<string | undefined>();

    const parseConfig = useMemo<Partial<ParseConfig<Record<string, unknown>>>>(
        () => ({
            dynamicTyping: true,
            transformHeader: (header) => {
                // transform header to modification field
                const transformedHeader = LIMIT_SETS_TABULAR_MODIFICATION_FIXED_FIELDS.find(
                    (field) => intl.formatMessage({ id: field.id }) === header
                )?.id;
                return transformedHeader ?? header;
            },
            transform: (value) => transformIfFrenchNumber(value, language),
        }),
        [intl, language]
    );

    const getDataFromCsvFile = useCallback(
        (results: ParseResult<Record<string, unknown>>, file: File) => {
            clearErrors(TabularFieldConstants.MODIFICATIONS_TABLE);
            let requiredFieldNameInError: string = '';
            let fieldTypeInError: string = '';
            let expectedTypeForFieldInError: string = '';
            let expectedValues: string[] | undefined;

            let keyLabel: string = '';
            // check if the csv contains an error
            if (
                results.data
                    .flatMap((result) => Object.entries(result))
                    .some(([key, value]) => {
                        // Detection of repeatable fields
                        const fieldDef = csvColumns?.find(
                            (field) =>
                                field.id === key ||
                                (LIMIT_SETS_TABULAR_MODIFICATION_REPEATABLE_FIELDS.includes(field) &&
                                    key.startsWith(field.id))
                        );
                        if (fieldDef === undefined) {
                            return false; // unknown column (e.g. beyond the temporary limits count): nothing to check
                        }
                        keyLabel = `${intl.formatMessage({ id: fieldDef.name ?? fieldDef.id })}${fieldDef.index ? ` ${fieldDef.index}` : ''}`;

                        // check required fields are defined
                        if (fieldDef.required && (value === undefined || value === null)) {
                            requiredFieldNameInError = keyLabel;
                            return true; // “yes, we found an error here” → break loop
                        }

                        // check the field types
                        if (!isFieldTypeOk(value, fieldDef)) {
                            fieldTypeInError = keyLabel;
                            expectedTypeForFieldInError = fieldDef.type ?? '';
                            expectedValues = fieldDef.options;
                            return true; // “yes, we found an error here” → break loop
                        }
                        return false; // keep looking
                    })
            ) {
                if (requiredFieldNameInError !== '') {
                    setError(TabularFieldConstants.MODIFICATIONS_TABLE, {
                        type: 'custom',
                        message: intl.formatMessage({ id: 'FieldRequired' }, { requiredFieldNameInError: keyLabel }),
                    });
                }
                setFieldTypeError(
                    fieldTypeInError,
                    expectedTypeForFieldInError,
                    TabularFieldConstants.MODIFICATIONS_TABLE,
                    setError,
                    intl,
                    expectedValues
                );
            }

            setValue(TabularFieldConstants.CSV_FILENAME, file.name);
            return results.data.map((row) => ({
                [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
                ...row,
            }));
        },
        [clearErrors, csvColumns, intl, setError, setValue]
    );

    const computeRepeatableColumns = useCallback(() => {
        const columns: TabularField[] = [];
        trigger(FieldConstants.AMOUNT_TEMPORARY_LIMITS).then((valid) => {
            if (valid) {
                for (let i = 1; i <= amountTemporaryLimits; i++) {
                    LIMIT_SETS_TABULAR_MODIFICATION_REPEATABLE_FIELDS.forEach((field) =>
                        columns.push({
                            ...field,
                            id: field.id + i,
                            name: field.id,
                            index: i,
                        })
                    );
                }
                setRepeatableColumns(columns);
            }
        });
    }, [amountTemporaryLimits, trigger]);

    const csvTranslatedColumns = useMemo(
        () =>
            csvColumns.map(
                ({ id, name, index }) => `${intl.formatMessage({ id: name ?? id })}${index ? ` ${index}` : ''}`
            ),
        [csvColumns, intl]
    );

    const commentLines = useMemo(() => {
        const commentKey = 'TabularLimitSetsModificationSkeletonComment';
        const separator = getCsvDelimiter(language);
        const commentData: string[][] = [];
        if (csvTranslatedColumns) {
            commentData.push(csvTranslatedColumns.map((column, index) => (index === 0 ? `#${column}` : column)));
            if (intl.messages[commentKey]) {
                commentData.push(intl.formatMessage({ id: commentKey }).split(separator));
            }
        }
        return commentData;
    }, [intl, csvTranslatedColumns, language]);

    const resetOnTypeChange = useCallback(() => {
        setValue(TabularFieldConstants.CSV_FILENAME, undefined);
        setSelectedFile(undefined);
        setFileErrorMessage(undefined);
        clearErrors(TabularFieldConstants.MODIFICATIONS_TABLE);
        tableRef.current?.replace([]);
    }, [clearErrors, setValue]);

    const csvFilename = getValues(TabularFieldConstants.CSV_FILENAME);

    useEffect(() => {
        computeRepeatableColumns();
    }, [computeRepeatableColumns]);

    useEffect(() => {
        setSelectedFile(csvFilename ? new File([], csvFilename) : undefined);
    }, [csvFilename]);

    useEffect(() => {
        setIsFetching(dataFetching);
    }, [dataFetching]);

    const equipmentTypeField = (
        <InputWithPopupConfirmation
            Input={AutocompleteInput}
            name={FieldConstants.TYPE}
            label="Type"
            options={LIMIT_SETS_TABULAR_MODIFICATION_EQUIPMENT_TYPES}
            getOptionLabel={(option: string) => getTypeLabel(option)}
            size="small"
            formProps={{ variant: 'outlined' }}
            shouldOpenPopup={() => hasNonEmptyRows(getValues(TabularFieldConstants.MODIFICATIONS_TABLE))}
            onValueChange={resetOnTypeChange}
            message="changeTypeMessage"
            validateButtonLabel="button.changeType"
        />
    );

    const columnDefs = useMemo<ColDef[]>(
        () =>
            csvColumns.map(({ id, name, type, index }) => ({
                field: id,
                pinned: id === TabularFieldConstants.EQUIPMENT_ID ? true : undefined,
                headerName: `${intl.formatMessage({ id: name ?? id })} ${index ?? ''}`,
                cellRenderer: type === TABULAR_BOOLEAN ? BooleanNullableCellRenderer : DefaultCellRenderer,
            })),
        [csvColumns, intl]
    );

    const limitSetModificationsDefaultColDef = useMemo(
        () => ({
            lockPinned: true,
            resizable: false,
            wrapHeaderText: true,
            sortable: true,
            autoHeaderHeight: true,
            cellRenderer: DefaultCellRenderer,
        }),
        []
    );

    const makeDefaultRowData = useCallback(
        () => ({
            [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
            ...Object.fromEntries(csvColumns.map((column) => [column.id, null])),
        }),
        [csvColumns]
    );

    const getTemplateData = useCallback(
        () => [csvColumns.map((column) => column.id), ...commentLines],
        [csvColumns, commentLines]
    );

    const getTableData = useCallback(() => {
        const headers = csvColumns.map((column) => column.id);
        const rows = (getValues(TabularFieldConstants.MODIFICATIONS_TABLE) ?? []) as Record<string, unknown>[];
        return [...getTemplateData(), ...rows.map((row) => headers.map((id) => row[id] ?? ''))];
    }, [csvColumns, getValues, getTemplateData]);

    const csvProps = useMemo<CsvProps>(
        () => ({
            fileName: 'limitset_modification_template',
            language,
            getTableData,
        }),
        [language, getTableData]
    );

    return (
        <Stack spacing={2} paddingTop={1} sx={{ height: '100%' }}>
            <Grid sx={{ width: 400, maxWidth: '100%' }}>{equipmentTypeField}</Grid>
            {equipmentType && (
                <>
                    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                        <Grid container alignItems="center">
                            <Grid>
                                <IntegerInput
                                    name={FieldConstants.AMOUNT_TEMPORARY_LIMITS}
                                    label="amountTemporaryLimits"
                                />
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
                        </Grid>
                        <Grid sx={{ flex: 1, minWidth: 0 }}>
                            <CsvPicker<Record<string, unknown>>
                                label="UploadCSV"
                                requiredColumns={requiredColumns}
                                language={language}
                                parseConfig={parseConfig}
                                selectedFile={selectedFile}
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
                    <Grid sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        <CustomAgGridTable
                            ref={tableRef}
                            name={TabularFieldConstants.MODIFICATIONS_TABLE}
                            columnDefs={columnDefs}
                            defaultColDef={limitSetModificationsDefaultColDef}
                            makeDefaultRowData={makeDefaultRowData}
                            loading={isFetching}
                            pagination
                            rowSelection={{ mode: 'multiRow' }}
                            overrideLocales={AGGRID_LOCALES}
                            csvProps={csvProps}
                        />
                    </Grid>
                </>
            )}
        </Stack>
    );
}
