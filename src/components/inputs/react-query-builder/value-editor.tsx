/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { FunctionComponent, useCallback } from 'react';
import { MaterialValueEditor } from '@react-querybuilder/material';

import CountryValueEditor from './country-value-editor';
import TranslatedValueEditor from './translated-value-editor';
import TextValueEditor from './text-value-editor';
import Box from '@mui/material/Box';

import { useFormContext } from 'react-hook-form';
import { FieldConstants } from '../../../utils/field-constants';
import { DataType, FieldType } from '../../filter/expert/expert-filter.type';
import { Substation, VoltageLevel } from '../../../utils/equipment-types';
import ElementValueEditor from './element-value-editor';
import { ElementType } from '../../../utils/ElementType';
import PropertyValueEditor from './property-value-editor';
import { FilterType } from '../../filter/constants/filter-constants';
import GroupValueEditor from './composite-rule-editor/group-value-editor';
import { OPERATOR_OPTIONS } from '../../filter/expert/expert-filter-constants';

const styles = {
    noArrows: {
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
            {
                display: 'none',
            },
        '& input[type=number]': {
            MozAppearance: 'textfield',
        },
    },
};

const ValueEditor: FunctionComponent<ValueEditorProps> = (props) => {
    const formContext = useFormContext();
    const { getValues } = formContext;

    const itemFilter = useCallback(
        (value: any) => {
            if (value?.type === ElementType.FILTER) {
                return (
                    // we do not authorize to use an expert filter in the rules of
                    // another expert filter, to prevent potential cycle problems
                    value?.specificMetadata?.type !== FilterType.EXPERT.id &&
                    ((props.field === FieldType.ID &&
                        value?.specificMetadata?.equipmentType ===
                            getValues(FieldConstants.EQUIPMENT_TYPE)) ||
                        ((props.field === FieldType.VOLTAGE_LEVEL_ID ||
                            props.field === FieldType.VOLTAGE_LEVEL_ID_1 ||
                            props.field === FieldType.VOLTAGE_LEVEL_ID_2) &&
                            value?.specificMetadata?.equipmentType ===
                                VoltageLevel.type))
                );
            }
            return true;
        },
        [props.field, getValues]
    );

    if (
        props.operator === OPERATOR_OPTIONS.EXISTS.name ||
        props.operator === OPERATOR_OPTIONS.NOT_EXISTS.name
    ) {
        // No value needed for these operators
        return null;
    }
    if (
        [FieldType.COUNTRY, FieldType.COUNTRY_1, FieldType.COUNTRY_2].includes(
            props.field as FieldType
        )
    ) {
        return <CountryValueEditor {...props} />;
    }
    if (
        props.field === FieldType.REGULATION_TYPE ||
        props.field === FieldType.SVAR_REGULATION_MODE ||
        props.field === FieldType.ENERGY_SOURCE ||
        props.field === FieldType.SHUNT_COMPENSATOR_TYPE ||
        props.field === FieldType.LOAD_TYPE ||
        props.field === FieldType.RATIO_REGULATION_MODE ||
        props.field === FieldType.PHASE_REGULATION_MODE
    ) {
        return <TranslatedValueEditor {...props} />;
    }
    if (
        props.operator === OPERATOR_OPTIONS.IS_PART_OF.name ||
        props.operator === OPERATOR_OPTIONS.IS_NOT_PART_OF.name
    ) {
        let equipmentTypes;
        if (
            props.field === FieldType.VOLTAGE_LEVEL_ID ||
            props.field === FieldType.VOLTAGE_LEVEL_ID_1 ||
            props.field === FieldType.VOLTAGE_LEVEL_ID_2
        ) {
            equipmentTypes = [VoltageLevel.type];
        } else if (props.field === FieldType.ID) {
            equipmentTypes = [getValues(FieldConstants.EQUIPMENT_TYPE)];
        }

        return (
            <ElementValueEditor
                name={DataType.FILTER_UUID + props.rule.id}
                elementType={ElementType.FILTER}
                equipmentTypes={equipmentTypes}
                titleId="selectFilterDialogTitle"
                hideErrorMessage={true}
                onChange={(e: any) => {
                    props.handleOnChange(e.map((v: any) => v.id));
                }}
                itemFilter={itemFilter}
                defaultValue={props.value}
            />
        );
    } else if (
        props.field === FieldType.ID ||
        props.field === FieldType.NAME ||
        props.field === FieldType.REGULATING_TERMINAL_VL_ID ||
        props.field === FieldType.REGULATING_TERMINAL_CONNECTABLE_ID ||
        props.field === FieldType.VOLTAGE_LEVEL_ID ||
        props.field === FieldType.VOLTAGE_LEVEL_ID_1 ||
        props.field === FieldType.VOLTAGE_LEVEL_ID_2
    ) {
        return <TextValueEditor {...props} />;
    } else if (
        props.field === FieldType.PROPERTY ||
        props.field === FieldType.SUBSTATION_PROPERTY ||
        props.field === FieldType.SUBSTATION_PROPERTY_1 ||
        props.field === FieldType.SUBSTATION_PROPERTY_2 ||
        props.field === FieldType.VOLTAGE_LEVEL_PROPERTY ||
        props.field === FieldType.VOLTAGE_LEVEL_PROPERTY_1 ||
        props.field === FieldType.VOLTAGE_LEVEL_PROPERTY_2
    ) {
        let equipmentType;
        if (
            props.field === FieldType.SUBSTATION_PROPERTY ||
            props.field === FieldType.SUBSTATION_PROPERTY_1 ||
            props.field === FieldType.SUBSTATION_PROPERTY_2
        ) {
            equipmentType = Substation.type;
        } else if (
            props.field === FieldType.VOLTAGE_LEVEL_PROPERTY ||
            props.field === FieldType.VOLTAGE_LEVEL_PROPERTY_1 ||
            props.field === FieldType.VOLTAGE_LEVEL_PROPERTY_2
        ) {
            equipmentType = VoltageLevel.type;
        } else {
            equipmentType = getValues(FieldConstants.EQUIPMENT_TYPE);
        }

        return (
            <PropertyValueEditor
                equipmentType={equipmentType}
                valueEditorProps={props}
            />
        );
    } else if (props.fieldData.dataType === DataType.COMBINATOR) {
        return <GroupValueEditor {...props} />;
    }

    return (
        <Box sx={props.inputType === 'number' ? styles.noArrows : undefined}>
            <MaterialValueEditor
                {...props}
                title={undefined} // disable the tooltip
            />
        </Box>
    );
};
export default ValueEditor;
