/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Grid } from '@mui/material';
import { UUID } from 'crypto';
import FieldConstants from '../../utils/field-constants';
import CriteriaBasedFilterForm from './criteria-based/criteria-based-filter-form';
import ExplicitNamingFilterForm from './explicit-naming/explicit-naming-filter-form';
import ExpertFilterForm from './expert/expert-filter-form';
import { FilterType } from './constants/filter-constants';
import RadioInput from '../inputs/react-hook-form/radio-input';
import { ElementExistsType, ElementType } from '../../utils/ElementType';
import UniqueNameInput from '../inputs/react-hook-form/unique-name-input';
import DescriptionField from '../inputs/react-hook-form/description-field';

interface FilterFormProps {
    creation?: boolean;
    activeDirectory?: UUID;
    elementExists?: ElementExistsType;
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
}

function HeaderFilterForm(props: FilterFormProps) {
    const { sourceFilterForExplicitNamingConversion, creation, activeDirectory, elementExists } = props;

    const { setValue } = useFormContext();

    useEffect(() => {
        if (sourceFilterForExplicitNamingConversion) {
            setValue(FieldConstants.FILTER_TYPE, FilterType.EXPLICIT_NAMING.id);
        }
    }, [sourceFilterForExplicitNamingConversion, setValue]);

    // We do this because setValue don't set the field dirty
    const handleChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setValue(FieldConstants.FILTER_TYPE, value);
    };

    return (
        <>
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
                                formProps={{ onChange: handleChange }} // need to override this in order to do not activate the validate button when changing the filter type
                            />
                        </Grid>
                    )}
                </>
            )}
        </>
    );
}

function FilterForm(props: FilterFormProps) {
    const { sourceFilterForExplicitNamingConversion, creation, activeDirectory, elementExists } = props;

    const filterType = useWatch({ name: FieldConstants.FILTER_TYPE });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <HeaderFilterForm
                    creation={creation}
                    activeDirectory={activeDirectory}
                    elementExists={elementExists}
                    sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
                />
            </Grid>
            <Grid item xs={12}>
                {filterType === FilterType.CRITERIA_BASED.id && <CriteriaBasedFilterForm />}
                {filterType === FilterType.EXPLICIT_NAMING.id && (
                    <ExplicitNamingFilterForm
                        sourceFilterForExplicitNamingConversion={sourceFilterForExplicitNamingConversion}
                    />
                )}
                {filterType === FilterType.EXPERT.id && <ExpertFilterForm />}
            </Grid>
        </Grid>
    );
}

export default FilterForm;
