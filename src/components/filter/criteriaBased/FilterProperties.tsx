/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Grid from '@mui/material/Grid';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import {
    Battery,
    Generator,
    Hvdc,
    Line,
    Load,
    ShuntCompensator,
    Substation,
    TwoWindingTransfo,
    VoltageLevel,
} from '../../../utils/types/equipmentTypes';
import { areArrayElementsUnique } from '../../../utils/functions';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import yup from '../../../utils/yupConfig';
import { FilterFreeProperties, FreePropertiesTypes } from './FilterFreeProperties';
import { PROPERTY_NAME, PROPERTY_VALUES, PROPERTY_VALUES_1, PROPERTY_VALUES_2 } from './FilterProperty';
import { usePredefinedProperties } from '../../../hooks/usePredefinedProperties';
import { FilterType } from '../constants/FilterConstants';
import { EquipmentType } from '../../../utils';

function propertyValuesTest(
    values: (string | undefined)[] | undefined,
    context: yup.TestContext<yup.AnyObject>,
    doublePropertyValues: boolean
) {
    // with context.from[length - 1], we can access to the root fields of the form
    const rootLevelForm = context.from![context.from!.length - 1];
    const filterType = rootLevelForm.value[FieldConstants.FILTER_TYPE];
    if (filterType !== FilterType.CRITERIA_BASED.id) {
        // we don't test if we are not in a criteria based form
        return true;
    }
    const equipmentType = rootLevelForm.value[FieldConstants.EQUIPMENT_TYPE];
    const isForLineOrHvdcLine = equipmentType === Line.type || equipmentType === Hvdc.type;
    if (doublePropertyValues) {
        return isForLineOrHvdcLine ? values?.length! > 0 : true;
    }
    return isForLineOrHvdcLine || values?.length! > 0;
}

export const filterPropertiesYupSchema = {
    [FreePropertiesTypes.SUBSTATION_FILTER_PROPERTIES]: yup
        .array()
        .of(
            yup.object().shape({
                [PROPERTY_NAME]: yup.string().required(),
                [PROPERTY_VALUES]: yup
                    .array()
                    .of(yup.string())
                    .test('can not be empty if not line', 'YupRequired', (values, context) =>
                        propertyValuesTest(values, context, false)
                    ),
                [PROPERTY_VALUES_1]: yup
                    .array()
                    .of(yup.string())
                    .test('can not be empty if line', 'YupRequired', (values, context) =>
                        propertyValuesTest(values, context, true)
                    ),
                [PROPERTY_VALUES_2]: yup
                    .array()
                    .of(yup.string())
                    .test('can not be empty if line', 'YupRequired', (values, context) =>
                        propertyValuesTest(values, context, true)
                    ),
            })
        )
        .test('distinct names', 'filterPropertiesNameUniquenessError', (properties, context) => {
            // with context.from[length - 1], we can access to the root fields of the form
            const rootLevelForm = context.from![context.from!.length - 1];
            const filterType = rootLevelForm.value[FieldConstants.FILTER_TYPE];
            if (filterType !== FilterType.CRITERIA_BASED.id) {
                // we don't test if we are not in a criteria based form
                return true;
            }
            const names = properties! // never null / undefined
                .filter((prop) => !!prop[PROPERTY_NAME])
                .map((prop) => prop[PROPERTY_NAME]);
            return areArrayElementsUnique(names);
        }),
    [FreePropertiesTypes.FREE_FILTER_PROPERTIES]: yup
        .array()
        .of(
            yup.object().shape({
                [PROPERTY_NAME]: yup.string().required(),
                [PROPERTY_VALUES]: yup
                    .array()
                    .of(yup.string())
                    .test('can not be empty if not line', 'YupRequired', (values, context) =>
                        propertyValuesTest(values, context, false)
                    ),
            })
        )
        .test('distinct names', 'filterPropertiesNameUniquenessError', (properties, context) => {
            // with context.from[length - 1], we can access to the root fields of the form
            const rootLevelForm = context.from![context.from!.length - 1];
            const filterType = rootLevelForm.value[FieldConstants.FILTER_TYPE];
            if (filterType !== FilterType.CRITERIA_BASED.id) {
                // we don't test if we are not in a criteria based form
                return true;
            }
            const names = properties! // never null / undefined
                .filter((prop) => !!prop[PROPERTY_NAME])
                .map((prop) => prop[PROPERTY_NAME]);
            return areArrayElementsUnique(names);
        }),
};

export function FilterProperties() {
    const watchEquipmentType = useWatch({
        name: FieldConstants.EQUIPMENT_TYPE,
    });
    const [equipmentPredefinedProps, setEquipmentType] = usePredefinedProperties(watchEquipmentType);
    const [substationPredefinedProps, setSubstationType] = usePredefinedProperties(null);

    const displayEquipmentProperties = useMemo(() => {
        return (
            watchEquipmentType === Substation.type ||
            watchEquipmentType === Load.type ||
            watchEquipmentType === Generator.type ||
            watchEquipmentType === Line.type ||
            watchEquipmentType === TwoWindingTransfo.type ||
            watchEquipmentType === Battery.type ||
            watchEquipmentType === ShuntCompensator.type ||
            watchEquipmentType === VoltageLevel.type
        );
    }, [watchEquipmentType]);

    const displaySubstationProperties = useMemo(() => {
        return watchEquipmentType !== Substation.type && watchEquipmentType !== null;
    }, [watchEquipmentType]);

    useEffect(() => {
        if (displayEquipmentProperties) {
            setEquipmentType(watchEquipmentType);
        }
    }, [displayEquipmentProperties, watchEquipmentType, setEquipmentType]);
    useEffect(() => {
        if (displaySubstationProperties) {
            setSubstationType(EquipmentType.SUBSTATION);
        }
    }, [displaySubstationProperties, setSubstationType]);

    return (
        watchEquipmentType && (
            <Grid item container spacing={1}>
                <Grid item xs={12}>
                    <FormattedMessage id="FreePropsCrit">{(txt) => <h3>{txt}</h3>}</FormattedMessage>
                    {displayEquipmentProperties && (
                        <FilterFreeProperties
                            freePropertiesType={FreePropertiesTypes.FREE_FILTER_PROPERTIES}
                            predefined={equipmentPredefinedProps}
                        />
                    )}
                    {displaySubstationProperties && (
                        <FilterFreeProperties
                            freePropertiesType={FreePropertiesTypes.SUBSTATION_FILTER_PROPERTIES}
                            predefined={substationPredefinedProps}
                        />
                    )}
                </Grid>
            </Grid>
        )
    );
}
