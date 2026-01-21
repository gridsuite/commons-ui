/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import clsx from 'clsx';
import { OverflowableText } from '../../overflowableText';
import { EquipmentInfos, EquipmentType } from '../../../utils/types/equipmentType';
import { mergeSx, type SxStyle } from '../../../utils/styles';

export interface TagRendererProps {
    element: EquipmentInfos;
    classes?: {
        equipmentTag?: string;
        equipmentVlTag?: string;
    };
    styles?: {
        equipmentTag?: SxStyle;
        equipmentVlTag?: SxStyle;
    };
}

export function TagRenderer({ element, ...props }: TagRendererProps) {
    if (element.type !== EquipmentType.SUBSTATION && element.type !== EquipmentType.VOLTAGE_LEVEL) {
        return (
            <OverflowableText
                text={element.voltageLevelLabel}
                className={clsx(props.classes?.equipmentTag, props.classes?.equipmentVlTag)}
                sx={mergeSx(props.styles?.equipmentTag, props.styles?.equipmentVlTag)}
            />
        );
    }
}
