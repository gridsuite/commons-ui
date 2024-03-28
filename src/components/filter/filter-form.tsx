/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UniqueNameInput } from '../commons/unique-name-input';
import { FieldConstants } from './constants/field-constants';
import { FilterType } from './constants/field-constants';
import CriteriaBasedFilterForm from './criteria-based/criteria-based-filter-form';
import ExplicitNamingFilterForm from './explicit-naming/explicit-naming-filter-form';
import React, { FunctionComponent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import ExpertFilterForm from './expert/expert-filter-form';
import DescriptionInput from '../commons/description-modification/description-input';
import { Grid } from '@mui/material';
import RadioInput from '../react-hook-form/radio-input';
import { ElementType } from '../../utils/ElementType';

interface FilterFormProps {
    creation?: boolean;
    fetchAppsAndUrls: () => Promise<any>;
    activeDirectory?: any;
    elementExists?: (
        directory: any,
        value: string,
        elementType: ElementType
    ) => Promise<any>;
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
                        <DescriptionInput rows={5} />
                    </Grid>
                    <Grid item>
                        <RadioInput
                            name={FieldConstants.FILTER_TYPE}
                            options={Object.values(FilterType)}
                            formProps={{ onChange: handleChange }} // need to override this in order to do not activate the validate button when changing the filter type
                        />
                    </Grid>
                </>
            )}
            {filterType === FilterType.CRITERIA_BASED.id && (
                <CriteriaBasedFilterForm
                    fetchAppsAndUrls={props.fetchAppsAndUrls}
                />
            )}
            {filterType === FilterType.EXPLICIT_NAMING.id && (
                <ExplicitNamingFilterForm />
            )}
            {filterType === FilterType.EXPERT.id && <ExpertFilterForm />}
        </Grid>
    );
};
