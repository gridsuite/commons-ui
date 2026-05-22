/**
 * Copyright (c) 2024-2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { Box } from '@mui/material';
import { ValueParserParams } from 'ag-grid-community';
import { v4 as uuid4 } from 'uuid';
import type { UUID } from 'node:crypto';
import { FieldConstants } from '../../../../utils/constants/fieldConstants';
import yup from '../../../../utils/yupConfig';
import { CustomAgGridTable } from '../../agGridTable/CustomAgGridTable';
import { SelectInput } from '../../../ui/reactHookForm/selectInputs/SelectInput';
import { isInjection } from '../../../../utils/types/equipmentTypes';
import { NumericEditor } from '../../agGridTable/cellEditors/numericEditor';
import { InputWithPopupConfirmation } from '../../../ui/reactHookForm/selectInputs/InputWithPopupConfirmation';
import { toFloatOrNullValue } from '../../../ui/reactHookForm/utils/functions';
import { DISTRIBUTION_KEY } from '../constants/FilterConstants';
import { FILTER_EQUIPMENTS } from '../utils/filterFormUtils';
import { useSnackMessage } from '../../../../hooks/useSnackMessage';
import { ElementType } from '../../../../utils/types/elementType';
import { ModifyElementSelection } from '../../../ui/dialogs/modifyElementSelection/ModifyElementSelection';
import { exportFilter } from '../../../../services/study';
import { EquipmentType } from '../../../../utils/types/equipmentType';
import { unscrollableDialogStyles } from '../../../ui/dialogs';
import { FILTER_EQUIPMENTS_ATTRIBUTES } from './ExplicitNamingFilterConstants';
import { filterStyles } from '../HeaderFilterForm';
import { snackWithFallback } from '../../../../utils';
import { useCustomFormContext } from '../../../ui';

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
        const newColumnDefs: any[] = [
            {
                headerName: intl.formatMessage({
                    id: FieldConstants.EQUIPMENT_ID,
                }),
                rowDrag: true,
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

    const csvFileHeaders = useMemo(() => {
        const newCsvFileHeaders = [intl.formatMessage({ id: FieldConstants.EQUIPMENT_ID })];
        if (forGeneratorBatteryOrLoad) {
            newCsvFileHeaders.push(intl.formatMessage({ id: DISTRIBUTION_KEY }));
        }
        return newCsvFileHeaders;
    }, [intl, forGeneratorBatteryOrLoad]);

    const getDataFromCsvFile = useCallback((csvData: any) => {
        if (csvData) {
            return csvData.map((value: any) => {
                return {
                    [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
                    [FieldConstants.EQUIPMENT_ID]: value[0]?.trim(),
                    [DISTRIBUTION_KEY]: toFloatOrNullValue(value[1]?.trim()),
                };
            });
        }
        return [];
    }, []);

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
        <>
            <Box sx={unscrollableDialogStyles.unscrollableHeader}>
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
                        language,
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
