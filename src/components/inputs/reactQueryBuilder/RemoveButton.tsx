/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionWithRulesProps } from 'react-querybuilder';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useController } from 'react-hook-form';

import { useState } from 'react';
import { recursiveRemove } from '../../filter/expert/expertFilterUtils';

const EXPERT_FILTER_QUERY = 'rules';

export function RemoveButton(props: ActionWithRulesProps) {
    const { path, className, title } = props;
    const {
        field: { value: query, onChange },
    } = useController({ name: EXPERT_FILTER_QUERY });

    const [visible, setVisible] = useState(false);

    function handleDelete() {
        // We don't want groups with no rules
        // So if we have only empty subgroups above the removed rule, we want to remove all of them
        onChange(recursiveRemove(query, path));
    }

    function handleOnMouseOver() {
        setVisible(true);
    }

    function handleOnMouseOut() {
        setVisible(false);
    }

    return (
        <IconButton
            size="small"
            onClick={() => handleDelete()}
            className={className}
            title={title}
            onMouseOver={() => handleOnMouseOver()}
            onMouseOut={() => handleOnMouseOut()}
        >
            <DeleteIcon visibility={visible ? 'visible' : 'hidden'} />
        </IconButton>
    );
}
