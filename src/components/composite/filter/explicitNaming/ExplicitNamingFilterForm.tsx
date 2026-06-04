/**
 * Copyright (c) 2024-2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { FieldValues, UseFieldArrayReturn, useWatch } from 'react-hook-form';
import { Alert, Grid2 as Grid } from '@mui/material';
import { ColDef, ValueParserParams } from 'ag-grid-community';
import { v4 as uuid4 } from 'uuid';
import type { UUID } from 'node:crypto';
import * as yup from 'yup';
import { FieldConstants } from '../../../../utils/constants/fieldConstants';
import { CustomAgGridTable } from '../../agGridTable/CustomAgGridTable';
import { hasNonEmptyRows } from '../../agGridTable/agGridTable-utils';
import { SelectInput } from '../../../ui/reactHookForm/selectInputs/SelectInput';
import { isInjection } from '../../../../utils/types/equipmentTypes';
import { NumericEditor, suppressNonNumericKeyboardEvent } from '../../agGridTable/cellEditors/numericEditor';
import { InputWithPopupConfirmation } from '../../../ui/reactHookForm/selectInputs/InputWithPopupConfirmation';
import { toFloatOrNullValue } from '../../../ui/reactHookForm/utils/functions';
import { DISTRIBUTION_KEY } from '../constants/FilterConstants';
import { FILTER_EQUIPMENTS } from '../utils/filterFormUtils';
import { useSnackMessage } from '../../../../hooks/useSnackMessage';
import { ElementType } from '../../../../utils/types/elementType';
import { ModifyElementSelection } from '../../../ui/dialogs/modifyElementSelection/ModifyElementSelection';
import { exportFilter } from '../../../../services/study';
import { EquipmentType } from '../../../../utils/types/equipmentType';
import { FILTER_EQUIPMENTS_ATTRIBUTES } from './ExplicitNamingFilterConstants';
import { filterStyles } from '../HeaderFilterForm';
import { LANG_SYSTEM, snackWithFallback } from '../../../../utils';
import { CsvPicker, useCustomFormContext } from '../../../ui';

export const explicitNamingFilterSchema = {
    [FILTER_EQUIPMENTS_ATTRIBUTES]: yup
        .array()
        .of(
            yup.object().shape({
                [FieldConstants.EQUIPMENT_ID]: yup.string().nullable(),
                [DISTRIBUTION_KEY]: yup.number().nullable(),
            })
        )
        // we remove empty lines
        .compact((row) => !row[DISTRIBUTION_KEY] && !row[FieldConstants.EQUIPMENT_ID])
        .min(1, 'emptyFilterError')
        .when([FieldConstants.EQUIPMENT_TYPE], {
            is: (equipmentType: string) => isInjection(equipmentType),
            then: (innerSchema) =>
                innerSchema
                    .test('noKeyWithoutId', 'distributionKeyWithMissingIdError', (array) => {
                        return !array!.some((row) => !row[FieldConstants.EQUIPMENT_ID]);
                    })
                    .test('ifOneKeyThenKeyEverywhere', 'missingDistributionKeyError', (array) => {
                        return !(
                            array!.some((row) => row[DISTRIBUTION_KEY]) && array!.some((row) => !row[DISTRIBUTION_KEY])
                        );
                    }),
        }),
};

interface FilterTableRow {
    [FieldConstants.AG_GRID_ROW_UUID]: string;
    [FieldConstants.EQUIPMENT_ID]: string;
    [DISTRIBUTION_KEY]: number | null;
}

function makeDefaultRowData(): FilterTableRow {
    return {
        [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
        [FieldConstants.EQUIPMENT_ID]: '',
        [DISTRIBUTION_KEY]: null,
    };
}

function makeDefaultTableRows() {
    return [makeDefaultRowData(), makeDefaultRowData(), makeDefaultRowData()];
}

export function getExplicitNamingFilterEmptyFormData() {
    return {
        [FILTER_EQUIPMENTS_ATTRIBUTES]: makeDefaultTableRows(),
    };
}

export interface FilterForExplicitConversionProps {
    id: UUID;
    equipmentType: string;
}

interface ExplicitNamingFilterFormProps {
    sourceFilterForExplicitNamingConversion?: FilterForExplicitConversionProps;
    isEditing: boolean;
}

export function ExplicitNamingFilterForm({
    sourceFilterForExplicitNamingConversion,
    isEditing,
}: Readonly<ExplicitNamingFilterFormProps>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const { getValues, setValue, isDeveloperMode, language } = useCustomFormContext();

    const watchEquipmentType = useWatch({
        name: FieldConstants.EQUIPMENT_TYPE,
    });

    useEffect(() => {
        if (watchEquipmentType && !((watchEquipmentType as EquipmentType) in FILTER_EQUIPMENTS)) {
            snackError({
                headerId: 'obsoleteFilter',
            });
        }
    }, [snackError, watchEquipmentType]);

    const forGeneratorBatteryOrLoad = isInjection(watchEquipmentType);

    useEffect(() => {
        if (sourceFilterForExplicitNamingConversion) {
            setValue(FieldConstants.EQUIPMENT_TYPE, sourceFilterForExplicitNamingConversion.equipmentType);
        }
    }, [sourceFilterForExplicitNamingConversion, setValue]);

    const columnDefs = useMemo(() => {
        const newColumnDefs: ColDef[] = [
            {
                headerName: intl.formatMessage({
                    id: FieldConstants.EQUIPMENT_ID,
                }),
                field: FieldConstants.EQUIPMENT_ID,
                editable: true,
                singleClickEdit: true,
                flex: 1,
                valueParser: (params: ValueParserParams) => params.newValue?.trim() ?? null,
            },
        ];
        if (forGeneratorBatteryOrLoad) {
            newColumnDefs.push({
                headerName: intl.formatMessage({ id: DISTRIBUTION_KEY }),
                field: DISTRIBUTION_KEY,
                editable: true,
                singleClickEdit: true,
                cellEditor: NumericEditor,
                suppressKeyboardEvent: suppressNonNumericKeyboardEvent,
                flex: 1,
            });
        }
        return newColumnDefs;
    }, [intl, forGeneratorBatteryOrLoad]);

    const defaultColDef = useMemo(
        () => ({
            suppressMovable: true,
        }),
        []
    );

    const csvFileHeaders = useMemo(() => columnDefs.map((c) => c.headerName as string), [columnDefs]);

    const getDataFromCsvFile = useCallback(
        (csvData: Record<string, string>[]) => {
            const [equipmentIdHeader, distributionKeyHeader] = csvFileHeaders;
            return csvData.map((row) => ({
                [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
                [FieldConstants.EQUIPMENT_ID]: row[equipmentIdHeader]?.trim() ?? null,
                [DISTRIBUTION_KEY]: distributionKeyHeader
                    ? toFloatOrNullValue(row[distributionKeyHeader]?.trim())
                    : null,
            }));
        },
        [csvFileHeaders]
    );

    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [selectedFileError, setSelectedFileError] = useState<string | undefined>();
    const tableRef = useRef<UseFieldArrayReturn<FieldValues, string>>(null);

    useEffect(() => {
        setSelectedFile(undefined);
        setSelectedFileError(undefined);
    }, [watchEquipmentType]);

    const hasExistingData = useCallback(() => hasNonEmptyRows(getValues(FILTER_EQUIPMENTS_ATTRIBUTES)), [getValues]);

    const getTemplateData = useCallback(() => [csvFileHeaders], [csvFileHeaders]);

    const getTableData = useCallback(() => {
        const rows = (getValues(FILTER_EQUIPMENTS_ATTRIBUTES) ?? []) as Record<string, any>[];
        return [
            csvFileHeaders,
            ...rows.map((r) =>
                forGeneratorBatteryOrLoad
                    ? [r[FieldConstants.EQUIPMENT_ID] ?? '', r[DISTRIBUTION_KEY] ?? '']
                    : [r[FieldConstants.EQUIPMENT_ID] ?? '']
            ),
        ];
    }, [csvFileHeaders, forGeneratorBatteryOrLoad, getValues]);

    const openConfirmationPopup = () => {
        return getValues(FILTER_EQUIPMENTS_ATTRIBUTES).some(
            (row: FilterTableRow) => row[DISTRIBUTION_KEY] || row[FieldConstants.EQUIPMENT_ID]
        );
    };

    const handleResetOnConfirmation = () => {
        setValue(FILTER_EQUIPMENTS_ATTRIBUTES, makeDefaultTableRows());
    };

    const onStudySelected = (studyUuid: UUID) => {
        exportFilter(studyUuid, sourceFilterForExplicitNamingConversion?.id)
            .then((matchingEquipments: any) => {
                setValue(
                    FILTER_EQUIPMENTS_ATTRIBUTES,
                    matchingEquipments.length === 0
                        ? makeDefaultTableRows()
                        : matchingEquipments.map((equipment: any) => ({
                              [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
                              [FieldConstants.EQUIPMENT_ID]: equipment.id,
                              [DISTRIBUTION_KEY]: equipment.distributionKey,
                          }))
                );
            })
            .catch((error: any) =>
                snackWithFallback(snackError, error, { headerId: 'convertIntoExplicitNamingFilterError' })
            );
    };

    return (
        <Grid
            container
            direction="column"
            spacing={2}
            padding={1} // because of unscrollableHeader in parent component
            sx={{ flexGrow: 1, flexWrap: 'nowrap', minHeight: 0 }}
        >
            <Grid container size={12} spacing={2} justifyContent="space-between" alignItems="center">
                <Grid>
                    <InputWithPopupConfirmation
                        Input={SelectInput}
                        name={FieldConstants.EQUIPMENT_TYPE}
                        options={Object.values(FILTER_EQUIPMENTS)}
                        disabled={!!sourceFilterForExplicitNamingConversion || (isEditing && !isDeveloperMode)}
                        label="equipmentType"
                        shouldOpenPopup={openConfirmationPopup}
                        resetOnConfirmation={handleResetOnConfirmation}
                        message="changeTypeMessage"
                        validateButtonLabel="button.changeType"
                        sx={filterStyles.textField}
                        data-testid="EquipmentTypeSelector"
                    />
                    {sourceFilterForExplicitNamingConversion && (
                        <ModifyElementSelection
                            elementType={ElementType.STUDY}
                            onElementValidated={onStudySelected}
                            dialogOpeningButtonLabel="selectStudyDialogButton"
                            dialogTitleLabel="selectStudyDialogTitle"
                            dialogMessageLabel="selectStudyText"
                            noElementMessageLabel="noSelectedStudyText"
                        />
                    )}
                </Grid>
                <Grid>
                    <CsvPicker<Record<string, string>>
                        label="UploadCSV"
                        header={csvFileHeaders}
                        language={language ?? LANG_SYSTEM}
                        selectedFile={selectedFile}
                        onFileChange={setSelectedFile}
                        onFileError={setSelectedFileError}
                        hasExistingData={hasExistingData}
                        onAppend={(results) => tableRef.current?.append(getDataFromCsvFile(results.data))}
                        onReplace={(results) => tableRef.current?.replace(getDataFromCsvFile(results.data))}
                    />
                </Grid>
            </Grid>
            {selectedFileError && (
                <Grid size={12}>
                    <Alert severity="error">{selectedFileError}</Alert>
                </Grid>
            )}
            {watchEquipmentType && (
                <Grid size={12} sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    <CustomAgGridTable
                        ref={tableRef}
                        name={FILTER_EQUIPMENTS_ATTRIBUTES}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        makeDefaultRowData={makeDefaultRowData}
                        pagination
                        rowSelection={{
                            mode: 'multiRow',
                            enableClickSelection: false,
                            checkboxes: true,
                            headerCheckbox: true,
                        }}
                        alwaysShowVerticalScroll
                        csvProps={{
                            fileName: intl.formatMessage({ id: 'filterCsvFileName' }),
                            language,
                            getTemplateData,
                            getTableData,
                        }}
                    />
                </Grid>
            )}
        </Grid>
    );
}
