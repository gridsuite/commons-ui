/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Grid, SxProps } from '@mui/material';
import { array, boolean, number, object, string } from 'yup';
import {
    ACCURACY,
    ACTIVE,
    CALCULATION_TYPE,
    LOAD_FILTERS,
    LOAD_MODELS_RULE,
    LOADS_VARIATIONS,
    VARIATION,
} from './constants';
import {
    CalculationType,
    ElementType,
    EquipmentType,
    ID,
    LoadModelsRule,
    ParameterType,
    SpecificParameterInfos,
} from '../../../utils';
import ParameterField from '../common/parameter-field';
import { NAME } from '../../inputs';
import ParameterDndTableField from '../common/parameter-dnd-table-field';
import { DndColumn, DndColumnType } from '../../dnd-table';

export const formSchema = object().shape({
    [CALCULATION_TYPE]: string().required(),
    [ACCURACY]: number().required(),
    [LOAD_MODELS_RULE]: string().required(),
    [LOADS_VARIATIONS]: array().of(
        object().shape({
            [ID]: string().nullable(), // not shown in form, used to identify a row
            [LOAD_FILTERS]: array()
                .of(
                    object().shape({
                        [ID]: string().required(),
                        [NAME]: string().nullable().notRequired(),
                    })
                )
                .min(1),
            [VARIATION]: number().min(0).required(),
            [ACTIVE]: boolean().nullable().notRequired(),
        })
    ),
});

export const emptyFormData = {
    [CALCULATION_TYPE]: '',
    [ACCURACY]: 0,
    [LOAD_MODELS_RULE]: '',
    [LOADS_VARIATIONS]: [],
};

const params: (SpecificParameterInfos & { sx?: SxProps })[] = [
    {
        name: CALCULATION_TYPE,
        type: ParameterType.STRING,
        label: 'DynamicMarginCalculationCalculationType',
        possibleValues: [
            { id: CalculationType.GLOBAL_MARGIN, label: 'DynamicMarginCalculationCalculationTypeGlobalMargin' },
            { id: CalculationType.LOCAL_MARGIN, label: 'DynamicMarginCalculationCalculationTypeLocalMargin' },
        ],
        sx: { width: '100%' },
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
        sx: { width: '100%' },
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

export default function LoadsVariationsParameters({ path }: Readonly<{ path: string }>) {
    const inlt = useIntl();
    const translatedColumnsDefinition = useMemo(() => {
        return loadsVariationsColumnsDefinition.map((colDef) => ({
            ...colDef,
            label: inlt.formatMessage({ id: colDef.label }),
        }));
    }, [inlt]);
    return (
        <Grid container>
            {params.map((param: SpecificParameterInfos) => {
                const { name, type, ...otherParams } = param;
                return (
                    <ParameterField key={param.name} id={path} name={param.name} type={param.type} {...otherParams} />
                );
            })}
            <ParameterDndTableField
                name={`${path}.${LOADS_VARIATIONS}`}
                label="DynamicMarginCalculationLoadsVariations"
                tooltipProps={{ title: 'DynamicMarginCalculationLoadsVariations' }}
                columnsDefinition={translatedColumnsDefinition}
                tableHeight={270}
            />
        </Grid>
    );
}
