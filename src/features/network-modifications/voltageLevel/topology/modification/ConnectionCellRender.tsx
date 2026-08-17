/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { CheckboxNullableInput } from '../../../../../components';

type ConnectionCellRendererProps = {
    name: string;
};

export function ConnectionCellRenderer({ name }: Readonly<ConnectionCellRendererProps>) {
    const {
        field: { value },
    } = useController({ name });
    const color = useMemo(() => {
        // turn the label in grey when no modification
        if (value === null) {
            return 'grey';
        }
        return '';
    }, [value]);

    const getLabel = useCallback(
        (checked: boolean | null) => {
            if (checked === null) {
                return 'NoModification' ;
            }
            return  checked ? 'Closed' : 'Open' ;
        },
        []
    );

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckboxNullableInput name={name} label={getLabel} style={{ color }} />
        </div>
    );
}
