/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueSelectorProps } from 'react-querybuilder';
import { MaterialValueSelector } from '@react-querybuilder/material';
import { useSelectAppearance } from '../../../hooks';

export function OperatorSelector(props: Readonly<ValueSelectorProps>) {
    const { options } = props;
    const selectAppearance = useSelectAppearance(options?.length || 0);

    if (!options?.length) {
        return null;
    }

    return <MaterialValueSelector {...props} {...selectAppearance} sx={{ border: 'none' }} />;
}
