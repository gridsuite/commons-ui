/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { getReferencedEquipmentTypeForModel } from './curve-selector-utils';
import ModelFilter, { ModelFilterApi } from './model-filter';
import EquipmentFilter, { EquipmentFilterApi } from './equipment-filter';
import { EquipmentType, VoltageLevelInfos } from '../../../../../utils/types/equipmentType';

import { ModelVariable } from '../common/curve.type';
import { DynamicSimulationModelInfos } from '../../../../../utils/types/dynamic-simulation.type';
import { ExpertFilter, IdentifiableAttributes } from '../../../../filter/filter.type';
import { type MuiStyles } from '../../../../../utils/styles';

const styles = {
    h6: (theme) => ({
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(1),
    }),
} as const satisfies MuiStyles;

export type CurveSelectorApi = {
    getSelectedEquipments: () => IdentifiableAttributes[];
    getSelectedVariables: () => ModelVariable[];
};

type CurveSelectorProps = {
    voltageLevelsFetcher?: () => Promise<VoltageLevelInfos[]>;
    countriesFetcher?: () => Promise<string[]>;
    evaluateFilterFetcher?: (filter: ExpertFilter) => Promise<IdentifiableAttributes[]>;
    modelsFetcher?: () => Promise<DynamicSimulationModelInfos[]> | undefined;
};

const CurveSelector = forwardRef<CurveSelectorApi, Readonly<CurveSelectorProps>>(
    ({ voltageLevelsFetcher, countriesFetcher, evaluateFilterFetcher, modelsFetcher }, ref) => {
        const equipmentFilterRef = useRef<EquipmentFilterApi>(null);
        const modelFilterRef = useRef<ModelFilterApi>(null);

        const [equipmentType, setEquipmentType] = useState(EquipmentType.GENERATOR);

        const handleChangeEquipmentType = useCallback((newEquipmentType: EquipmentType) => {
            setEquipmentType(newEquipmentType);
        }, []);

        // expose some api for the component by using ref
        useImperativeHandle(
            ref,
            () => ({
                getSelectedEquipments: () => {
                    if (!equipmentFilterRef.current) {
                        return [];
                    }
                    return equipmentFilterRef.current.getSelectedEquipments();
                },
                getSelectedVariables: () => {
                    if (!modelFilterRef.current) {
                        return [];
                    }
                    return modelFilterRef.current.getSelectedVariables();
                },
            }),
            []
        );

        return (
            <>
                <Grid
                    item
                    container
                    xs={6}
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    spacing={1}
                >
                    <Typography sx={styles.h6} variant="h6">
                        <FormattedMessage id="DynamicSimulationCurveEquipmentFilter" />
                    </Typography>
                    <EquipmentFilter
                        ref={equipmentFilterRef}
                        equipmentType={equipmentType}
                        onChangeEquipmentType={handleChangeEquipmentType}
                        voltageLevelsFetcher={voltageLevelsFetcher}
                        countriesFetcher={countriesFetcher}
                        evaluateFilterFetcher={evaluateFilterFetcher}
                    />
                </Grid>
                <Grid
                    item
                    container
                    xs={6}
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    spacing={1}
                >
                    <Typography sx={styles.h6} variant="h6">
                        <FormattedMessage id="DynamicSimulationCurveCurveFilter" />
                    </Typography>
                    <ModelFilter
                        ref={modelFilterRef}
                        equipmentType={getReferencedEquipmentTypeForModel(equipmentType)}
                        modelsFetcher={modelsFetcher}
                    />
                </Grid>
            </>
        );
    }
);

export default CurveSelector;
