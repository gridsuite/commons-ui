/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { UUID } from 'node:crypto';
import { HeaderFilterForm } from './HeaderFilterForm';
import { ExplicitNamingFilterForm } from './explicitNaming/ExplicitNamingFilterForm';
import { ExpertFilterForm } from './expert/ExpertFilterForm';
import { FilterType } from './constants/FilterConstants';
import { unscrollableDialogStyles } from '../dialogs';

export interface FilterFormProps {
    creation?: boolean;
    activeDirectory?: UUID;
    filterType?: { id: string; label: string };
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
    isEditing: boolean;
}

export function FilterForm({
    sourceFilterForExplicitNamingConversion,
    creation,
    activeDirectory,
    filterType,
    isEditing,
}: Readonly<FilterFormProps>) {
    return (
        <>
            <Box sx={unscrollableDialogStyles.unscrollableHeader}>
                <HeaderFilterForm creation={creation} activeDirectory={activeDirectory} />
            </Box>
            {filterType?.id === FilterType.EXPLICIT_NAMING.id && (
                <ExplicitNamingFilterForm
                    sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
                    isEditing={isEditing}
                />
            )}
            {filterType?.id === FilterType.EXPERT.id && <ExpertFilterForm isEditing={isEditing} />}
        </>
    );
}
