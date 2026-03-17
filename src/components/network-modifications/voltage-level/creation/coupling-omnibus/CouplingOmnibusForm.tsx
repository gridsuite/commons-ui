/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CouplingOmnibusCreation } from './CouplingOmnibusCreation';
import { ExpandableInput } from '../../../../inputs/reactHookForm/expandableInput/ExpandableInput';
import { FieldConstants } from '../../../../../utils';
import { fetchBusBarSectionsForNewCoupler } from '../../../../../services/networkModification';

export function CouplingOmnibusForm() {
    const { setValue, subscribe, trigger, getValues, formState } = useFormContext();

    const couplingOmnibusCreation = {
        [FieldConstants.BUS_BAR_SECTION_ID1]: null,
        [FieldConstants.BUS_BAR_SECTION_ID2]: null,
    };

    const [sectionOptions, setSectionOptions] = useState<string[]>([]);

    useEffect(() => {
        const switchKinds: string[] = getValues(FieldConstants.SWITCH_KINDS).map(
            (value: { switchKind: string }) => value.switchKind
        );
        fetchBusBarSectionsForNewCoupler(
            getValues(FieldConstants.EQUIPMENT_ID),
            getValues(FieldConstants.BUS_BAR_COUNT),
            getValues(FieldConstants.SECTION_COUNT),
            switchKinds
        ).then((bbsIds) => {
            setSectionOptions(bbsIds);
        });
    }, [getValues]);

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
                const switchKinds: string[] = getValues(FieldConstants.SWITCH_KINDS).map(
                    (value: { switchKind: string }) => value.switchKind
                );
                fetchBusBarSectionsForNewCoupler(
                    getValues(FieldConstants.EQUIPMENT_ID),
                    getValues(FieldConstants.BUS_BAR_COUNT),
                    getValues(FieldConstants.SECTION_COUNT),
                    switchKinds
                ).then((bbsIds) => {
                    setValue(FieldConstants.COUPLING_OMNIBUS, []);
                    setSectionOptions(bbsIds);
                });
            },
        });
        return () => unsubscribe();
    }, [subscribe, trigger, getValues, setValue, formState]);

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
