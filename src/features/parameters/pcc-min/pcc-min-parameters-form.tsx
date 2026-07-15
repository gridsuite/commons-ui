/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { ParameterLineDirectoryItemsInput } from '../common/widget/parameter-line-directory-items-input.js';
import { ElementType, EquipmentType } from '../../../utils';
import { FILTERS } from '../../../utils/constants/filterConstant';
import { parametersStyles } from '../parameters-style';

export function PccMinParametersForm() {
    return (
        <Grid container sx={parametersStyles.scrollableGrid}>
            <Grid size={12}>
                <ParameterLineDirectoryItemsInput
                    name={FILTERS}
                    equipmentTypes={[EquipmentType.VOLTAGE_LEVEL]}
                    elementType={ElementType.FILTER}
                    label="pccMinParamFilter"
                    hideErrorMessage={false}
                    allowMultiSelect={false}
                />
            </Grid>
        </Grid>
    );
}
