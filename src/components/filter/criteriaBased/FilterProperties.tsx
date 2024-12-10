/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Hvdc, Line } from '../../../utils/types/equipmentTypes';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import yup from '../../../utils/yupConfig';
import { PROPERTY_NAME, PROPERTY_VALUES, PROPERTY_VALUES_1, PROPERTY_VALUES_2 } from './FilterProperty';

function propertyValuesTest(
    values: (string | undefined)[] | undefined,
    context: yup.TestContext<yup.AnyObject>,
    doublePropertyValues: boolean
) {
    // with context.from[length - 1], we can access to the root fields of the form
    const rootLevelForm = context.from![context.from!.length - 1];
    const equipmentType = rootLevelForm.value[FieldConstants.EQUIPMENT_TYPE];
    const isForLineOrHvdcLine = equipmentType === Line.type || equipmentType === Hvdc.type;
    if (doublePropertyValues) {
        return isForLineOrHvdcLine ? values?.length! > 0 : true;
    }
    return isForLineOrHvdcLine || values?.length! > 0;
}
yup.array().of(
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
);
yup.array().of(
    yup.object().shape({
        [PROPERTY_NAME]: yup.string().required(),
        [PROPERTY_VALUES]: yup
            .array()
            .of(yup.string())
            .test('can not be empty if not line', 'YupRequired', (values, context) =>
                propertyValuesTest(values, context, false)
            ),
    })
);
