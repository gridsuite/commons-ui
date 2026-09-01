/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { CustomMuiDialog } from '../../../../components';
import { type EquipmentType, equipmentTypesForPredefinedPropertiesMapper, type MuiStyles } from '../../../../utils';
import type { UseStateBooleanReturn } from '../../../../hooks';
import { TabularFieldConstants } from '../tabular.constants';
import type { PredefinedEquipmentProperties } from '../tabular.types';
import { TabularPropertiesForm } from './TabularPropertiesForm';
import {
    buildPredefinedTabularProperties,
    emptyTabularProperties,
    tabularPropertiesSchema,
    type TabularPropertiesFormType,
    type TabularProperty,
} from './tabularProperty.utils';

const styles = {
    dialogContent: {
        '.MuiDialog-paper': {
            width: '35%',
            height: '50%',
            maxWidth: 'none',
            margin: 'auto',
        },
    },
} as const satisfies MuiStyles;

export interface DefineTabularPropertiesDialogProps {
    open: UseStateBooleanReturn;
    equipmentType: EquipmentType;
    currentProperties: TabularProperty[];
    predefinedEquipmentProperties: PredefinedEquipmentProperties;
    onValidate: (formData: TabularPropertiesFormType) => void;
}

export function DefineTabularPropertiesDialog({
    open,
    equipmentType,
    currentProperties,
    predefinedEquipmentProperties,
    onValidate,
}: Readonly<DefineTabularPropertiesDialogProps>) {
    const formMethods = useForm<TabularPropertiesFormType>({
        defaultValues: emptyTabularProperties,
        resolver: yupResolver(tabularPropertiesSchema),
    });

    const { reset } = formMethods;

    const onClose = useCallback(() => {
        open.setFalse();
        reset(emptyTabularProperties);
    }, [open, reset]);

    useEffect(() => {
        if (open.value && equipmentType) {
            if (currentProperties?.length) {
                reset({
                    [TabularFieldConstants.TABULAR_PROPERTIES]: currentProperties,
                });
            } else {
                // init case when no property has been selected before: propose predefined properties
                const networkEquipmentType = equipmentTypesForPredefinedPropertiesMapper(equipmentType);
                if (networkEquipmentType && predefinedEquipmentProperties?.[networkEquipmentType]) {
                    const propertyNames = Object.keys(predefinedEquipmentProperties[networkEquipmentType] ?? {}).sort(
                        (a, b) => a.localeCompare(b)
                    );
                    reset(buildPredefinedTabularProperties(propertyNames));
                }
            }
        }
    }, [currentProperties, equipmentType, open, predefinedEquipmentProperties, reset]);

    return (
        <CustomMuiDialog
            titleId="DefinePropertiesTitle"
            open={open.value}
            formContext={{ ...formMethods, validationSchema: tabularPropertiesSchema }}
            onClose={onClose}
            onSave={onValidate}
            sx={styles.dialogContent}
        >
            <Grid container>
                <TabularPropertiesForm />
            </Grid>
        </CustomMuiDialog>
    );
}
