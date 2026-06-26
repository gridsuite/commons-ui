/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid2 as Grid } from '@mui/material';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { FloatInput, SelectInput } from '../../../../components/ui';
import { Grid2Item as GridItem } from '../../../../components/composite/grid/grid2-item';
import { EquipmentType, FieldConstants, Identifiable } from '../../../../utils';
import { PercentageAdornment, VoltageAdornment } from '../../../../utils/constants/adornments';
import { RegulatingTerminalForm } from '../regulatingTerminal';
import { REGULATION_TYPES } from './voltageRegulation.utils';

export interface VoltageRegulationFormPreviousValues {
    regulatingTerminalConnectableId?: string | null;
    regulatingTerminalVlId?: string | null;
    regulatingTerminalConnectableType?: string | null;
    voltageSetPoint?: number | null;
    qPercent?: number | null;
}

export interface VoltageRegulationFormProps {
    voltageLevelOptions: Identifiable[];
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    previousValues?: VoltageRegulationFormPreviousValues;
    isEquipmentModification?: boolean;
}

export function VoltageRegulationForm({
    voltageLevelOptions,
    fetchVoltageLevelEquipments,
    previousValues,
    isEquipmentModification,
}: Readonly<VoltageRegulationFormProps>) {
    const intl = useIntl();

    const previousRegulationType = useMemo(() => {
        if (previousValues?.regulatingTerminalVlId || previousValues?.regulatingTerminalConnectableId) {
            return REGULATION_TYPES.DISTANT.id;
        }
        return REGULATION_TYPES.LOCAL.id;
    }, [previousValues]);

    const voltageRegulationType = useWatch({
        name: FieldConstants.VOLTAGE_REGULATION_TYPE,
    });

    const translatedPreviousRegulationLabel = useMemo(() => {
        if (isEquipmentModification && REGULATION_TYPES[previousRegulationType]) {
            return intl.formatMessage({ id: REGULATION_TYPES[previousRegulationType].label });
        }
        return null;
    }, [intl, isEquipmentModification, previousRegulationType]);

    const isDistantRegulation =
        voltageRegulationType === REGULATION_TYPES.DISTANT.id ||
        (!voltageRegulationType && previousRegulationType === REGULATION_TYPES.DISTANT.id);

    const previousEquipmentSectionType =
        previousValues?.regulatingTerminalConnectableType && previousValues?.regulatingTerminalConnectableId
            ? `${previousValues.regulatingTerminalConnectableType} : ${previousValues.regulatingTerminalConnectableId}`
            : undefined;

    const previousQPercent = Number.isNaN(Number(previousValues?.qPercent))
        ? undefined
        : (previousValues?.qPercent ?? undefined);

    return (
        <>
            <GridItem size={4}>
                <FloatInput
                    name={FieldConstants.VOLTAGE_SET_POINT}
                    label="VoltageText"
                    adornment={VoltageAdornment}
                    previousValue={previousValues?.voltageSetPoint ?? undefined}
                    clearable
                />
            </GridItem>
            <GridItem size={4}>
                <SelectInput
                    options={Object.values(REGULATION_TYPES)}
                    name={FieldConstants.VOLTAGE_REGULATION_TYPE}
                    label="RegulationTypeText"
                    size="small"
                    previousValue={translatedPreviousRegulationLabel ?? undefined}
                />
            </GridItem>
            <Box sx={{ width: '100%' }} />
            <Grid size={4} justifySelf="end" />
            <Box sx={{ width: '100%' }} />
            {isDistantRegulation && (
                <>
                    <Grid size={4} justifySelf="end">
                        <FormattedMessage id="RegulatingTerminalGenerator" />
                    </Grid>
                    <GridItem size={8}>
                        <RegulatingTerminalForm
                            id=""
                            voltageLevelOptions={voltageLevelOptions}
                            equipmentSectionTypeDefaultValue=""
                            fetchVoltageLevelEquipments={fetchVoltageLevelEquipments}
                            regulatingTerminalVlId={previousValues?.regulatingTerminalVlId ?? undefined}
                            equipmentSectionType={previousEquipmentSectionType}
                        />
                    </GridItem>
                    <Grid size={4} justifySelf="end" />
                    <GridItem size={4}>
                        <FloatInput
                            name={FieldConstants.Q_PERCENT}
                            label="QPercentText"
                            adornment={PercentageAdornment}
                            previousValue={previousQPercent}
                            clearable
                        />
                    </GridItem>
                </>
            )}
        </>
    );
}
