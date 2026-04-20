/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DensityLarge as DensityLargeIcon } from '@mui/icons-material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { areIdsEqual, ElementType, FieldConstants, FieldType, getIdOrValue, Option } from '../../../../../utils';
import { useFormatLabelWithUnit, usePredefinedProperties } from '../../../../../hooks';
import {
    AutocompleteInput,
    DirectoryItemsInput,
    FloatInput,
    IntegerInput,
    SelectInput,
    SwitchInput,
    TextInput,
} from '../../../../inputs';
import { DataType } from './assignment.type';
import GridItem from '../../../../grid/grid-item';
import { EQUIPMENTS_FIELDS, EquipmentTypeOptionType } from './assignment-constants';
import { EMPTY_FIELD_VALUE } from './assignment-utils';

interface AssignmentFormProps {
    name: string;
    index: number;
}

const comparatorStrIgnoreCase = (str1: string, str2: string) => {
    return str1?.toLowerCase()?.localeCompare(str2?.toLowerCase());
};

function AssignmentForm(props: Readonly<AssignmentFormProps>) {
    const { name, index } = props;
    const { setError, setValue } = useFormContext();
    const intl = useIntl();

    const watchEditedField = useWatch({
        name: `${name}.${index}.${FieldConstants.EDITED_FIELD}`,
    });

    const watchEquipmentType: EquipmentTypeOptionType = useWatch({
        name: FieldConstants.EQUIPMENT_TYPE,
    });

    const equipmentFields = useMemo(
        () => Object.values(EQUIPMENTS_FIELDS[watchEquipmentType] ?? []),
        [watchEquipmentType]
    );

    const networkEquipmentType = useMemo(() => {
        if (
            [
                FieldType.OPERATIONAL_LIMITS_GROUP_1_WITH_PROPERTIES,
                FieldType.OPERATIONAL_LIMITS_GROUP_2_WITH_PROPERTIES,
            ].includes(watchEditedField)
        ) {
            return 'limitsGroup';
        }
        return watchEquipmentType;
    }, [watchEquipmentType, watchEditedField]);

    const [predefinedProperties] = usePredefinedProperties(networkEquipmentType);

    const dataType = useMemo(() => {
        return equipmentFields?.find((fieldOption) => fieldOption?.id === watchEditedField)?.dataType;
    }, [watchEditedField, equipmentFields]);

    const settableToNone: boolean = useMemo(() => {
        return equipmentFields?.find((fieldOption) => fieldOption?.id === watchEditedField)?.settableToNone ?? false;
    }, [watchEditedField, equipmentFields]);

    const watchPropertyName = useWatch({
        name: `${name}.${index}.${FieldConstants.PROPERTY_NAME}`,
    });

    const predefinedPropertiesNames = useMemo(() => {
        return Object.keys(predefinedProperties ?? {}).sort(comparatorStrIgnoreCase);
    }, [predefinedProperties]);

    const predefinedPropertiesValues = useMemo(() => {
        return [...(predefinedProperties?.[watchPropertyName] ?? [])].sort(comparatorStrIgnoreCase);
    }, [watchPropertyName, predefinedProperties]);

    const options = useMemo(() => {
        return equipmentFields?.find((fieldOption) => fieldOption?.id === watchEditedField)?.values ?? [];
    }, [watchEditedField, equipmentFields]);

    const emptyFieldLabel = useMemo(() => {
        return intl.formatMessage({ id: 'EmptyField' });
    }, [intl]);
    const formatLabelWithUnit = useFormatLabelWithUnit();

    const prevEditedField = useRef(watchEditedField);
    const [editedFieldKey, setEditedFieldKey] = useState(watchEditedField);
    useEffect(() => {
        if (prevEditedField.current !== watchEditedField) {
            prevEditedField.current = watchEditedField;
            setValue(`${name}.${index}.${FieldConstants.VALUE}`, dataType === DataType.BOOLEAN ? false : null);
            setValue(`${name}.${index}.${FieldConstants.PROPERTY_NAME}`, null);
            setEditedFieldKey(watchEditedField);
        }
    }, [dataType, index, name, setValue, watchEditedField]);

    const renderAutoCompleteSettableToNone = useCallback(
        (numberOnly?: boolean) => (
            <AutocompleteInput
                key={editedFieldKey}
                name={`${name}.${index}.${FieldConstants.VALUE}`}
                label="ValueOrEmptyField"
                options={[emptyFieldLabel]}
                size="small"
                onCheckNewValue={
                    numberOnly
                        ? (option: Option | null) => {
                              const optionValue = getIdOrValue(option);
                              if (
                                  optionValue &&
                                  optionValue !== emptyFieldLabel &&
                                  optionValue !== EMPTY_FIELD_VALUE &&
                                  Number.isNaN(Number(optionValue))
                              ) {
                                  setError(`${name}.${index}.${FieldConstants.VALUE}`, {
                                      message: 'NumericValueOrEmptyField',
                                  });
                              } else {
                                  setError(`${name}.${index}.${FieldConstants.VALUE}`, {
                                      message: '',
                                  });
                              }
                              return true;
                          }
                        : undefined
                }
                getOptionLabel={(option: Option) => (typeof option !== 'string' ? (option?.label ?? option) : option)}
                inputTransform={(value: Option | null) => (value === EMPTY_FIELD_VALUE ? emptyFieldLabel : value)}
                outputTransform={(value: Option | null) => {
                    const optionValue = getIdOrValue(value);
                    if (optionValue === emptyFieldLabel) {
                        return EMPTY_FIELD_VALUE;
                    }
                    return optionValue ?? null;
                }}
                allowNewValue
            />
        ),
        [emptyFieldLabel, index, name, setError, editedFieldKey]
    );

    const filtersField = (
        <DirectoryItemsInput
            name={`${name}.${index}.${FieldConstants.FILTERS}`}
            equipmentTypes={[watchEquipmentType]}
            elementType={ElementType.FILTER}
            label="filter"
            titleId="FiltersListsSelection"
            disable={!watchEquipmentType}
        />
    );

    const editedField = (
        <AutocompleteInput
            name={`${name}.${index}.${FieldConstants.EDITED_FIELD}`}
            options={equipmentFields}
            label="EditedField"
            size="small"
            inputTransform={(value: any) => equipmentFields.find((option) => option?.id === value) || value}
            outputTransform={(option: any) => getIdOrValue(option) ?? null}
            getOptionLabel={(option: any) => formatLabelWithUnit(option)}
            isOptionEqualToValue={areIdsEqual}
        />
    );

    const propertyNameField = (
        <AutocompleteInput
            name={`${name}.${index}.${FieldConstants.PROPERTY_NAME}`}
            options={predefinedPropertiesNames}
            label="PropertyName"
            size="small"
            allowNewValue
        />
    );

    let valueField;
    if (dataType === DataType.PROPERTY) {
        valueField = (
            <AutocompleteInput
                key={editedFieldKey}
                name={`${name}.${index}.${FieldConstants.VALUE}`}
                label="PropertyValue"
                options={predefinedPropertiesValues}
                size="small"
                allowNewValue
            />
        );
    } else if (dataType === DataType.INTEGER) {
        valueField = (
            <IntegerInput key={editedFieldKey} name={`${name}.${index}.${FieldConstants.VALUE}`} label="Value" />
        );
    } else if (dataType === DataType.BOOLEAN) {
        valueField = (
            <SwitchInput
                key={editedFieldKey}
                name={`${name}.${index}.${FieldConstants.VALUE}`}
                formProps={{ value: false }}
            />
        );
    } else if (dataType === DataType.ENUM) {
        valueField = (
            <SelectInput
                key={editedFieldKey}
                name={`${name}.${index}.${FieldConstants.VALUE}`}
                label="Value"
                options={options}
                size="small"
            />
        );
    } else if (dataType === DataType.STRING && settableToNone) {
        valueField = renderAutoCompleteSettableToNone();
    } else if (dataType === DataType.STRING) {
        valueField = (
            <TextInput key={editedFieldKey} name={`${name}.${index}.${FieldConstants.VALUE}`} label="Value" clearable />
        );
    } else if (dataType === DataType.DOUBLE && settableToNone) {
        valueField = renderAutoCompleteSettableToNone(true);
    } else {
        valueField = <FloatInput key={editedFieldKey} name={`${name}.${index}.${FieldConstants.VALUE}`} label="Value" />;
    }

    return (
        <>
            <GridItem size={3.25}>{filtersField}</GridItem>
            <GridItem size={3}>{editedField}</GridItem>
            <>
                {dataType === DataType.PROPERTY && <GridItem size={2.0}>{propertyNameField}</GridItem>}
                <GridItem size={0.25}>
                    <DensityLargeIcon fontSize="small" sx={{ marginTop: 1 }} />
                </GridItem>
            </>
            <GridItem size={dataType === DataType.PROPERTY ? 2.25 : 4.25}>{valueField}</GridItem>
        </>
    );
}

export default AssignmentForm;
