/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CouplingOmnibusCreation } from './CouplingOmnibusCreation';
import { ExpandableInput } from '../../../../inputs/reactHookForm/expandableInput/ExpandableInput';
import { FieldConstants } from '../../../../../utils';
import { buildNewBusbarSections } from '../voltageLevelCreation.utils';

export function CouplingOmnibusForm() {
    const { setValue } = useFormContext();

    const couplingOmnibusCreation = {
        [FieldConstants.BUS_BAR_SECTION_ID1]: null,
        [FieldConstants.BUS_BAR_SECTION_ID2]: null,
    };

    const watchVoltageLevelID = useWatch({ name: 'equipmentId' });
    const watchBusBarCount = useWatch({ name: FieldConstants.BUS_BAR_COUNT });
    const watchSectionCount = useWatch({ name: FieldConstants.SECTION_COUNT });

    const sectionOptions = useMemo(() => {
        if (watchVoltageLevelID && watchBusBarCount && watchSectionCount) {
            return buildNewBusbarSections(watchVoltageLevelID, watchSectionCount, watchBusBarCount).map((section) => {
                return typeof section === 'string' ? section : section.id;
            });
        }
        return [];
    }, [watchVoltageLevelID, watchBusBarCount, watchSectionCount]);

    useEffect(() => {
        return () => setValue(FieldConstants.COUPLING_OMNIBUS, []);
    }, [sectionOptions, setValue]);

    return (
        <ExpandableInput
            name={FieldConstants.COUPLING_OMNIBUS}
            Field={CouplingOmnibusCreation}
            fieldProps={{ sectionOptions }}
            addButtonLabel="AddCoupling_Omnibus"
            initialValue={couplingOmnibusCreation}
        />
    );
}
