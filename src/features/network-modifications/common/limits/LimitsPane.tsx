/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid2 as Grid, IconButton, lighten } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { ControlPoint as AddIcon } from '@mui/icons-material';
import { OperationalLimitsGroupsTabs } from './OperationalLimitsGroupsTabs';
import { SelectedOperationalLimitGroup } from './SelectedOperationalLimitGroup';
import { LimitsSidePane } from './LimitsSidePane';
import { mapServerLimitsGroupsToFormInfos } from './limitsPane.utils';
import { OperationalLimitsGroupFormSchema } from './operationalLimitsGroups.types';
import { generateEmptyOperationalLimitsGroup, generateUniqueId } from './operationalLimitsGroups.utils';
import { FieldConstants, type MuiStyles } from '../../../../utils';
import { APPLICABILITY, CurrentLimits, CurrentLimitsData } from './limits.types';
import { GridSection, InputWithPopupConfirmation, SwitchInput } from '../../../../components';
import { BranchInfos } from '../../line/commonForm/line.types';

const limitsStyles = {
    parametersBox: (theme) => ({
        backgroundColor:
            theme.palette.mode === 'light'
                ? theme.palette.background.paper
                : lighten(theme.palette.background.paper, 0.2),
        height: '100%',
        position: 'relative',
        padding: 0,
    }),
} as const satisfies MuiStyles;

export interface LimitsPaneProps {
    id?: string;
    equipmentToModify?: BranchInfos | null;
    clearableFields?: boolean;
}

