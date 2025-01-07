/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import clsx from 'clsx';
import { OverflowableText } from '../../overflowableText';
import { EQUIPMENT_TYPE, EquipmentInfos } from '../../../utils/types/equipmentType';
import { mergeSx, MuiStyle } from '../../../utils/styles';

export interface TagRendererProps {
    element: EquipmentInfos;
    classes?: {
        equipmentTag?: string;
        equipmentVlTag?: string;
    };
    styles?: {
        equipmentTag?: MuiStyle;
        equipmentVlTag?: MuiStyle;
    };
}

export function TagRenderer({ element, ...props }: TagRendererProps) {
    if (element.type !== EQUIPMENT_TYPE.SUBSTATION?.name && element.type !== EQUIPMENT_TYPE.VOLTAGE_LEVEL?.name) {
        return (
            <OverflowableText
                text={element.voltageLevelLabel}
                className={clsx(props.classes?.equipmentTag, props.classes?.equipmentVlTag)}
                sx={mergeSx(props.styles?.equipmentTag, props.styles?.equipmentVlTag)}
            />
        );
    }
}
