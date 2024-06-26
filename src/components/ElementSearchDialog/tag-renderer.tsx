/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import OverflowableText from '../OverflowableText';
import clsx from 'clsx';
import { EQUIPMENT_TYPE, EquipmentType } from '../../utils/EquipmentType';
import { mergeSx } from '../../utils/styles';
import { SxProps, Theme } from '@mui/material';

interface TagRendererProps {
    props: {
        classes?: {
            equipmentTag?: string;
            equipmentVlTag?: string;
        };
        styles?: {
            equipmentTag?: SxProps<Theme>;
            equipmentVlTag?: SxProps<Theme>;
        };
    };
    element: {
        type: EquipmentType;
        voltageLevelLabel?: string;
    };
}

export const TagRenderer = ({ props, element }: TagRendererProps) => {
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
    return <></>;
};
