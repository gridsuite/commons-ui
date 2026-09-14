/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Stack } from '@mui/material';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ToBeEstimatedInfo } from './toBeEstimated.type';
import { FieldConstants } from '../../../../../utils';
import { CheckboxNullableInput, GridSection } from '../../../../../components';

interface ToBeEstimatedProps {
    toBeEstimated?: ToBeEstimatedInfo;
}

export function ToBeEstimatedForm({ toBeEstimated }: Readonly<ToBeEstimatedProps>) {
    const intl = useIntl();
    const ratioTapChangerStatusId = `${FieldConstants.TO_BE_ESTIMATED}.${FieldConstants.RATIO_TAP_CHANGER_STATUS}`;
    const phaseTapChangerStatusId = `${FieldConstants.TO_BE_ESTIMATED}.${FieldConstants.PHASE_TAP_CHANGER_STATUS}`;

    const previousRatioStatusField = useMemo(() => {
        if (toBeEstimated?.ratioTapChangerStatus == null) {
            return '';
        }
        return toBeEstimated.ratioTapChangerStatus
            ? intl.formatMessage({ id: 'true' })
            : intl.formatMessage({ id: 'false' });
    }, [intl, toBeEstimated?.ratioTapChangerStatus]);

    const previousPhaseStatusField = useMemo(() => {
        if (toBeEstimated?.phaseTapChangerStatus == null) {
            return '';
        }
        return toBeEstimated.phaseTapChangerStatus
            ? intl.formatMessage({ id: 'true' })
            : intl.formatMessage({ id: 'false' });
    }, [intl, toBeEstimated?.phaseTapChangerStatus]);

    const ratioTapChangerStatusField = (
        <CheckboxNullableInput
            name={ratioTapChangerStatusId}
            label="RatioTapChangerEstimateTapPosition"
            previousValue={previousRatioStatusField}
        />
    );

    const phaseTapChangerStatusField = (
        <CheckboxNullableInput
            name={phaseTapChangerStatusId}
            label="PhaseTapChangerEstimateTapPosition"
            previousValue={previousPhaseStatusField}
        />
    );

    return (
        <>
            <GridSection title="EstimateTapPositionSection" />
            <Stack spacing={2}>
                <Box sx={{ width: '50%' }}>{ratioTapChangerStatusField}</Box>
                <Box sx={{ width: '50%' }}>{phaseTapChangerStatusField}</Box>
            </Stack>
        </>
    );
}
