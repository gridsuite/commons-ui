/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Theme } from '@mui/material';
import { ExpandableInput, GridItem, GridSection, RadioInput } from '../../../../../components';
import { FieldConstants, VARIATION_MODES, VARIATION_TYPES } from '../../../../../utils';
import { getGeneratorScalingVariationEmptyForm } from './variation/variation.utils';
import { VariationForm } from './variation/VariationForm';

const styles = {
    padding: (theme: Theme) => ({
        paddingLeft: theme.spacing(2),
    }),
};

export function GeneratorScalingForm() {
    const variationTypeField = (
        <RadioInput name={FieldConstants.VARIATION_TYPE} options={Object.values(VARIATION_TYPES)} />
    );

    const variationsField = (
        <ExpandableInput
            name={FieldConstants.VARIATIONS}
            Field={VariationForm}
            addButtonLabel="CreateVariation"
            initialValue={getGeneratorScalingVariationEmptyForm(VARIATION_MODES.PROPORTIONAL_TO_PMAX.id)}
        />
    );

    return (
        <>
            <Grid sx={styles.padding}>
                <GridItem size={8}>{variationTypeField}</GridItem>
            </Grid>

            <GridSection title="Variations" />
            <Grid container sx={styles.padding}>
                <GridItem size={12}>{variationsField}</GridItem>
            </Grid>
        </>
    );
}
