/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Box, Grid, lighten, Typography } from '@mui/material';
import CheckboxSelect from '../common/checkbox-select';
import CheckboxTreeview, { CheckboxTreeviewApi } from '../common/checkbox-treeview';
import { DynamicSimulationModelInfos } from '../../../../../utils/types/dynamic-simulation.type';
import { EquipmentType } from '../../../../../utils/types/equipmentType';
import { DynamicSimulationModel, ModelVariable } from '../common/curve.type';
import { modelsToVariables } from './model-filter-utils';
import { type MuiStyles } from '../../../../../utils/styles';

export type ModelFilterApi = {
    getSelectedVariables: () => ModelVariable[];
};

const makeGetModelLabel = (intl: IntlShape) => (value: string) =>
    intl.formatMessage({
        id: `models.${value}`,
    });

const makeGetVariableLabel = (intl: IntlShape) => (elem: ModelVariable) => {
    if (!elem.parentId) {
        // root element => that is model element in the variable tree
        return intl.formatMessage({ id: `models.${elem.name}` });
    }

    // either a variable set element or variable element in the variable tree
    if (elem.variableId) {
        // that is a variable element
        return intl.formatMessage({
            id: `variables.${elem.name}`,
        });
    }

    // must be a variable set element
    return intl.formatMessage({
        id: `variableSets.${elem.name}`,
    });
};

const styles = {
    tree: (theme) => ({
        width: '100%',
        height: '100%',
        border: 'solid',
        borderWidth: '.5px',
        borderColor: lighten(theme.palette.background.paper, 0.5),
        overflow: 'auto',
    }),
    model: {
        width: '100%',
    },
    modelTitle: (theme) => ({
        marginBottom: theme.spacing(1),
    }),
    variable: {
        width: '100%',
        flexGrow: 1,
    },
    variableTree: {
        maxHeight: '440px',
    },
} as const satisfies MuiStyles;

interface ModelFilterProps {
    equipmentType: EquipmentType;
    modelsFetcher?: () => Promise<DynamicSimulationModelInfos[]> | undefined;
}

const ModelFilter = forwardRef<ModelFilterApi, ModelFilterProps>(
    ({ equipmentType = EquipmentType.GENERATOR, modelsFetcher }, ref) => {
        const intl = useIntl();
        const [allModels, setAllModels] = useState<DynamicSimulationModel[]>([]);
        const [variables, setVariables] = useState<ModelVariable[]>([]);
        const variablesRef = useRef<CheckboxTreeviewApi<ModelVariable>>(null);

        // --- models CheckboxSelect --- //
        const associatedModels: Record<string, string> = useMemo(() => {
            const associatedModelsArray = allModels?.filter((model) => model.equipmentType === equipmentType);
            // convert array to object
            return associatedModelsArray
                ? associatedModelsArray.reduce(
                      (obj, model) => ({
                          ...obj,
                          [model.name]: model.name,
                      }),
                      {}
                  )
                : {};
        }, [equipmentType, allModels]);
        const initialSelectedModels = useMemo(() => Object.keys(associatedModels) ?? [], [associatedModels]);

        const [selectedModels, setSelectedModels] = useState<string[]>([]);
        const handleModelChange = useCallback((_selectedModels: string[]) => {
            setSelectedModels(_selectedModels);
        }, []);

        useEffect(() => {
            setSelectedModels(initialSelectedModels);
        }, [initialSelectedModels]);

        // --- variables array CheckboxTreeview --- //
        const filteredVariables = useMemo(
            () =>
                variables.filter((elem) =>
                    selectedModels.some((model) => {
                        return elem.id.includes(associatedModels[model]);
                    })
                ),
            [variables, selectedModels, associatedModels]
        );

        // fetch all associated models and variables for study
        useEffect(() => {
            modelsFetcher?.()?.then((models: DynamicSimulationModelInfos[]) => {
                setAllModels(
                    models.map((model) => ({
                        name: model.modelName,
                        equipmentType: model.equipmentType,
                    }))
                );

                // transform models to variables
                const variablesArray = modelsToVariables(models);
                setVariables(variablesArray);
            });
        }, [modelsFetcher]);

        const getSelectedVariables = useCallback((): ModelVariable[] => {
            return (
                variablesRef.current
                    ?.getSelectedItems()
                    .filter((item: ModelVariable) => item.variableId) // filter to keep only variable item
                    .filter(
                        (item: ModelVariable, index: number, arr: ModelVariable[]) =>
                            arr.findIndex((elem) => elem.variableId === item.variableId) === index
                    ) ?? []
            ); // remove duplicated by variableId
        }, []);

        // expose some api for the component by using ref
        useImperativeHandle(
            ref,
            () => ({
                getSelectedVariables,
            }),
            [getSelectedVariables]
        );

        const getModelLabel = useMemo(() => {
            return makeGetModelLabel(intl);
        }, [intl]);

        const getVariableLabel = useMemo(() => {
            return makeGetVariableLabel(intl);
        }, [intl]);

        return (
            <>
                {/* Models used in a mapping */}
                <Grid item container sx={styles.model}>
                    <Grid item xs={6}>
                        <Typography>
                            <FormattedMessage id="DynamicSimulationCurveModel" />
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <CheckboxSelect
                            options={initialSelectedModels}
                            getOptionLabel={getModelLabel}
                            value={initialSelectedModels}
                            onChange={handleModelChange}
                            disabled={initialSelectedModels.length === 1 /* disabled if only one model to choose */}
                        />
                    </Grid>
                </Grid>
                {/* Variables which found in models used in a mapping */}
                <Grid item sx={styles.variable} container direction="column">
                    <Grid item width="100%">
                        <Typography sx={styles.modelTitle} variant="subtitle1">
                            <FormattedMessage id="DynamicSimulationCurveVariable" />
                        </Typography>
                    </Grid>
                    <Grid item width="100%" xs>
                        <Box sx={styles.tree}>
                            <CheckboxTreeview
                                ref={variablesRef}
                                data={filteredVariables}
                                getLabel={getVariableLabel}
                                checkAll
                                sx={styles.variableTree}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </>
        );
    }
);

export default ModelFilter;
