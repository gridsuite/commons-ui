/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { MAPPING } from './mapping-parameters-constants';
import { ElementType } from '../../../../utils';
import { ParameterLineDirectoryItemsInput } from '../../common';

interface MappingParametersProps {
    path: string;
}

export function MappingParameters({ path }: Readonly<MappingParametersProps>) {
    return (
        <Grid container>
            <ParameterLineDirectoryItemsInput
                name={`${path}.${MAPPING}`}
                elementType={ElementType.DYNAMIC_MAPPING}
                label="DynamicSimulationMapping"
                hideErrorMessage
            />
        </Grid>
    );
}
