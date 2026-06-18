/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { ReactNode } from 'react';
import { CustomFormProvider } from '../../../components/ui';
import { ParameterLineDirectoryItemsInput } from '../common/widget/parameter-line-directory-items-input.js';
import { ParameterLayout, ParameterActions } from '../common';
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
    actions?: ParameterActions;
}

export function PccMinParametersForm({
    pccMinMethods,
    renderTitleFields,
    actions,
}: Readonly<PccMinParametersFormProps>) {
    const { formMethods, formSchema, paramsLoading } = pccMinMethods;

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods} removeOptional>
            <ParameterLayout title={'PccMin'} header={renderTitleFields?.()} actions={actions} isLoading={paramsLoading}>
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
            </ParameterLayout>
        </CustomFormProvider>
    );
}
