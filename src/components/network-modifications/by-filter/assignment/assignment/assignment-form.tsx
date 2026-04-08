/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { DensityLarge as DensityLargeIcon } from '@mui/icons-material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { areIdsEqual, ElementType, FieldConstants, FieldType, getIdOrValue, Option } from '../../../../../utils';
import { useFormatLabelWithUnit, usePredefinedProperties, usePrevious } from '../../../../../hooks';
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

    const prevDataType = usePrevious(dataType);
    if (prevDataType && prevDataType !== dataType) {
        setValue(`${name}.${index}.${FieldConstants.VALUE}`, dataType === DataType.BOOLEAN ? false : null);
    }

    const emptyValueStr = useMemo(() => {
        return intl.formatMessage({ id: 'EmptyField' });
    }, [intl]);

    const formatLabelWithUnit = useFormatLabelWithUnit();

    const renderAutoCompleteSettableToNone = useCallback(
        (numberOnly?: boolean) => (
            <AutocompleteInput
                name={`${name}.${index}.${FieldConstants.VALUE}`}
                label="ValueOrEmptyField"
                options={[emptyValueStr]}
                size="small"
                onCheckNewValue={
                    numberOnly
                        ? (option: Option | null) => {
                              if (option && option !== emptyValueStr && Number.isNaN(Number(option))) {
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
                allowNewValue
            />
        ),
        [emptyValueStr, index, name, setError]
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

    const valueField = useMemo(() => {
        if (dataType === DataType.PROPERTY) {
            return (
                <AutocompleteInput
                    name={`${name}.${index}.${FieldConstants.VALUE}`}
                    label="PropertyValue"
                    options={predefinedPropertiesValues}
                    size="small"
                    allowNewValue
                />
            );
        }

        if (dataType === DataType.INTEGER) {
            return <IntegerInput name={`${name}.${index}.${FieldConstants.VALUE}`} label="Value" />;
        }

        if (dataType === DataType.BOOLEAN) {
            return <SwitchInput name={`${name}.${index}.${FieldConstants.VALUE}`} formProps={{ value: false }} />;
        }

        if (dataType === DataType.ENUM) {
            return (
                <SelectInput
                    name={`${name}.${index}.${FieldConstants.VALUE}`}
                    label="Value"
                    options={options}
                    size="small"
                />
            );
        }

        if (dataType === DataType.STRING && settableToNone) {
            return renderAutoCompleteSettableToNone();
        }

        if (dataType === DataType.STRING) {
            return <TextInput name={`${name}.${index}.${FieldConstants.VALUE}`} label="Value" clearable />;
        }

        if (dataType === DataType.DOUBLE && settableToNone) {
            return renderAutoCompleteSettableToNone(true);
        }

        return <FloatInput name={`${name}.${index}.${FieldConstants.VALUE}`} label="Value" />;
    }, [dataType, settableToNone, name, index, predefinedPropertiesValues, options, renderAutoCompleteSettableToNone]);

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
