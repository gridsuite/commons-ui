/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { Box } from '@mui/material';
import type { ValueParserParams } from 'ag-grid-community';
import { v4 as uuid4 } from 'uuid';
import type { UUID } from 'crypto';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { CustomAgGridTable } from '../../inputs/reactHookForm/agGridTable/CustomAgGridTable';
import { SelectInput } from '../../inputs/reactHookForm/selectInputs/SelectInput';
import { Generator, Load } from '../../../utils/types/equipmentTypes';
import { NumericEditor } from '../../inputs/reactHookForm/agGridTable/cellEditors/numericEditor';
import { InputWithPopupConfirmation } from '../../inputs/reactHookForm/selectInputs/InputWithPopupConfirmation';
import { toFloatOrNullValue } from '../../inputs/reactHookForm/utils/functions';
import { DISTRIBUTION_KEY, FilterType } from '../constants/FilterConstants';
import { FILTER_EQUIPMENTS } from '../utils/filterFormUtils';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { ElementType } from '../../../utils/types/elementType';
import { ModifyElementSelection } from '../../dialogs/modifyElementSelection/ModifyElementSelection';
import { exportFilter } from '../../../services/study';
import { EquipmentType } from '../../../utils/types/equipmentType';
import { unscrollableDialogStyles } from '../../dialogs';
import { FILTER_EQUIPMENTS_ATTRIBUTES } from './ExplicitNamingFilterConstants';
import { filterStyles } from '../HeaderFilterForm';

function isGeneratorOrLoad(equipmentType: string) {
    return equipmentType === Generator.type || equipmentType === Load.type;
}

export function getExplicitNamingFilterSchema(intl: IntlShape) {
    return {
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
            .when([FieldConstants.FILTER_TYPE], {
                is: FilterType.EXPLICIT_NAMING.id,
                then: (schema) =>
                    schema
                        .min(1, intl.formatMessage({ id: 'emptyFilterError' }))
                        .when([FieldConstants.EQUIPMENT_TYPE], {
                            is: (equipmentType: string) => isGeneratorOrLoad(equipmentType),
                            then: (innerSchema) =>
                                innerSchema
                                    .test(
                                        'noKeyWithoutId',
                                        intl.formatMessage({ id: 'distributionKeyWithMissingIdError' }),
                                        (array) => {
                                            return !array!.some((row) => !row[FieldConstants.EQUIPMENT_ID]);
                                        }
                                    )
                                    .test(
                                        'ifOneKeyThenKeyEverywhere',
                                        intl.formatMessage({ id: 'missingDistributionKeyError' }),
                                        (array) => {
                                            return !(
                                                array!.some((row) => row[DISTRIBUTION_KEY]) &&
                                                array!.some((row) => !row[DISTRIBUTION_KEY])
                                            );
                                        }
                                    ),
                        }),
            }),
    };
}

interface FilterTableRow {
    [FieldConstants.AG_GRID_ROW_UUID]: string;
    [FieldConstants.EQUIPMENT_ID]: string;
    [DISTRIBUTION_KEY]: number | null;
}

