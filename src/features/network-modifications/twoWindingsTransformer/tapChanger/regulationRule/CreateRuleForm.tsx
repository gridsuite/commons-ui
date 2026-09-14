/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, DialogContent, DialogTitle, Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { FloatInput } from '../../../../../components';
import { FieldConstants } from '../../../../../utils';

const TAP_LABELS = {
    [FieldConstants.PHASE_TAP_CHANGER]: {
        low: 'LowTapAlpha',
        high: 'HighTapAlpha',
        title: 'CreateDephasingRule',
    },
    [FieldConstants.RATIO_TAP_CHANGER]: {
        low: 'LowTapRatio',
        high: 'HighTapRatio',
        title: 'CreateRegulationRule',
    },
} as const;

const DIALOG_CONTENT_STYLE = { paddingTop: '5px' } as const;

interface CreateRuleFormProps {
    tapChanger: FieldConstants.PHASE_TAP_CHANGER | FieldConstants.RATIO_TAP_CHANGER;
}

export function CreateRuleForm({ tapChanger }: Readonly<CreateRuleFormProps>) {
    const labels = TAP_LABELS[tapChanger] ?? { low: '', high: '', title: '' };

    return (
        <>
            <DialogTitle>
                <FormattedMessage id={labels.title} />
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={DIALOG_CONTENT_STYLE}>
                    <Box>
                        <FloatInput label={labels.low} name={FieldConstants.LOW_TAP_POSITION} />
                    </Box>
                    <Box>
                        <FloatInput label={labels.high} name={FieldConstants.HIGH_TAP_POSITION} />
                    </Box>
                </Stack>
            </DialogContent>
        </>
    );
}
