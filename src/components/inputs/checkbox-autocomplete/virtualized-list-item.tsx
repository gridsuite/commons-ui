/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CSSProperties, HTMLAttributes, Key } from 'react';
import type { RowComponentProps } from 'react-window';
import CheckboxItem from './checkbox-item';

// VirtualizedListItem component is customized from renderRow in the MUI example
// https://mui.com/material-ui/react-autocomplete/#virtualization

export type VirtualizedItem = [
    option: string,
    selected: boolean,
    getOptionLabel: (option: string) => string,
    itemProps?: HTMLAttributes<HTMLElement> & { key: Key; style?: CSSProperties },
];

function VirtualizedListItem({
    index,
    itemData,
    style,
}: RowComponentProps & {
    itemData: VirtualizedItem[];
}) {
    const [option, selected, getOptionLabel, itemProps] = itemData[index];

    const { key, style: itemStyle, ...restItemProps } = itemProps ?? {};
    return (
        <CheckboxItem
            option={option}
            selected={selected}
            getOptionLabel={getOptionLabel}
            style={{
                ...itemStyle,
                ...style,
            }}
            key={key}
            {...restItemProps}
        />
    );
}

export default VirtualizedListItem;
