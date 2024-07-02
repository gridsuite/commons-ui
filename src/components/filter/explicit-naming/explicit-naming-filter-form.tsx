/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { FieldConstants } from '../../../utils/field-constants';
import yup from '../../../utils/yup-config';
import CustomAgGridTable, {
    ROW_DRAGGING_SELECTION_COLUMN_DEF,
} from '../../inputs/react-hook-form/ag-grid-table/custom-ag-grid-table';
import { useIntl } from 'react-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import SelectInput from '../../inputs/react-hook-form/select-inputs/select-input';
import { ValueParserParams } from 'ag-grid-community';
import { Generator, Load } from '../../../utils/equipment-types';
import { NumericEditor } from '../../inputs/react-hook-form/ag-grid-table/cell-editors/numericEditor';
import InputWithPopupConfirmation from '../../inputs/react-hook-form/select-inputs/input-with-popup-confirmation';
import { v4 as uuid4 } from 'uuid';
import { toFloatOrNullValue } from '../../inputs/react-hook-form/utils/functions';
import { DISTRIBUTION_KEY, FilterType } from '../constants/filter-constants';
import { FILTER_EQUIPMENTS } from '../utils/filter-form-utils';
import { UUID } from 'crypto';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { ElementType } from '../../../utils/ElementType';
import ModifyElementSelection from '../../dialogs/modify-element-selection';
import { exportFilter } from '../../../services/study';
import { EquipmentType } from '../../../utils/EquipmentType';

export const FILTER_EQUIPMENTS_ATTRIBUTES = 'filterEquipmentsAttributes';

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
        .compact(
            (row) => !row[DISTRIBUTION_KEY] && !row[FieldConstants.EQUIPMENT_ID]
        )
        .when([FieldConstants.FILTER_TYPE], {
            is: FilterType.EXPLICIT_NAMING.id,
            then: (schema) =>
                schema
                    .min(1, 'emptyFilterError')
                    .when([FieldConstants.EQUIPMENT_TYPE], {
                        is: (equipmentType: string) =>
                            isGeneratorOrLoad(equipmentType),
                        then: (schema) =>
                            schema
                                .test(
                                    'noKeyWithoutId',
                                    'distributionKeyWithMissingIdError',
                                    (array) => {
                                        return !array!.some(
                                            (row) =>
                                                !row[
                                                    FieldConstants.EQUIPMENT_ID
                                                ]
                                        );
                                    }
                                )
                                .test(
                                    'ifOneKeyThenKeyEverywhere',
                                    'missingDistributionKeyError',
                                    (array) => {
                                        return !(
                                            array!.some(
                                                (row) => row[DISTRIBUTION_KEY]
                                            ) &&
                                            array!.some(
                                                (row) => !row[DISTRIBUTION_KEY]
                                            )
                                        );
                                    }
                                ),
                    }),
        }),
};

function isGeneratorOrLoad(equipmentType: string): boolean {
    return equipmentType === Generator.type || equipmentType === Load.type;
}

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
    equipmentType: String;
}

interface ExplicitNamingFilterFormProps {
    sourceFilterForExplicitNamingConversion?: FilterForExplicitConversionProps;
}

const ExplicitNamingFilterForm: FunctionComponent<
    ExplicitNamingFilterFormProps
