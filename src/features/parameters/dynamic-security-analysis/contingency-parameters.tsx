/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { ParameterLineDirectoryItemsInput } from '../common';
import { ElementType, ParameterType, SpecificParameterInfos } from '../../../utils';
import { CONTINGENCIES_LIST_INFOS, CONTINGENCIES_START_TIME } from './constants';
import ParameterField from '../common/parameter-field';

const params: SpecificParameterInfos[] = [
    {
        name: CONTINGENCIES_START_TIME,
        type: ParameterType.DOUBLE,
        label: 'DynamicSecurityAnalysisContingenciesStartTime',
    },
];

function ContingencyParameters({ path }: Readonly<{ path: string }>) {
    return (
        <Grid container>
            {params.map((param: SpecificParameterInfos) => {
                const { name, type, ...otherParams } = param;
                return (
                    <ParameterField key={param.name} id={path} name={param.name} type={param.type} {...otherParams} />
                );
            })}
            <ParameterLineDirectoryItemsInput
                name={`${path}.${CONTINGENCIES_LIST_INFOS}`}
                elementType={ElementType.CONTINGENCY_LIST}
                label="ContingencyListsSelection"
                hideErrorMessage
            />
        </Grid>
    );
}

export default ContingencyParameters;
