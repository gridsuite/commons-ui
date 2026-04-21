/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useWatch } from 'react-hook-form';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Tooltip } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { FieldConstants } from '../../../../utils';
import { ActivePowerControlInfos } from './activePowerControlForm.type';
import GridItem from '../../../grid/grid-item';
import { CheckboxNullableInput, FloatInput, SwitchInput } from '../../../inputs';

export interface ActivePowerControlFormProps {
    isEquipmentModification?: boolean;
    previousValues?: ActivePowerControlInfos;
}

export function ActivePowerControlForm({
    isEquipmentModification = false,
    previousValues,
}: Readonly<ActivePowerControlFormProps>) {
    const intl = useIntl();
    const watchFrequencyRegulation = useWatch({
        name: FieldConstants.FREQUENCY_REGULATION,
    });

    const previousFrequencyRegulation = useMemo(() => {
        if (previousValues?.participate) {
            return intl.formatMessage({ id: 'On' });
        }
        if (previousValues?.participate === false || (previousValues && previousValues?.participate === undefined)) {
            return intl.formatMessage({ id: 'Off' });
        }
        return undefined;
    }, [intl, previousValues]);

    const frequencyRegulationField = isEquipmentModification ? (
        /** wrap with box to avoid warning */
        <Box>
            <CheckboxNullableInput
                name={FieldConstants.FREQUENCY_REGULATION}
                label="FrequencyRegulation"
                previousValue={previousFrequencyRegulation}
            />
        </Box>
    ) : (
        <Box>
            <SwitchInput name={FieldConstants.FREQUENCY_REGULATION} label="FrequencyRegulation" />
        </Box>
    );

    const droopField = (
        <FloatInput
            name={FieldConstants.DROOP}
            label="Droop"
            previousValue={Number.isNaN(previousValues?.droop) ? undefined : (previousValues?.droop ?? undefined)}
            clearable
        />
    );

    const descriptionTooltip = useMemo(
        () => (
            <Tooltip title={intl.formatMessage({ id: 'activePowerControlTooltip' })}>
                <InfoOutlined color="info" fontSize="medium" />
            </Tooltip>
        ),
        [intl]
    );

    return (
        <>
            {isEquipmentModification ? (
                <GridItem
                    tooltip={watchFrequencyRegulation === null ? <FormattedMessage id="NoModification" /> : ''}
                    size={4}
                >
                    {frequencyRegulationField}
                </GridItem>
            ) : (
                <GridItem size={4}>{frequencyRegulationField}</GridItem>
            )}
            <GridItem size={4}>{droopField}</GridItem>
            <GridItem size={4}>{descriptionTooltip}</GridItem>
        </>
    );
}
