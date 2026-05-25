/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid } from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { FieldConstants } from '../../../../../../../../utils';
import { CreateSwitchesFormData, SwitchKind, SwitchKindFormData } from '../../../voltageLevelCreation.types';
import { EnumInput } from '../../../../../../../ui';
import GridSection from '../../../../../../../composite/grid/grid-section';
import { SWITCH_TYPE } from '../../../voltageLevelCreation.utils';
import { MAX_SECTIONS_COUNT } from '../../../voltageLevel.constants';

export function SwitchesBetweenSections() {
    const { setValue } = useFormContext();
    const { fields: rows } = useFieldArray({ name: `${FieldConstants.SWITCH_KINDS}` });
    const watchSectionCount: number = useWatch({ name: FieldConstants.SECTION_COUNT });
    const watchSwitchesBetweenSections: string = useWatch({
        name: FieldConstants.SWITCHES_BETWEEN_SECTIONS,
    });

    const intl = useIntl();
    const setSwitchesKinds = useCallback(
        (data: CreateSwitchesFormData) => {
            const map = data[FieldConstants.SWITCH_KINDS].map((switchData) => {
                return intl.formatMessage({ id: switchData[FieldConstants.SWITCH_KIND] });
            });
            setValue(FieldConstants.SWITCHES_BETWEEN_SECTIONS, map.join(' / '), {
                shouldValidate: true,
                shouldDirty: true,
            });
            setValue(FieldConstants.SWITCH_KINDS, data[FieldConstants.SWITCH_KINDS]);
        },
        [intl, setValue]
    );

    const sectionCountRef = useRef<number>(watchSectionCount);
    const switchesBetweenSectionsRef = useRef<string>(watchSwitchesBetweenSections);

    useEffect(() => {
        // If the user changes the section count, we reset the switches between sections
        if (
            sectionCountRef.current !== watchSectionCount &&
            switchesBetweenSectionsRef.current === watchSwitchesBetweenSections
        ) {
            const initialKindDisconnector: SwitchKindFormData = { switchKind: SwitchKind.DISCONNECTOR };
            let list = [];
            if (watchSectionCount >= 1 && watchSectionCount <= MAX_SECTIONS_COUNT) {
                list = new Array(watchSectionCount - 1).fill(initialKindDisconnector);
            }
            const data: CreateSwitchesFormData = { switchKinds: list };
            setSwitchesKinds(data);
        }
        sectionCountRef.current = watchSectionCount;
        switchesBetweenSectionsRef.current = watchSwitchesBetweenSections;
    }, [watchSectionCount, watchSwitchesBetweenSections, setSwitchesKinds]);

    if (Number.isNaN(watchSectionCount) || watchSectionCount <= 1 || watchSectionCount > MAX_SECTIONS_COUNT) {
        return null;
    }

    return (
        <>
            <GridSection title="SwitchesBetweenSections" />
            <Grid container spacing={2} pt={1}>
                {rows.map((value, index) => (
                    <Grid size={4} key={value.id}>
                        <EnumInput
                            options={Object.values(SWITCH_TYPE)}
                            name={`${FieldConstants.SWITCH_KINDS}.${index}.${FieldConstants.SWITCH_KIND}`}
                            label="SwitchBetweenSectionsLabel"
                            labelValues={{
                                index1: String(index + 1),
                                index2: String(index + 2),
                            }}
                            size="small"
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
