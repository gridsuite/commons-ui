/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/material';
import OverflowableText from '../OverflowableText';
import { EQUIPMENT_TYPE, EquipmentType } from '../../utils/EquipmentType';
import { mergeSx } from '../../utils/styles';

interface TagRendererProps {
    element: {
        type: EquipmentType;
        voltageLevelLabel?: string;
    };
    classes?: {
        equipmentTag?: string;
        equipmentVlTag?: string;
    };
    styles?: {
        equipmentTag?: SxProps<Theme>;
        equipmentVlTag?: SxProps<Theme>;
    };
}

function TagRenderer({ element, ...props }: TagRendererProps) {
    if (
        element.type !== EQUIPMENT_TYPE.SUBSTATION?.name &&
        element.type !== EQUIPMENT_TYPE.VOLTAGE_LEVEL?.name
    ) {
        return (
            <OverflowableText
                text={element.voltageLevelLabel}
                className={clsx(
                    props.classes?.equipmentTag,
                    props.classes?.equipmentVlTag
                )}
                sx={mergeSx(
                    props.styles?.equipmentTag,
                    props.styles?.equipmentVlTag
                )}
            />
        );
    }
    return null;
}

export default TagRenderer;
