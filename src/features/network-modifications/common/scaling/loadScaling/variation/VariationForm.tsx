/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { useWatch } from 'react-hook-form';
import {
    ACTIVE_VARIATION_MODES,
    ActivePowerAdornment,
    ElementType,
    EquipmentType,
    FieldConstants,
    REACTIVE_VARIATION_MODES,
    VARIATION_TYPES,
} from '../../../../../../utils';
import { IDENTIFIER_LIST, ItemFilterType, VariationType } from '../../common/variation.type';
import { DirectoryItemsInput, FloatInput, GridItem, SelectInput } from '../../../../../../components';

const LOADS = [EquipmentType.LOAD];

interface LoadScalingVariationFormProps {
    name: string;
    index: number;
}

export function VariationForm({ name, index }: LoadScalingVariationFormProps) {
    const variationMode = useWatch({
        name: `${name}.${index}.${FieldConstants.VARIATION_MODE}`,
    });

    const variationType = useWatch({
        name: FieldConstants.VARIATION_TYPE,
    }) as VariationType;

    const itemFilter = useCallback(
        (value: ItemFilterType) => {
            if (value?.type === ElementType.FILTER && variationMode === ACTIVE_VARIATION_MODES.VENTILATION.id) {
                return !!(
                    value?.specificMetadata?.type === IDENTIFIER_LIST &&
                    value?.specificMetadata?.filterEquipmentsAttributes?.every((filter) => !!filter.distributionKey)
                );
            }

            return true;
        },
        [variationMode]
    );

    const filtersField = (
        <DirectoryItemsInput
            name={`${name}.${index}.${FieldConstants.FILTERS}`}
            equipmentTypes={LOADS}
            elementType={ElementType.FILTER}
            label="filter"
            titleId="FiltersListsSelection"
            itemFilter={itemFilter}
        />
    );

    const variationModeField = (
        <SelectInput
            name={`${name}.${index}.${FieldConstants.VARIATION_MODE}`}
            label="VariationMode"
            options={Object.values(ACTIVE_VARIATION_MODES)}
            size="small"
            disableClearable
        />
    );

    const variationValueField = (
        <FloatInput
            name={`${name}.${index}.${FieldConstants.VARIATION_VALUE}`}
            label={VARIATION_TYPES[variationType].label}
            adornment={ActivePowerAdornment}
        />
    );

    const reactiveVariationModeField = (
        <SelectInput
            name={`${name}.${index}.${FieldConstants.REACTIVE_VARIATION_MODE}`}
            label="ReactiveVariationMode"
            options={Object.values(REACTIVE_VARIATION_MODES)}
            size="small"
            disableClearable
        />
    );

    return (
        <>
            <GridItem size={3.25}>{filtersField}</GridItem>
            <GridItem size={1.75}>{variationValueField}</GridItem>
            <GridItem size={3}>{variationModeField}</GridItem>
            <GridItem size={3}>{reactiveVariationModeField}</GridItem>
        </>
    );
}
