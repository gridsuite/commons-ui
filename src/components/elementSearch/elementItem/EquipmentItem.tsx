/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';
import { Box } from '@mui/material';
import { ALL_EQUIPMENTS, EquipmentInfos } from '../../../utils/types/equipmentType';
import { TagRenderer } from '../tagRenderer/TagRenderer';
import { OverflowableText } from '../../overflowableText';
import { mergeSx, type SxStyle } from '../../../utils/styles';

export interface EquipmentItemProps {
    inputValue: string;
    suffixRenderer?: typeof TagRenderer;
    element: EquipmentInfos;
    showsJustText?: boolean;
    classes?: {
        result?: string;
        equipmentOption?: string;
        equipmentTag?: string;
        equipmentTypeTag?: string;
        equipmentVlTag?: string;
    };
    styles?: {
        result?: SxStyle;
        equipmentOption?: SxStyle;
        equipmentTag?: SxStyle;
        equipmentTypeTag?: SxStyle;
        equipmentVlTag?: SxStyle;
    };
}

export function EquipmentItem({
    inputValue,
    suffixRenderer = TagRenderer,
    element,
    showsJustText = false,
    ...props
}: EquipmentItemProps) {
    const matches = match(element.label, inputValue, {
        insideWords: true,
        findAllOccurrences: true,
    });
    const parts = parse(element.label, matches);
    /* override li.key otherwise it will use label which could be duplicated */
    return (
        <li key={element.key} {...props}>
            <Box className={props.classes?.equipmentOption} sx={props.styles?.equipmentOption}>
                {!showsJustText && (
                    <Box
                        component="span"
                        className={clsx(props.classes?.equipmentTag, props.classes?.equipmentTypeTag)}
                        sx={mergeSx(props.styles?.equipmentTag, props.styles?.equipmentTypeTag)}
                    >
                        <FormattedMessage id={ALL_EQUIPMENTS[element.type]?.tagLabel} />
                    </Box>
                )}
                <OverflowableText
                    text={parts.map((e) => e.text).join()}
                    className={props.classes?.result}
                    sx={props.styles?.result}
                >
                    {parts.map((part) => (
                        <span
                            key={`${part.text}-${part.highlight}`}
                            style={{
                                fontWeight: part.highlight ? 'bold' : 'inherit',
                            }}
                        >
                            {part.text}
                        </span>
                    ))}
                </OverflowableText>
                {!showsJustText && suffixRenderer({ element, ...props })}
            </Box>
        </li>
    );
}
