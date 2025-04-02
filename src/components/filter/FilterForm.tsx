/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import React from 'react';
import { FilterFormProps, HeaderFilterForm } from './HeaderFilterForm';
import { ExplicitNamingFilterForm } from './explicitNaming/ExplicitNamingFilterForm';
import { ExpertFilterForm } from './expert/ExpertFilterForm';
import { FilterType } from './constants/FilterConstants';
import { unscrollableDialogStyles } from '../dialogs';

export function FilterForm({
                               sourceFilterForExplicitNamingConversion,
                               creation,
                               activeDirectory,
                               filterType,
                           }: Readonly<FilterFormProps>) {

    return (
        <>
            <Box sx={unscrollableDialogStyles.unscrollableHeader}>
                <HeaderFilterForm
                    creation={creation}
                    activeDirectory={activeDirectory}
                    sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
                />
            </Box>
            {filterType === FilterType.EXPLICIT_NAMING.id && (
                <ExplicitNamingFilterForm
                    sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
                />
            )}
            {filterType === FilterType.EXPERT.id && <ExpertFilterForm />}
        </>
    );
}
