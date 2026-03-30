/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { useFormState } from 'react-hook-form';
import { Grid } from '@mui/material';
import GridItem from '../../../grid/grid-item';
import { TextInput } from '../../../inputs';
import { FieldConstants } from '../../../../utils';
import { VoltageLevelCreationTabs } from './VoltageLevelCreationTabs';
import { VoltageLevelCreationTabsContent } from './VoltageLevelCreationTabsContent';
import { VoltageLevelTab } from './voltageLevel.constants';
import {
    isAdditionalInformationTabError,
    isCharacteristicsTabError,
    isStructureTabError,
    isSubstationTabError,
} from './voltageLevelCreation.utils';

export interface VoltageLevelCreationFormProps {
    substationOptions?: string[];
    showDeleteSubstationButton?: boolean;
}

export function VoltageLevelCreationForm({
    substationOptions,
    showDeleteSubstationButton = true,
}: VoltageLevelCreationFormProps = {}) {
    const [tabIndex, setTabIndex] = useState(0);
    const [tabIndexesWithError, setTabIndexesWithError] = useState<number[]>([]);
    const { errors } = useFormState();

    useEffect(() => {
        const tabsInError: number[] = [];
        if (isSubstationTabError(errors)) {
            tabsInError.push(VoltageLevelTab.SUBSTATION_TAB);
        }
        if (isCharacteristicsTabError(errors)) {
            tabsInError.push(VoltageLevelTab.CHARACTERISTICS_TAB);
        }
        if (isStructureTabError(errors)) {
            tabsInError.push(VoltageLevelTab.STRUCTURE_TAB);
        }
        if (isAdditionalInformationTabError(errors)) {
            tabsInError.push(VoltageLevelTab.ADDITIONAL_INFORMATION_TAB);
        }
        if (tabsInError.length > 0) {
            setTabIndex((currentTabIndex) => {
                return tabsInError.includes(currentTabIndex) ? currentTabIndex : tabsInError[0];
            });
        }
        setTabIndexesWithError(tabsInError);
    }, [errors]);

    return (
        <>
            <Grid container spacing={2}>
                <GridItem>
                    <TextInput
                        name={FieldConstants.EQUIPMENT_ID}
                        label="ID"
                        formProps={{ autoFocus: true, margin: 'normal' }}
                    />
                </GridItem>
                <GridItem>
                    <TextInput name={FieldConstants.EQUIPMENT_NAME} label="Name" formProps={{ margin: 'normal' }} />
                </GridItem>
            </Grid>
            <VoltageLevelCreationTabs
                tabIndex={tabIndex}
                tabIndexesWithError={tabIndexesWithError}
                setTabIndex={setTabIndex}
            />
            <VoltageLevelCreationTabsContent
                tabIndex={tabIndex}
                substationOptions={substationOptions}
                showDeleteButton={showDeleteSubstationButton}
            />
        </>
    );
}