> = ({ sourceFilterForExplicitNamingConversion }) => {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const { getValues, setValue } = useFormContext();

    const watchEquipmentType = useWatch({
        name: FieldConstants.EQUIPMENT_TYPE,
    });

    useEffect(() => {
        if (
            watchEquipmentType &&
            !((watchEquipmentType as EquipmentType) in FILTER_EQUIPMENTS)
        ) {
            snackError({
                headerId: 'obsoleteFilter',
            });
        }
    }, [snackError, watchEquipmentType]);

    const forGeneratorOrLoad = isGeneratorOrLoad(watchEquipmentType);

    useEffect(() => {
        if (sourceFilterForExplicitNamingConversion) {
            setValue(
                FieldConstants.EQUIPMENT_TYPE,
                sourceFilterForExplicitNamingConversion.equipmentType
            );
        }
    }, [sourceFilterForExplicitNamingConversion, setValue]);

    const columnDefs = useMemo(() => {
        const columnDefs: any[] = [
            ...ROW_DRAGGING_SELECTION_COLUMN_DEF,
            {
                headerName: intl.formatMessage({
                    id: FieldConstants.EQUIPMENT_ID,
                }),
                field: FieldConstants.EQUIPMENT_ID,
                editable: true,
                singleClickEdit: true,
                valueParser: (params: ValueParserParams) =>
                    params.newValue?.trim() ?? null,
            },
        ];
        if (forGeneratorOrLoad) {
            columnDefs.push({
                headerName: intl.formatMessage({ id: DISTRIBUTION_KEY }),
                field: DISTRIBUTION_KEY,
                editable: true,
                singleClickEdit: true,
                cellEditor: NumericEditor,
                maxWidth: 200,
            });
        }
        return columnDefs;
    }, [intl, forGeneratorOrLoad]);

    const defaultColDef = useMemo(
        () => ({
            suppressMovable: true,
        }),
        []
    );

    const csvFileHeaders = useMemo(() => {
        const csvFileHeaders = [
            intl.formatMessage({ id: FieldConstants.EQUIPMENT_ID }),
        ];
        if (forGeneratorOrLoad) {
            csvFileHeaders.push(intl.formatMessage({ id: DISTRIBUTION_KEY }));
        }
        return csvFileHeaders;
    }, [intl, forGeneratorOrLoad]);

    const getDataFromCsvFile = useCallback((csvData: any) => {
        if (csvData) {
            return csvData.map((value: any) => {
                return {
                    [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
                    [FieldConstants.EQUIPMENT_ID]: value[0]?.trim(),
                    [DISTRIBUTION_KEY]: toFloatOrNullValue(value[1]?.trim()),
                };
            });
        } else {
            return [];
        }
    }, []);

    const openConfirmationPopup = () => {
        return getValues(FILTER_EQUIPMENTS_ATTRIBUTES).some(
            (row: FilterTableRow) =>
                row[DISTRIBUTION_KEY] || row[FieldConstants.EQUIPMENT_ID]
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
                snackError({
                    messageTxt: error.message,
                    headerId: 'convertIntoExplicitNamingFilterError',
                })
            );
    };

    return (
        <Grid container item spacing={2}>
            <Grid item xs={12}>
                <InputWithPopupConfirmation
                    Input={SelectInput}
                    name={FieldConstants.EQUIPMENT_TYPE}
                    options={Object.values(FILTER_EQUIPMENTS)}
                    disabled={sourceFilterForExplicitNamingConversion}
                    label={'equipmentType'}
                    shouldOpenPopup={openConfirmationPopup}
                    resetOnConfirmation={handleResetOnConfirmation}
                    message={'changeTypeMessage'}
                    validateButtonLabel={'button.changeType'}
                />
                {sourceFilterForExplicitNamingConversion && (
                    <ModifyElementSelection
                        elementType={ElementType.STUDY}
                        onElementValidated={onStudySelected}
                        dialogOpeningButtonLabel={'selectStudyDialogButton'}
                        dialogTitleLabel={'selectStudyDialogTitle'}
                        dialogMessageLabel={'selectStudyText'}
                        noElementMessageLabel={'noSelectedStudyText'}
                    />
                )}
            </Grid>
            {watchEquipmentType && (
                <Grid item xs={12}>
                    <CustomAgGridTable
                        name={FILTER_EQUIPMENTS_ATTRIBUTES}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        makeDefaultRowData={makeDefaultRowData}
                        pagination={true}
                        paginationPageSize={100}
                        suppressRowClickSelection
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
                            '& .ag-root-wrapper-body': {
                                maxHeight: '430px',
                            },
                        }}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default ExplicitNamingFilterForm;
