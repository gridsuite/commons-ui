/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SelectInput } from '../../../../components';
import { Option } from '../../../../utils';
import { PROCESS_CONFIG_TYPES } from '../../common/process-config-form.constants';

type ProcessTypeSelectProps = {
    onCheckNewValue: (value: Option | null) => boolean;
};

export function ProcessTypeSelect({ onCheckNewValue }: Readonly<ProcessTypeSelectProps>) {
    return (
        <SelectInput
            name="processType"
            label="processType"
            options={PROCESS_CONFIG_TYPES}
            onCheckNewValue={onCheckNewValue}
            fullWidth
            size="small"
        />
    );
}
