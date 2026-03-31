/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CouplingOmnibusCreation } from './CouplingOmnibusCreation';
import { ExpandableInput } from '../../../../inputs';
import { FieldConstants } from '../../../../../utils';
import { fetchBusBarSectionsForNewCoupler } from '../../../../../services';

export function CouplingOmnibusForm() {
    const { setValue, subscribe, trigger, getValues, formState } = useFormContext();

    const couplingOmnibusCreation = {
        [FieldConstants.BUS_BAR_SECTION_ID1]: null,
        [FieldConstants.BUS_BAR_SECTION_ID2]: null,
    };

    const [sectionOptions, setSectionOptions] = useState<string[]>([]);

    const setBbsOptions = useCallback(
        (onFetchSuccess?: (value: { sectionOptions: string[] }) => void) => {
            const equipmentId = getValues(FieldConstants.EQUIPMENT_ID);
            const busBarCount = getValues(FieldConstants.BUS_BAR_COUNT);
            const sectionCount = getValues(FieldConstants.SECTION_COUNT);
            if (!equipmentId || !busBarCount || !sectionCount) {
                return;
            }
            const switchKinds: string[] = getValues(FieldConstants.SWITCH_KINDS).map(
                (value: { switchKind: string }) => value.switchKind
            );
            fetchBusBarSectionsForNewCoupler(equipmentId, busBarCount, sectionCount, switchKinds).then((bbsIds) => {
                setSectionOptions(bbsIds);
                if (onFetchSuccess) {
                    onFetchSuccess({ sectionOptions: bbsIds });
                }
            });
        },
        [getValues]
    );

    useEffect(() => {
        setBbsOptions();
    }, [setBbsOptions]);

    useEffect(() => {
        const unsubscribe = subscribe({
            name: [
                FieldConstants.EQUIPMENT_ID,
                FieldConstants.BUS_BAR_COUNT,
                FieldConstants.SECTION_COUNT,
                FieldConstants.SWITCH_KINDS,
            ],
            formState: {
                values: true,
            },
            callback: () => {
                setBbsOptions(() => setValue(FieldConstants.COUPLING_OMNIBUS, []));
            },
        });
        return () => unsubscribe();
    }, [subscribe, trigger, setValue, formState, setBbsOptions]);

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
