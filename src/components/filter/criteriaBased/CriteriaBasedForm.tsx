/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useWatch } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import FieldConstants from '../../../utils/constants/fieldConstants';
import { FormEquipment } from '../utils/filterFormUtils';
import { useSnackMessage } from '../../../hooks/useSnackMessage';

export interface CriteriaBasedFormProps {
    equipments: Record<string, FormEquipment>;
}

function CriteriaBasedForm({ equipments }: CriteriaBasedFormProps) {
    const { snackError } = useSnackMessage();

    const watchEquipmentType = useWatch({
        name: FieldConstants.EQUIPMENT_TYPE,
    });

    useEffect(() => {
        if (watchEquipmentType && !equipments[watchEquipmentType]) {
            snackError({
                headerId: 'obsoleteFilter',
            });
        }
    }, [snackError, equipments, watchEquipmentType]);

    return (
        <Grid container item spacing={2}>
            {watchEquipmentType &&
                equipments[watchEquipmentType] &&
                equipments[watchEquipmentType].fields.map((equipment: any, index: number) => {
                    const EquipmentForm = equipment.renderer;
                    const uniqueKey = `${watchEquipmentType}-${index}`;
                    return (
                        <Grid item xs={12} key={uniqueKey} flexGrow={1}>
                            <EquipmentForm {...equipment.props} />
                        </Grid>
                    );
                })}
        </Grid>
    );
}

export default CriteriaBasedForm;
