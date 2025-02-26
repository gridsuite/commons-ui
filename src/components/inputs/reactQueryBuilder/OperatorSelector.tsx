/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueSelectorProps } from 'react-querybuilder';
import { FieldType } from '../../../utils';
import { MaterialValueSelector } from '@react-querybuilder/material';
import { useSelectAppearance } from '../../../hooks';

export function OperatorSelector(props: ValueSelectorProps) {
    const { field, options} = props;
    if (field === FieldType.FREE_PROPERTIES) {
        return () => null;
    }
    return <MaterialValueSelector {...props} {...useSelectAppearance(options.length)} sx={{ border: 'none' }} />;
}
