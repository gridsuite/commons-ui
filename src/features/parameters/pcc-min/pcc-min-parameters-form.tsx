/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid, LinearProgress } from '@mui/material';
import { ParameterLineDirectoryItemsInput } from '../common/widget/parameter-line-directory-items-input.js';
import { ElementType, EquipmentType } from '../../../utils';
import { UsePccMinParametersFormReturn } from './use-pcc-min-parameters-form';
import { FILTERS } from '../../../utils/constants/filterConstant';
import { parametersStyles } from '../parameters-style';

interface PccMinParametersFormProps {
    pccMinMethods: UsePccMinParametersFormReturn;
}

export function PccMinParametersForm({ pccMinMethods }: Readonly<PccMinParametersFormProps>) {
    const { paramsLoading } = pccMinMethods;

    if (paramsLoading) {
        return <LinearProgress />;
    }

    return (
        <Grid container sx={parametersStyles.scrollableGrid}>
            <Grid item xs={12}>
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
