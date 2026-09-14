/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { Grid } from '@mui/material';
import { getRegulationTypeLabel, getTapChangerEquipmentSectionTypeValue, getTapSideLabel } from './tapChanger.utils';
import { RegulatingTerminalForm, REGULATION_TYPES } from '../../common';
import { EquipmentType, FieldConstants, Identifiable, REGULATION_SIDES } from '../../../../utils';
import { GridItem, GridSection, SelectInput } from '../../../../components';

export interface RegulatedTerminalSectionProps {
    id: string;
    voltageLevelOptions: Identifiable[];
    previousValues: any;
    tapChangerDisabled: boolean;
    regulationType?: (typeof REGULATION_TYPES)[keyof typeof REGULATION_TYPES]['id'];
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
}

export function RegulatedTerminalSection({
    id,
    voltageLevelOptions,
    previousValues,
    tapChangerDisabled,
    regulationType,
    fetchVoltageLevelEquipments,
}: Readonly<RegulatedTerminalSectionProps>) {
    const intl = useIntl();
    let tapChangerPreviousValues;
    if (id === FieldConstants.RATIO_TAP_CHANGER) {
        tapChangerPreviousValues = previousValues?.ratioTapChanger;
    } else if (id === FieldConstants.PHASE_TAP_CHANGER) {
        tapChangerPreviousValues = previousValues?.phaseTapChanger;
    }

    const regulationTypeField = (
        <SelectInput
            name={`${id}.${FieldConstants.REGULATION_TYPE}`}
            label="RegulationTypeText"
            options={Object.values(REGULATION_TYPES)}
            disabled={tapChangerDisabled}
            size="small"
            previousValue={getRegulationTypeLabel(previousValues, tapChangerPreviousValues, intl) ?? undefined}
        />
    );

    const sideField = (
        <SelectInput
            name={`${id}.${FieldConstants.REGULATION_SIDE}`}
            label="RegulatedSide"
            options={Object.values(REGULATION_SIDES)}
            disabled={tapChangerDisabled}
            size="small"
            previousValue={getTapSideLabel(previousValues, tapChangerPreviousValues, intl) ?? undefined}
        />
    );

    const regulatingTerminalField = (
        <RegulatingTerminalForm
            id={id}
            disabled={tapChangerDisabled}
            equipmentSectionTypeDefaultValue={EquipmentType.TWO_WINDINGS_TRANSFORMER}
            fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
            voltageLevelOptions={voltageLevelOptions}
            regulatingTerminalVlId={tapChangerPreviousValues?.regulatingTerminalVlId}
            equipmentSectionType={getTapChangerEquipmentSectionTypeValue(tapChangerPreviousValues) ?? undefined}
        />
    );

    return (
        <>
            <GridSection title="RegulatedTerminal" heading={4} />
            <Grid container spacing={1}>
                <GridItem size={4}>{regulationTypeField}</GridItem>
                {regulationType === REGULATION_TYPES.LOCAL.id && <GridItem size={4}>{sideField}</GridItem>}
                {regulationType === REGULATION_TYPES.DISTANT.id && (
                    <GridItem size={8}>{regulatingTerminalField}</GridItem>
                )}
            </Grid>
        </>
    );
}
