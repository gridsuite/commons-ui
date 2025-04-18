/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActionWithRulesAndAddersProps } from 'react-querybuilder';
import { Button } from '@mui/material';
import { ControlPoint as AddIcon } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

interface ActionWithRulesAndAddersWithLabelProps extends ActionWithRulesAndAddersProps {
    label: string;
}

export function AddButton(props: ActionWithRulesAndAddersWithLabelProps) {
    const { label, handleOnClick, title } = props;
    return (
        <span>
            <Button startIcon={<AddIcon />} onClick={handleOnClick} size="small" className="add-button" title={title}>
                <FormattedMessage id={label} />
            </Button>
        </span>
    );
}
