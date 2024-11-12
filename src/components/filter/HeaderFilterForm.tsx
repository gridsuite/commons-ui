/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { UUID } from 'crypto';
import { FieldConstants } from '../../utils/constants/fieldConstants';
import { FilterType } from './constants/FilterConstants';
import { UniqueNameInput } from '../inputs/reactHookForm/text/UniqueNameInput';
import { ElementExistsType, ElementType } from '../../utils/types/elementType';
import { DescriptionField } from '../inputs/reactHookForm/text/DescriptionField';
import { RadioInput } from '../inputs/reactHookForm/booleans/RadioInput';

export interface FilterFormProps {
    creation?: boolean;
    activeDirectory?: UUID;
    elementExists?: ElementExistsType;
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
    handleFilterTypeChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
}

export function HeaderFilterForm({
    sourceFilterForExplicitNamingConversion,
    creation,
    activeDirectory,
    elementExists,
    handleFilterTypeChange,
}: Readonly<FilterFormProps>) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <UniqueNameInput
                    name={FieldConstants.NAME}
                    label="nameProperty"
                    elementType={ElementType.FILTER}
                    autoFocus={creation}
                    activeDirectory={activeDirectory}
                    elementExists={elementExists}
                />
            </Grid>
            {creation && (
                <>
                    <Grid item xs={12}>
                        <DescriptionField />
                    </Grid>
                    {!sourceFilterForExplicitNamingConversion && (
                        <Grid item>
                            <RadioInput
                                name={FieldConstants.FILTER_TYPE}
                                options={Object.values(FilterType)}
                                formProps={{ onChange: handleFilterTypeChange }} // need to override this in order to do not activate the validate button when changing the filter type
                            />
                        </Grid>
                    )}
                </>
            )}
        </Grid>
    );
}
