/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFieldArray } from 'react-hook-form';
import { Grid, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { CheckboxNullableInput } from '../../../ui/reactHookForm/CheckboxNullableInput';
import { FloatInput } from '../../../ui';
import { FieldConstants, VoltageAdornment } from '../../../../utils';

const BUSBAR_SECTION_V_MEASUREMENTS = 'busbarSectionVMeasurements';

export interface BusbarSectionVMeasurementInfo {
    id: string;
    measurementV?: { value?: number | null; validity?: boolean | null } | null;
}

interface BusbarSectionVoltageMeasurementsFormProps {
    busbarSections: BusbarSectionVMeasurementInfo[];
}

export function BusbarSectionVoltageMeasurementsForm({
    busbarSections,
}: Readonly<BusbarSectionVoltageMeasurementsFormProps>) {
    const { fields } = useFieldArray({ name: BUSBAR_SECTION_V_MEASUREMENTS });
    const intl = useIntl();

    return (
        <Grid container direction="column" spacing={1} sx={{ pt: 1 }}>
            {fields.length === 0 && (
                <Grid item>
                    <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                        <FormattedMessage id="NoBusbarSectionFound" />
                    </Typography>
                </Grid>
            )}
            {fields.map((field, i) => {
                const bbsId = (field as any).busbarSectionId as string;
                const networkBbs = busbarSections.find((b) => b.id === bbsId);
                const previousValue = networkBbs?.measurementV?.value ?? undefined;
                const validity = networkBbs?.measurementV?.validity;
                let previousValidity: string | undefined;
                if (validity != null) {
                    previousValidity = intl.formatMessage({ id: validity ? 'ValidMeasurement' : 'InvalidMeasurement' });
                }

                return (
                    <Grid item key={field.id}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={3}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {bbsId}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <FloatInput
                                    name={`${BUSBAR_SECTION_V_MEASUREMENTS}.${i}.${FieldConstants.VALUE}`}
                                    label="VoltageText"
                                    adornment={VoltageAdornment}
                                    previousValue={previousValue}
                                    clearable
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <CheckboxNullableInput
                                    name={`${BUSBAR_SECTION_V_MEASUREMENTS}.${i}.${FieldConstants.VALIDITY}`}
                                    label="ValidMeasurement"
                                    previousValue={previousValidity}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                );
            })}
        </Grid>
    );
}