export function LimitsPane({
    id = FieldConstants.LIMITS,
    equipmentToModify,
    clearableFields,
}: Readonly<LimitsPaneProps>) {
    const [indexSelectedLimitSet, setIndexSelectedLimitSet] = useState<number | null>(null);
    const { getValues, reset } = useFormContext();

    const olgEditable: boolean = useWatch({
        name: `${id}.${FieldConstants.ENABLE_OLG_MODIFICATION}`,
    });

    const operationalLimitsGroupsFormName: string = `${id}.${FieldConstants.OPERATIONAL_LIMITS_GROUPS}`;
    const {
        fields: operationalLimitsGroups,
        append: appendToLimitsGroups,
        prepend: prependToLimitsGroups,
        remove: removeLimitsGroups,
    } = useFieldArray<{
        [key: string]: OperationalLimitsGroupFormSchema[];
    }>({
        name: operationalLimitsGroupsFormName,
    });

    const watchedOperationalLimitsGroups: OperationalLimitsGroupFormSchema[] = useWatch({
        name: operationalLimitsGroupsFormName,
    });

    const isAModification: boolean = useMemo(() => !!equipmentToModify, [equipmentToModify]);

    const getCurrentLimits = (equipment: any, operationalLimitsGroupId: string): CurrentLimitsData | null => {
        if (equipment?.currentLimits) {
            return equipment.currentLimits.find(
                (currentLimit: CurrentLimitsData) =>
                    currentLimit.id + currentLimit.applicability === operationalLimitsGroupId
            );
        }
        return null;
    };

    const getCurrentLimitsIgnoreApplicability = (
        equipment: any,
        operationalLimitsGroupName: string
    ): CurrentLimits | null => {
        if (equipment?.currentLimits) {
            return equipment.currentLimits.find(
                (currentLimit: CurrentLimitsData) => currentLimit.id === operationalLimitsGroupName
            );
        }
        return null;
    };

    const handlePopupConfirmation = () => {
        const resetOLGs: OperationalLimitsGroupFormSchema[] = mapServerLimitsGroupsToFormInfos(
            equipmentToModify?.currentLimits ?? []
        );
        const currentValues = getValues();
        reset(
            {
                ...currentValues,
                [FieldConstants.LIMITS]: {
                    [FieldConstants.OPERATIONAL_LIMITS_GROUPS]: resetOLGs,
                    [FieldConstants.ENABLE_OLG_MODIFICATION]: false,
                },
            },
            { keepDefaultValues: true }
        );
    };

    const prependEmptyOperationalLimitsGroup = useCallback(
        (name: string) => {
            prependToLimitsGroups(generateEmptyOperationalLimitsGroup(name));
        },
        [prependToLimitsGroups]
    );

    const addNewLimitSet = useCallback(() => {
        let name = 'DEFAULT';

        // Try to generate unique name (we relie on watched table because name can be changed without using useFieldArray functions)
        if (watchedOperationalLimitsGroups?.length > 0) {
            const ids: string[] = watchedOperationalLimitsGroups.map((l) => l.name);
            name = generateUniqueId('DEFAULT', ids);
        }
        prependEmptyOperationalLimitsGroup(name);
        setIndexSelectedLimitSet(0);
    }, [watchedOperationalLimitsGroups, prependEmptyOperationalLimitsGroup]);

    return (
        <>
            {/* active limit sets */}
            <Grid container columns={6} spacing={1} sx={{ maxWidth: '600px' }}>
                <Grid size={3}>
                    <GridSection title="SelectedOperationalLimitGroups" />
                </Grid>
                <Grid
                    size={3}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {/* if the user wants to switch off the modification a modal asks him to confirm */}
                    {isAModification && (
                        <InputWithPopupConfirmation
                            Input={SwitchInput}
                            name={`${id}.${FieldConstants.ENABLE_OLG_MODIFICATION}`}
                            label={olgEditable ? 'Edit' : 'View'}
                            shouldOpenPopup={() => olgEditable}
                            resetOnConfirmation={handlePopupConfirmation}
                            message="disableOLGedition"
                            validateButtonLabel="validate"
                        />
                    )}
                </Grid>
                <Grid size={3}>
                    <SelectedOperationalLimitGroup
                        selectedFormName={`${id}.${FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1}`}
                        optionsFormName={`${id}.${FieldConstants.OPERATIONAL_LIMITS_GROUPS}`}
                        label="Side1"
                        filteredApplicability={APPLICABILITY.SIDE1.id}
                        previousValue={equipmentToModify?.selectedOperationalLimitsGroupId1}
                        isABranchModif={!!equipmentToModify}
                    />
                </Grid>
                <Grid size={3}>
                    <SelectedOperationalLimitGroup
                        selectedFormName={`${id}.${FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2}`}
                        optionsFormName={`${id}.${FieldConstants.OPERATIONAL_LIMITS_GROUPS}`}
                        label="Side2"
                        filteredApplicability={APPLICABILITY.SIDE2.id}
                        previousValue={equipmentToModify?.selectedOperationalLimitsGroupId2}
                        isABranchModif={!!equipmentToModify}
                    />
                </Grid>
            </Grid>

            {/* limits */}
            <Grid container size={12} columns={10.25}>
                <Grid size={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <GridSection size={12} title="LimitSets" />
                        <IconButton color="primary" onClick={addNewLimitSet} disabled={!olgEditable}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <OperationalLimitsGroupsTabs
                        parentFormName={id}
                        appendToLimitsGroups={appendToLimitsGroups}
                        removeLimitsGroups={removeLimitsGroups}
                        indexSelectedLimitSet={indexSelectedLimitSet}
                        setIndexSelectedLimitSet={setIndexSelectedLimitSet}
                        editable={olgEditable}
                        currentLimitsToModify={equipmentToModify?.currentLimits ?? []}
                    />
                </Grid>
                <Grid size={6} sx={limitsStyles.parametersBox} marginLeft={2}>
                    {indexSelectedLimitSet !== null &&
                        operationalLimitsGroups.map(
                            (operationalLimitsGroup: OperationalLimitsGroupFormSchema, index: number) =>
                                index === indexSelectedLimitSet && (
                                    <LimitsSidePane
                                        key={operationalLimitsGroup.id}
                                        name={`${id}.${FieldConstants.OPERATIONAL_LIMITS_GROUPS}[${index}]`}
                                        clearableFields={clearableFields}
                                        permanentCurrentLimitPreviousValue={
                                            getCurrentLimits(equipmentToModify, operationalLimitsGroup.id)
                                                ?.permanentLimit ??
                                            getCurrentLimitsIgnoreApplicability(
                                                equipmentToModify,
                                                operationalLimitsGroup.name
                                            )?.permanentLimit
                                        }
                                        temporaryLimitsPreviousValues={
                                            getCurrentLimits(equipmentToModify, operationalLimitsGroup.id)
                                                ?.temporaryLimits ?? []
                                        }
                                        disabled={!olgEditable}
                                    />
                                )
                        )}
                </Grid>
            </Grid>
        </>
    );
}
