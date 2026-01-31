/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import yup from '../../../utils/yupConfig';
import {
    ACCURACY,
    ACTIVE,
    CALCULATION_TYPE,
    LOAD_FILTERS,
    LOAD_MODELS_RULE,
    LOADS_VARIATIONS,
    VARIATION,
} from './constants';
import { ElementType, EquipmentType, ID, ParameterType, SpecificParameterInfos } from '../../../utils';
import ParameterField from '../common/parameter-field';
import { NAME } from '../../inputs';
import { CalculationType, LoadModelsRule } from '../../../services';
import ParameterDndTableField from '../common/parameter-dnd-table-field';
import { DndColumn, DndColumnType } from '../../dnd-table';

export const formSchema = yup.object().shape({
    [CALCULATION_TYPE]: yup.string().required(),
    [ACCURACY]: yup.number().required(),
    [LOAD_MODELS_RULE]: yup.string().required(),
    [LOADS_VARIATIONS]: yup.array().of(
        yup.object().shape({
            [ID]: yup.string().nullable(), // not shown in form, used to identify a row
            [LOAD_FILTERS]: yup
                .array()
                .of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                )
                .min(1),
            [VARIATION]: yup.number().min(0).required(),
            [ACTIVE]: yup.boolean().nullable().notRequired(),
        })
    ),
});

export const emptyFormData = {
    [CALCULATION_TYPE]: '',
    [ACCURACY]: 0,
    [LOAD_MODELS_RULE]: '',
    [LOADS_VARIATIONS]: [],
};

const params: SpecificParameterInfos[] = [
    {
        name: CALCULATION_TYPE,
        type: ParameterType.STRING,
        label: 'DynamicMarginCalculationCalculationType',
        possibleValues: [
            { id: CalculationType.GLOBAL_MARGIN, label: 'DynamicMarginCalculationCalculationTypeGlobalMargin' },
            { id: CalculationType.LOCAL_MARGIN, label: 'DynamicMarginCalculationCalculationTypeLocalMargin' },
        ],
    },
    {
        name: ACCURACY,
        type: ParameterType.DOUBLE,
        label: 'DynamicMarginCalculationAccuracy',
    },
    {
        name: LOAD_MODELS_RULE,
        type: ParameterType.STRING,
        label: 'DynamicMarginCalculationLoadModelsRule',
        possibleValues: [
            { id: LoadModelsRule.ALL_LOADS, label: 'DynamicMarginCalculationLoadModelsRuleAllLoads' },
            { id: LoadModelsRule.TARGETED_LOADS, label: 'DynamicMarginCalculationLoadModelsRuleTargetedLoads' },
        ],
    },
    // LOADS_VARIATIONS displayed in a separated component, i.e., ParameterDndTableField
];

const loadsVariationsColumnsDefinition: DndColumn[] = [
    {
        label: 'DynamicMarginCalculationLoadsFilter',
        dataKey: LOAD_FILTERS,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: [EquipmentType.LOAD],
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'DynamicMarginCalculationLoadsVariation',
        dataKey: VARIATION,
        editable: true,
        type: DndColumnType.NUMERIC,
        textAlign: 'right',
    },
    {
        label: 'DynamicMarginCalculationLoadsActive',
        initialValue: true,
        dataKey: ACTIVE,
        editable: true,
        width: 100,
        type: DndColumnType.SWITCH,
    },
];

export default function LoadsVariationsParameters({ path }: { path: string }) {
    const inlt = useIntl();
    const translatedColumnsDefinition = useMemo(() => {
        return loadsVariationsColumnsDefinition.map((colDef) => ({
            ...colDef,
            label: inlt.formatMessage({ id: colDef.label }),
        }));
    }, [inlt]);
    return (
        <>
            {params.map((param: SpecificParameterInfos) => {
                const { name, type, ...otherParams } = param;
                return <ParameterField id={path} name={param.name} type={param.type} {...otherParams} />;
            })}
            <ParameterDndTableField
                name={`${path}.${LOADS_VARIATIONS}`}
                label="DynamicMarginCalculationLoadsVariations"
                tooltipProps={{ title: 'DynamicMarginCalculationLoadsVariations' }}
                columnsDefinition={translatedColumnsDefinition}
                tableHeight={270}
            />
        </>
    );
}
