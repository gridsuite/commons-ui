/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { UUID } from 'node:crypto';
import {
    ActivePowerAdornment,
    ElementAttributes,
    ElementType,
    EquipmentType,
    FieldConstants,
    snackWithFallback,
    VARIATION_MODES,
    VARIATION_TYPES,
} from '../../../../utils';
import { DirectoryItemsInput, FloatInput, GridItem, SelectInput } from '../../../../components';
import { IDENTIFIER_LIST, ItemFilterType, VariationType } from '../common';
import { useSnackMessage } from '../../../../hooks';
import { fetchElementsInfos } from '../../../../services';

const GENERATORS = [EquipmentType.GENERATOR];

interface GeneratorScalingVariationFormProps {
    name: string;
    index: number;
}

export function GeneratorScalingVariationForm({ name, index }: GeneratorScalingVariationFormProps) {
    const { snackError } = useSnackMessage();
    const filterFieldName = useMemo(() => `${name}.${index}.${FieldConstants.FILTERS}`, [name, index]);

    const variationMode = useWatch({
        name: `${name}.${index}.${FieldConstants.VARIATION_MODE}`,
    });

    const filters = useWatch({
        name: filterFieldName,
    });

    const variationType = useWatch({
        name: FieldConstants.VARIATION_TYPE,
    }) as VariationType;

    const { setValue } = useFormContext();

    const updateMetadata = useCallback(
        (filtersWithoutMetadata: ElementAttributes[]) => {
            const ids = filtersWithoutMetadata.filter((f) => f.id !== undefined).map((f) => f.id as UUID);
            fetchElementsInfos(ids, [], [])
                .then((results) => {
                    const newFilters = filters.map((filter: ElementAttributes) => {
                        const filterWithMetadata = results.find((f) => f.elementUuid === filter.id);
                        if (filterWithMetadata) {
                            return {
                                [FieldConstants.ID]: filterWithMetadata.elementUuid,
                                [FieldConstants.NAME]: filterWithMetadata.elementName,
                                [FieldConstants.SPECIFIC_METADATA]: filterWithMetadata.specificMetadata,
                            };
                        }
                        return filter;
                    });
                    setValue(filterFieldName, newFilters);
                })
                .catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'GeneratorScalingError' });
                });
        },
        [filterFieldName, filters, setValue, snackError]
    );

    useEffect(() => {
        // When editing the modification, filters does not have specific metadata which contains filter type
        // If variation mode is STACKING_UP or VENTILATION, all filters types must be 'explicit naming'
        if (
            (variationMode === VARIATION_MODES.STACKING_UP.id || variationMode === VARIATION_MODES.VENTILATION.id) &&
            filters.length > 0
        ) {
            // collect all filters without metadata
            const filtersWithoutMetadata = filters.filter((filter: ElementAttributes) => {
                return !filter?.specificMetadata;
            });

            if (filtersWithoutMetadata.length > 0) {
                updateMetadata(filtersWithoutMetadata);
            }
        }
    }, [variationMode, filters, updateMetadata]);

    const itemFilter = useCallback(
        (value: ItemFilterType) => {
            if (value?.type === ElementType.FILTER) {
                if (variationMode === VARIATION_MODES.STACKING_UP.id) {
                    return value?.specificMetadata?.type === IDENTIFIER_LIST;
                }

                if (variationMode === VARIATION_MODES.VENTILATION.id) {
                    return !!(
                        value?.specificMetadata?.type === IDENTIFIER_LIST &&
                        value?.specificMetadata?.filterEquipmentsAttributes?.every((fil) => !!fil.distributionKey)
                    );
                }
            }

            return true;
        },
        [variationMode]
    );

    const filtersField = (
        <DirectoryItemsInput
            name={`${name}.${index}.${FieldConstants.FILTERS}`}
            equipmentTypes={GENERATORS}
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
            options={Object.values(VARIATION_MODES)}
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

    return (
        <>
            <GridItem size={4}>{filtersField}</GridItem>
            <GridItem size={2}>{variationValueField}</GridItem>
            <GridItem size={4}>{variationModeField}</GridItem>
        </>
    );
}
