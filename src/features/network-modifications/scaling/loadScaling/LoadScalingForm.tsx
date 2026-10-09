/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Theme } from '@mui/material';
import { ExpandableInput, GridItem, GridSection, RadioInput } from '../../../../components';
import { ACTIVE_VARIATION_MODES, FieldConstants, VARIATION_TYPES } from '../../../../utils';
import { LoadScalingVariationForm } from './LoadScalingVariationForm';
import { getLoadScalingVariationEmptyForm } from './loadScalingVariation.utils';

const styles = {
    padding: (theme: Theme) => ({
        paddingLeft: theme.spacing(2),
    }),
};

export function LoadScalingForm() {
    const variationTypeField = (
        <RadioInput name={FieldConstants.VARIATION_TYPE} options={Object.values(VARIATION_TYPES)} />
    );

    const variationsField = (
        <ExpandableInput
            name={FieldConstants.VARIATIONS}
            Field={LoadScalingVariationForm}
            addButtonLabel="CreateVariation"
            initialValue={getLoadScalingVariationEmptyForm(ACTIVE_VARIATION_MODES.PROPORTIONAL.id)}
        />
    );

    return (
        <>
            <Grid sx={styles.padding}>
                <GridItem size={8}>{variationTypeField}</GridItem>{' '}
            </Grid>

            <GridSection title="Variations" />
            <Grid container sx={styles.padding}>
                <GridItem size={12}>{variationsField}</GridItem>
            </Grid>
        </>
    );
}
