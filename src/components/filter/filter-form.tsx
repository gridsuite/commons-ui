/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UniqueNameInput } from '../inputs/react-hook-form/unique-name-input';
import { FieldConstants } from '../../utils/field-constants';
import CriteriaBasedFilterForm from './criteria-based/criteria-based-filter-form';
import ExplicitNamingFilterForm from './explicit-naming/explicit-naming-filter-form';
import React, { FunctionComponent, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import ExpertFilterForm from './expert/expert-filter-form';
import { Grid } from '@mui/material';
import { ElementType } from '../../utils/ElementType';
import { UUID } from 'crypto';
import { elementExistsType } from './criteria-based/criteria-based-filter-edition-dialog';
import { FilterType } from './constants/filter-constants';
import ExpandableGroup from '../ExpandableGroup';
import RadioInput from '../inputs/react-hook-form/radio-input';
import ExpandingTextField from '../inputs/react-hook-form/ExpandingTextField';

interface FilterFormProps {
    creation?: boolean;
    activeDirectory?: UUID;
    elementExists?: elementExistsType;
    sourceFilterForExplicitNamingConversion?: {
        id: UUID;
        equipmentType: string;
    };
}

export const FilterForm: FunctionComponent<FilterFormProps> = (props) => {
    const { setValue } = useFormContext();

    const filterType = useWatch({ name: FieldConstants.FILTER_TYPE });

    // We do this because setValue don't set the field dirty
    const handleChange = (
        _event: React.ChangeEvent<HTMLInputElement>,
        value: string
    ) => {
        setValue(FieldConstants.FILTER_TYPE, value);
    };

    useEffect(() => {
        if (props.sourceFilterForExplicitNamingConversion) {
            setValue(FieldConstants.FILTER_TYPE, FilterType.EXPLICIT_NAMING.id);
        }
    }, [props.sourceFilterForExplicitNamingConversion, setValue]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <UniqueNameInput
                    name={FieldConstants.NAME}
                    label={'nameProperty'}
                    elementType={ElementType.FILTER}
                    autoFocus={props.creation}
                    activeDirectory={props.activeDirectory}
                    elementExists={props.elementExists}
                />
            </Grid>
            {props.creation && (
                <>
                    <Grid item xs={12}>
                        <ExpandableGroup renderHeader={'inputs/description'}>
                            <ExpandingTextField
                                name={FieldConstants.DESCRIPTION}
                                label={'inputs/descriptionProperty'}
                                minRows={3}
                                rows={5}
                            />
                        </ExpandableGroup>
                    </Grid>
                    {!props.sourceFilterForExplicitNamingConversion && (
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
            {filterType === FilterType.CRITERIA_BASED.id && (
                <CriteriaBasedFilterForm />
            )}
            {filterType === FilterType.EXPLICIT_NAMING.id && (
                <ExplicitNamingFilterForm
                    sourceFilterForExplicitNamingConversion={
                        props.sourceFilterForExplicitNamingConversion
                    }
                />
            )}
            {filterType === FilterType.EXPERT.id && <ExpertFilterForm />}
        </Grid>
    );
};
