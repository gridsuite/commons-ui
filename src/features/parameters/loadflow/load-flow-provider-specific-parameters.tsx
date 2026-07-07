/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { memo } from 'react';
import ParameterField from '../common/parameter-field';
import { SpecificParameterInfos } from '../../../utils/types/parameters.type';
import { SPECIFIC_PARAMETERS } from '../common';

interface LoadFlowProviderSpecificParametersProps {
    specificParameters?: SpecificParameterInfos[];
}

function LoadFlowProviderSpecificParameters({ specificParameters }: Readonly<LoadFlowProviderSpecificParametersProps>) {
    return (
        <>
            {specificParameters?.map((item) => (
                <ParameterField id={SPECIFIC_PARAMETERS} {...item} key={item.name} />
            ))}
        </>
    );
}

export default memo(LoadFlowProviderSpecificParameters);
