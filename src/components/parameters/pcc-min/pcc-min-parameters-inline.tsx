/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import type { UUID } from 'node:crypto';
import { useSnackMessage } from '../../../hooks';
import { ValidateButton } from '../../inputs';
import { LabelledButton } from '../common';
import { PopupConfirmationDialog } from '../../dialogs';
import { UsePccMinParametersForm } from './use-pcc-min-parameters-form';
import { PccMinParametersForm } from './pcc-min-parameters-form';
import { PccMinParameters, updatePccMinParameters } from '../../../services/pcc-min';

export function PccMinParametersInLine({
    studyUuid,
    setHaveDirtyFields,
    pccMinParameters,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    pccMinParameters: PccMinParameters | null;
}>) {
    const pccMinMethods = UsePccMinParametersForm({
        parametersUuid: null,
        name: null,
        description: null,
        studyUuid,
        parameters: pccMinParameters,
    });

    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);
    const { snackError } = useSnackMessage();

    const { formState, handleSubmit } = pccMinMethods.formMethods;

    const resetPccMinParameters = useCallback(() => {
        updatePccMinParameters(studyUuid, null) // null means Reset
            .catch((error) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'updatePccMinParametersError',
                });
            });

        setOpenResetConfirmation(false);
    }, [studyUuid, snackError]);

    const handleResetClick = useCallback(() => {
        setOpenResetConfirmation(true);
    }, []);

    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
    }, []);

    useEffect(() => {
        setHaveDirtyFields(!!Object.keys(formState.dirtyFields).length);
    }, [formState, setHaveDirtyFields]);

    return (
        <PccMinParametersForm
            pccMinMethods={pccMinMethods}
            renderActions={() => {
                return (
                    <Box>
                        <Grid container item>
                            <LabelledButton callback={handleResetClick} label="resetToDefault" />
                            <ValidateButton
                                onClick={handleSubmit(pccMinMethods.onSaveInline)}
                                disabled={!formState.isDirty}
                            />
                        </Grid>

                        {/* Reset Confirmation Dialog */}
                        {openResetConfirmation && (
                            <PopupConfirmationDialog
                                descriptionKey="resetParamsConfirmation"
                                validateButtonLabel="validate"
                                openConfirmationPopup={openResetConfirmation}
                                setOpenConfirmationPopup={handleCancelReset}
                                handlePopupConfirmation={resetPccMinParameters}
                            />
                        )}
                    </Box>
                );
            }}
        />
    );
}
