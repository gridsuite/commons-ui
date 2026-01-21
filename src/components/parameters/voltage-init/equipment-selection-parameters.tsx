/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { RadioInput } from '../../inputs';
import {
    GENERATORS_SELECTION_TYPE,
    SHUNT_COMPENSATORS_SELECTION_TYPE,
    TRANSFORMERS_SELECTION_TYPE,
    VARIABLE_Q_GENERATORS,
    VARIABLE_SHUNT_COMPENSATORS,
    VARIABLE_TRANSFORMERS,
} from './constants';
import { ParameterLineDirectoryItemsInput } from '../common';
import { ElementType, EquipmentType } from '../../../utils';
import type { MuiStyles } from '../../../utils/styles';

const equipmentsSelectionStyles = {
    alert: (theme) => ({
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    }),
    choice: (theme) => ({
        marginTop: theme.spacing(4),
    }),
    choiceContainer: {
        paddingLeft: 1,
    },
} as const satisfies MuiStyles;

const initialEquipmentsSelectionType = {
    ALL_EXCEPT: {
        id: 'ALL_EXCEPT',
        label: 'allExcept',
    },
    NONE_EXCEPT: {
        id: 'NONE_EXCEPT',
        label: 'noneExcept',
    },
};

export function EquipmentSelectionParameters() {
    return (
        <Grid item container direction="column">
            <Alert sx={equipmentsSelectionStyles.alert} severity="info" variant="outlined">
                <FormattedMessage id="VoltageInitParametersEquipmentsSelectionAlert" />
            </Alert>
            <Grid item container justifyContent="flex-end" sx={equipmentsSelectionStyles.choiceContainer}>
                <Grid item xs={5} sx={equipmentsSelectionStyles.choice}>
                    <RadioInput
                        name={GENERATORS_SELECTION_TYPE}
                        options={Object.values(initialEquipmentsSelectionType)}
                    />
                </Grid>
            </Grid>
            <ParameterLineDirectoryItemsInput
                name={VARIABLE_Q_GENERATORS}
                equipmentTypes={[EquipmentType.GENERATOR]}
                elementType={ElementType.FILTER}
                label="VariableGenerators"
                hideErrorMessage
            />
            <Grid item container justifyContent="flex-end" sx={equipmentsSelectionStyles.choiceContainer}>
                <Grid item xs={5} sx={equipmentsSelectionStyles.choice}>
                    <RadioInput
                        name={TRANSFORMERS_SELECTION_TYPE}
                        options={Object.values(initialEquipmentsSelectionType)}
                    />
                </Grid>
            </Grid>
            <ParameterLineDirectoryItemsInput
                name={VARIABLE_TRANSFORMERS}
                equipmentTypes={[EquipmentType.TWO_WINDINGS_TRANSFORMER]}
                elementType={ElementType.FILTER}
                label="VariableTransformers"
                hideErrorMessage
            />
            <Grid item container justifyContent="flex-end" sx={equipmentsSelectionStyles.choiceContainer}>
                <Grid item xs={5} sx={equipmentsSelectionStyles.choice}>
                    <RadioInput
                        name={SHUNT_COMPENSATORS_SELECTION_TYPE}
                        options={Object.values(initialEquipmentsSelectionType)}
                    />
                </Grid>
            </Grid>
            <ParameterLineDirectoryItemsInput
                name={VARIABLE_SHUNT_COMPENSATORS}
                equipmentTypes={[EquipmentType.SHUNT_COMPENSATOR]}
                elementType={ElementType.FILTER}
                label="VariableShuntCompensators"
                hideErrorMessage
            />
        </Grid>
    );
}
