/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, LinearProgress } from '@mui/material';
import { ReactNode } from 'react';
import { CustomFormProvider } from '../../inputs';
import { ParameterLineDirectoryItemsInput } from '../common';
import type { MuiStyles } from '../../../utils/styles';
import { ElementType, EquipmentType } from '../../../utils';
import { UsePccMinParametersFormReturn } from './use-pcc-min-parameters-form';
import { FILTERS } from '../../../utils/constants/filterConstant';

export const styles = {
    gridWithActions: (theme) => ({
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        flexGrow: 1,
        maxHeight: '85%',
    }),
    gridWithoutActions: (theme) => ({
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        flexGrow: 1,
        maxHeight: '100%',
    }),
} as const satisfies MuiStyles;

interface PccMinParametersFormProps {
    pccMinMethods: UsePccMinParametersFormReturn;
    renderTitleFields?: () => ReactNode;
    renderActions?: () => ReactNode;
}

export function PccMinParametersForm({
    pccMinMethods,
    renderTitleFields,
    renderActions,
}: Readonly<PccMinParametersFormProps>) {
    const { formMethods, formSchema, paramsLoading } = pccMinMethods;

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods} removeOptional>
            <Box
                sx={{
                    height: '100%',
                    position: 'relative',
                }}
            >
                <Grid item container sx={renderActions ? styles.gridWithActions : styles.gridWithoutActions}>
                    <Grid item container direction="column">
                        {renderTitleFields?.()}
                    </Grid>
                    {paramsLoading ? (
                        <LinearProgress />
                    ) : (
                        <Box
                            sx={{
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            <Grid item container direction="column">
                                <ParameterLineDirectoryItemsInput
                                    name={FILTERS}
                                    equipmentTypes={[EquipmentType.VOLTAGE_LEVEL]}
                                    elementType={ElementType.FILTER}
                                    label="pccMinParamFilter"
                                    hideErrorMessage
                                    allowMultiSelect={false}
                                />
                            </Grid>
                        </Box>
                    )}
                </Grid>
                {renderActions && (
                    <Grid
                        item
                        container
                        direction="column"
                        sx={{
                            position: 'fixed',
                            bottom: '15px',
                        }}
                    >
                        {renderActions()}
                    </Grid>
                )}
            </Box>
        </CustomFormProvider>
    );
}
