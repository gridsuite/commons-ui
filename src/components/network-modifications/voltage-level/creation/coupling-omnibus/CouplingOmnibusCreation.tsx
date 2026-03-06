/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { AutocompleteInput } from '../../../../inputs/reactHookForm/autocompleteInputs/AutocompleteInput';
import { Option } from '../../../../../utils/types/types';
import GridItem from '../../../../grid/grid-item';
import { FieldConstants } from '../../../../../utils';

interface CouplingOmnibusCreationProps {
    index: number;
    sectionOptions: Option[];
}

export function CouplingOmnibusCreation({ index, sectionOptions }: Readonly<CouplingOmnibusCreationProps>) {
    const { getValues, trigger, subscribe } = useFormContext();

    useEffect(() => {
        const unsubscribe = subscribe({
            name: [`${FieldConstants.COUPLING_OMNIBUS}.${index}.${FieldConstants.BUS_BAR_SECTION_ID1}`],
            formState: {
                values: true,
            },
            callback: () => {
                if (getValues(`${FieldConstants.COUPLING_OMNIBUS}.${index}.${FieldConstants.BUS_BAR_SECTION_ID2}`)) {
                    trigger(`${FieldConstants.COUPLING_OMNIBUS}.${index}.${FieldConstants.BUS_BAR_SECTION_ID2}`);
                }
            },
        });
        return () => unsubscribe();
    }, [subscribe, trigger, getValues, index]);

    return (
        <>
            <GridItem size={4}>
                <AutocompleteInput
                    allowNewValue
                    forcePopupIcon
                    name={`${FieldConstants.COUPLING_OMNIBUS}.${index}.${FieldConstants.BUS_BAR_SECTION_ID1}`}
                    label="BusBarSectionID1"
                    options={sectionOptions ?? []}
                    size="small"
                />
            </GridItem>
            <GridItem size={4}>
                <AutocompleteInput
                    allowNewValue
                    forcePopupIcon
                    name={`${FieldConstants.COUPLING_OMNIBUS}.${index}.${FieldConstants.BUS_BAR_SECTION_ID2}`}
                    label="BusBarSectionID2"
                    options={sectionOptions ?? []}
                    size="small"
                />
            </GridItem>
        </>
    );
}
