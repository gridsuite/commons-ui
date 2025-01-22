/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueSelectorProps } from 'react-querybuilder';
import { MaterialValueSelector } from '@react-querybuilder/material';
import { useSelectAppearance } from './useSelectAppearance';

const ITEM_HEIGHT = 32; // default value from React query builder defaultNativeSelectStyles that can't be accessed
const ITEM_PADDING = 4;
const ITEMS_COUNT = 10;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: (ITEM_HEIGHT + ITEM_PADDING) * ITEMS_COUNT + ITEM_PADDING,
        },
    },
};

export function FieldSelector(props: Readonly<ValueSelectorProps>) {
    const { options } = props;
    return <MaterialValueSelector {...props} MenuProps={MenuProps} {...useSelectAppearance(options.length)} />;
}
