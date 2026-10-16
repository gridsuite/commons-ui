/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentType, useCallback, useState } from 'react';
import { Grid } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { AddButton, AddButtonMode, TextInput, useCustomFormContext } from '../../../../components/ui';
import { GridSection } from '../../../../components/composite/grid/grid-section';
import { GridItem } from '../../../../components/composite/grid/grid-item';
import { FieldConstants } from '../../../../utils';
import { LineToAttachOrSplitForm, VoltageLevelConnectivityForm } from '../../common';
import { ConnectivityNetworkProps } from '../../common/connectivity/connectivity.type';
import { VoltageLevelCreationDto } from '../../voltageLevel/creation/voltageLevelCreation.types';

export type NewVoltageLevelPaneType = ComponentType<{
    open: boolean;
    onClose: () => void;
    onCreateVoltageLevel: (voltageLevel: VoltageLevelCreationDto) => Promise<string>;
    editData: VoltageLevelCreationDto | null;
    isUpdate: boolean;
}>;

export interface LineSplitWithVoltageLevelCreationFormProps extends Pick<
    ConnectivityNetworkProps,
    'voltageLevelOptions' | 'fetchBusesOrBusbarSections'
> {
    lineOptions?: string[];
    // Optional: the form already records the new voltage level itself; this only notifies a consumer
    // that also needs to know, e.g. to add it to a locally-displayed options list.
    onNewVoltageLevelCreated?: (voltageLevel: VoltageLevelCreationDto) => Promise<string>;
    isUpdate?: boolean;
    NewVoltageLevelPane?: NewVoltageLevelPaneType;
}

export function LineSplitWithVoltageLevelCreationForm({
    voltageLevelOptions = [],
    fetchBusesOrBusbarSections,
    lineOptions = [],
    onNewVoltageLevelCreated,
    isUpdate = false,
    NewVoltageLevelPane,
}: Readonly<LineSplitWithVoltageLevelCreationFormProps>) {
    const [voltageLevelDialogOpen, setVoltageLevelDialogOpen] = useState(false);
    const { setValue, getValues } = useCustomFormContext();

    const newVoltageLevel: VoltageLevelCreationDto | null = useWatch({ name: FieldConstants.NEW_VOLTAGE_LEVEL });

    const voltageLevelIdWatch = useWatch({
        name: `${FieldConstants.CONNECTIVITY}.${FieldConstants.VOLTAGE_LEVEL}.${FieldConstants.ID}`,
    });

    const isVoltageLevelEdit = newVoltageLevel?.equipmentId === voltageLevelIdWatch;

    const handleCreateVoltageLevel = useCallback(
        (voltageLevel: VoltageLevelCreationDto) => {
            setValue(FieldConstants.NEW_VOLTAGE_LEVEL, voltageLevel, { shouldDirty: true });
            const currentConnectivity = getValues(FieldConstants.CONNECTIVITY);
            setValue(
                FieldConstants.CONNECTIVITY,
                {
                    ...currentConnectivity,
                    [FieldConstants.VOLTAGE_LEVEL]: { [FieldConstants.ID]: voltageLevel.equipmentId },
                    [FieldConstants.BUS_OR_BUSBAR_SECTION]:
                        currentConnectivity?.[FieldConstants.BUS_OR_BUSBAR_SECTION] ?? null,
                },
                { shouldValidate: true, shouldDirty: true }
            );
            return onNewVoltageLevelCreated?.(voltageLevel) ?? new Promise<string>(() => {});
        },
        [setValue, getValues, onNewVoltageLevelCreated]
    );

    return (
        <>
            <GridSection title="LineToSplit" />
            <GridItem size={12}>
                <LineToAttachOrSplitForm label="LineToSplit" lineOptions={lineOptions} />
            </GridItem>
            <GridSection title="VoltageLevelToSplitAt" />
            <Grid container spacing={2}>
                <GridItem size={12}>
                    <VoltageLevelConnectivityForm
                        voltageLevelSelectLabel="VoltageLevelToSplitAt"
                        voltageLevelOptions={voltageLevelOptions}
                        fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    />
                </GridItem>
                {NewVoltageLevelPane && (
                    <GridItem>
                        <AddButton
                            label="NewVoltageLevel"
                            onClick={() => setVoltageLevelDialogOpen(true)}
                            mode={isVoltageLevelEdit ? AddButtonMode.EDIT : AddButtonMode.ADD}
                        />
                    </GridItem>
                )}
            </Grid>
            <GridSection title="Line1" />
            <Grid container spacing={2}>
                <GridItem>
                    <TextInput name={FieldConstants.LINE1_ID} label="Line1ID" />
                </GridItem>
                <GridItem>
                    <TextInput name={FieldConstants.LINE1_NAME} label="Line1Name" />
                </GridItem>
            </Grid>
            <GridSection title="Line2" />
            <Grid container spacing={2}>
                <GridItem>
                    <TextInput name={FieldConstants.LINE2_ID} label="Line2ID" />
                </GridItem>
                <GridItem>
                    <TextInput name={FieldConstants.LINE2_NAME} label="Line2Name" />
                </GridItem>
            </Grid>
            {NewVoltageLevelPane && voltageLevelDialogOpen && (
                <NewVoltageLevelPane
                    open
                    onClose={() => setVoltageLevelDialogOpen(false)}
                    onCreateVoltageLevel={handleCreateVoltageLevel}
                    editData={isVoltageLevelEdit ? newVoltageLevel : null}
                    isUpdate={isUpdate}
                />
            )}
        </>
    );
}
