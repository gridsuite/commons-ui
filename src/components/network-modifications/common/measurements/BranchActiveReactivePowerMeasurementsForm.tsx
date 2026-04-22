/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BranchActiveReactivePowerMeasurementsFormProps } from './measurement.type';
import { PowerMeasurementsForm } from './PowerMeasurementsForm';
import GridSection from '../../../grid/grid-section';

export function BranchActiveReactivePowerMeasurementsForm({
    equipmentToModify,
}: Readonly<BranchActiveReactivePowerMeasurementsFormProps>) {
    return (
        <>
            <GridSection title="MeasurementsSection" />
            <GridSection title="Side1" heading={4} />
            <PowerMeasurementsForm
                side={1}
                activePowerMeasurement={equipmentToModify?.measurementP1}
                reactivePowerMeasurement={equipmentToModify?.measurementQ1}
            />
            <GridSection title="Side2" heading={4} />
            <PowerMeasurementsForm
                side={2}
                activePowerMeasurement={equipmentToModify?.measurementP2}
                reactivePowerMeasurement={equipmentToModify?.measurementQ2}
            />
        </>
    );
}
