/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionWithRulesProps } from 'react-querybuilder';
import { useController } from 'react-hook-form';

import { recursiveRemove } from '../../filter/expert/expertFilterUtils';
import { IconButton } from '@design-system-rte/react';

const EXPERT_FILTER_QUERY = 'rules';

export function RemoveButton(props: ActionWithRulesProps) {
    const { path } = props;
    const {
        field: { value: query, onChange },
    } = useController({ name: EXPERT_FILTER_QUERY });

    function handleDelete() {
        // We don't want groups with no rules
        // So if we have only empty subgroups above the removed rule, we want to remove all of them
        onChange(recursiveRemove(query, path));
    }

    return <IconButton name="delete" size="m" onClick={() => handleDelete()} variant="transparent" />;
}