function makeDefaultRowData(): FilterTableRow {
    return {
        [FieldConstants.AG_GRID_ROW_UUID]: uuid4() as UUID,
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

const defaultColDef = { suppressMovable: true } as const;

function getDataFromCsvFile(csvData: any) {
    return csvData
        ? csvData.map((value: any) => ({
              [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
              [FieldConstants.EQUIPMENT_ID]: value[0]?.trim(),
              [DISTRIBUTION_KEY]: toFloatOrNullValue(value[1]?.trim()),
          }))
        : [];
}

export interface FilterForExplicitConversionProps {
    id: UUID;
    equipmentType: string;
}

interface ExplicitNamingFilterFormProps {
    sourceFilterForExplicitNamingConversion?: FilterForExplicitConversionProps;
}

export function ExplicitNamingFilterForm({ sourceFilterForExplicitNamingConversion }: ExplicitNamingFilterFormProps) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const { getValues, setValue } = useFormContext();

    const watchEquipmentType = useWatch({ name: FieldConstants.EQUIPMENT_TYPE });
    useEffect(() => {
        if (watchEquipmentType && !((watchEquipmentType as EquipmentType) in FILTER_EQUIPMENTS)) {
            snackError({ headerId: 'obsoleteFilter' });
        }
    }, [snackError, watchEquipmentType]);

    const forGeneratorOrLoad = isGeneratorOrLoad(watchEquipmentType);

    useEffect(() => {
        if (sourceFilterForExplicitNamingConversion) {
            setValue(FieldConstants.EQUIPMENT_TYPE, sourceFilterForExplicitNamingConversion.equipmentType);
        }
    }, [sourceFilterForExplicitNamingConversion, setValue]);

    const columnDefs = useMemo(() => {
        const newColumnDefs: any[] = [
            {
                headerName: intl.formatMessage({ id: FieldConstants.EQUIPMENT_ID }),
                rowDrag: true,
                field: FieldConstants.EQUIPMENT_ID,
                editable: true,
                singleClickEdit: true,
                flex: 1,
                valueParser: (params: ValueParserParams) => params.newValue?.trim() ?? null,
            },
        ];
        if (forGeneratorOrLoad) {
            newColumnDefs.push({
                headerName: intl.formatMessage({ id: DISTRIBUTION_KEY }),
                field: DISTRIBUTION_KEY,
                editable: true,
                singleClickEdit: true,
                cellEditor: NumericEditor,
                flex: 1,
            });
        }
        return newColumnDefs;
    }, [intl, forGeneratorOrLoad]);

    const csvFileHeaders = useMemo(() => {
        const newCsvFileHeaders = [intl.formatMessage({ id: FieldConstants.EQUIPMENT_ID })];
        if (forGeneratorOrLoad) {
            newCsvFileHeaders.push(intl.formatMessage({ id: DISTRIBUTION_KEY }));
        }
        return newCsvFileHeaders;
    }, [intl, forGeneratorOrLoad]);

    const openConfirmationPopup = useCallback(
        () =>
            getValues(FILTER_EQUIPMENTS_ATTRIBUTES).some(
                (row: FilterTableRow) => row[DISTRIBUTION_KEY] || row[FieldConstants.EQUIPMENT_ID]
            ),
        [getValues]
    );

    const handleResetOnConfirmation = useCallback(() => {
        setValue(FILTER_EQUIPMENTS_ATTRIBUTES, makeDefaultTableRows());
    }, [setValue]);

    const onStudySelected = useCallback(
        (studyUuid: UUID) => {
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
                    snackError({ messageTxt: error.message, headerId: 'convertIntoExplicitNamingFilterError' })
                );
        },
        [setValue, snackError, sourceFilterForExplicitNamingConversion?.id]
    );

    return (
        <>
            <Box sx={unscrollableDialogStyles.unscrollableHeader}>
                <InputWithPopupConfirmation
                    Input={SelectInput}
                    name={FieldConstants.EQUIPMENT_TYPE}
                    options={Object.values(FILTER_EQUIPMENTS)}
                    disabled={!!sourceFilterForExplicitNamingConversion}
                    label="equipmentType"
                    shouldOpenPopup={openConfirmationPopup}
                    resetOnConfirmation={handleResetOnConfirmation}
                    message="changeTypeMessage"
                    validateButtonLabel="button.changeType"
                    sx={filterStyles.textField}
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
            </Box>
            {watchEquipmentType && (
                <CustomAgGridTable
                    name={FILTER_EQUIPMENTS_ATTRIBUTES}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    makeDefaultRowData={makeDefaultRowData}
                    pagination
                    paginationPageSize={100}
                    rowSelection={{
                        mode: 'multiRow',
                        enableClickSelection: false,
                        checkboxes: true,
                        headerCheckbox: true,
                    }}
                    alwaysShowVerticalScroll
                    stopEditingWhenCellsLoseFocus
                    csvProps={{
                        fileName: intl.formatMessage({
                            id: 'filterCsvFileName',
                        }),
                        fileHeaders: csvFileHeaders,
                        getDataFromCsv: getDataFromCsvFile,
                    }}
                    cssProps={{
                        padding: 1,
                        '& .ag-root-wrapper-body': {
                            maxHeight: 'unset',
                        },
                    }}
                />
            )}
        </>
    );
}
