/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { ParameterType, SpecificParameterInfos } from '../../../../utils/types/parameters.type';
import { MappingInfos } from '../../../../utils/types/dynamic-simulation.type';
import ParameterField from '../../common/parameter-field';
import { MAPPING } from './mapping-parameters-constants';
import { getDynamicMappings } from '../../../../services';
import { snackWithFallback } from '../../../../utils';
import { useSnackMessage } from '../../../../hooks';

interface MappingParametersProps {
    path: string;
}

export function MappingParameters({ path }: Readonly<MappingParametersProps>) {
    const { snackError } = useSnackMessage();
    const [mappings, setMappings] = useState<MappingInfos[]>([]);

    useEffect(() => {
        getDynamicMappings()
            .then((_mappings) => {
                setMappings(_mappings);
            })
            .catch((error: Error) => {
                snackWithFallback(snackError, error, {
                    headerId: `DynamicSimulationMappingsError`,
                });
            });
    }, [setMappings, snackError]);

    const mappingOptions = useMemo(() => {
        return mappings?.map((elem) => elem.name) ?? [];
    }, [mappings]);

    const params: SpecificParameterInfos[] = useMemo(
        () => [
            {
                name: MAPPING,
                type: ParameterType.STRING,
                label: 'DynamicSimulationMapping',
                possibleValues: mappingOptions,
                sx: { width: '100%' },
            },
        ],
        [mappingOptions]
    );

    return (
        <Grid container>
            {params.map((param: SpecificParameterInfos) => {
                const { name, type, ...otherParams } = param;
                return (
                    <ParameterField key={param.name} id={path} name={param.name} type={param.type} {...otherParams} />
                );
            })}
        </Grid>
    );
}
