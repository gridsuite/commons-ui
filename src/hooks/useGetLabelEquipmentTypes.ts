/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { EquipmentType, getIdOrValue, Option } from '../utils';

export function useGetLabelEquipmentTypes() {
    const intl = useIntl();
    return useMemo(
        () => (equipmentType: Option) =>
            intl.formatMessage({
                id: equipmentType === EquipmentType.HVDC_LINE ? 'Hvdc' : getIdOrValue(equipmentType),
            }),
        [intl]
    );
}
