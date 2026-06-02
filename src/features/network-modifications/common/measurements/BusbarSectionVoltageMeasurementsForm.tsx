/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFieldArray } from 'react-hook-form';
import { Grid2 as Grid } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldConstants, VoltageAdornment } from '../../../../utils';
import { MeasurementInfo } from './measurement.type';
import { CheckboxNullableInput, FloatInput } from '../../../../components';

const BUSBAR_SECTION_V_MEASUREMENTS = 'busbarSectionVMeasurements';

export interface BusbarSectionVMeasurementInfo {
    id: string;
    measurementV?: MeasurementInfo | null;
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
        <Grid container direction="column" spacing={1}>
            {fields.length === 0 && (
                <Grid>
                    <FormattedMessage id="NoBusbarSectionFound" />
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
                    <Grid key={field.id}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid>{bbsId}</Grid>
                            <Grid size={4}>
                                <FloatInput
                                    name={`${BUSBAR_SECTION_V_MEASUREMENTS}.${i}.${FieldConstants.VALUE}`}
                                    label="VoltageText"
                                    adornment={VoltageAdornment}
                                    previousValue={previousValue}
                                    clearable
                                />
                            </Grid>
                            <Grid size={3}>
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
