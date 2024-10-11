/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { HeaderFilterForm, FilterFormProps } from './HeaderFilterForm';
import { FieldConstants } from '../../utils/constants/fieldConstants';
import { CriteriaBasedFilterForm } from './criteriaBased/CriteriaBasedFilterForm';
import { ExplicitNamingFilterForm } from './explicitNaming/ExplicitNamingFilterForm';
import { ExpertFilterForm } from './expert/ExpertFilterForm';
import { FilterType } from './constants/FilterConstants';

const styles = {
    FillerContainer: {
        height: '100%',
        '&::before': {
            content: '""',
            height: '100%',
            float: 'left',
        },
    },
};

export function FilterForm({
    sourceFilterForExplicitNamingConversion,
    creation,
    activeDirectory,
    elementExists,
}: Readonly<FilterFormProps>) {
    const filterType = useWatch({ name: FieldConstants.FILTER_TYPE });

    return (
        <Box sx={styles.FillerContainer}>
            <HeaderFilterForm
                creation={creation}
                activeDirectory={activeDirectory}
                elementExists={elementExists}
                sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
            />
            {filterType === FilterType.CRITERIA_BASED.id && <CriteriaBasedFilterForm />}
            {filterType === FilterType.EXPLICIT_NAMING.id && (
                <ExplicitNamingFilterForm
                    sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
                />
            )}
            {filterType === FilterType.EXPERT.id && <ExpertFilterForm />}
        </Box>
    );
}
