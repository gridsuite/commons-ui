/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentType, useState } from 'react';
import { Grid } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { AddButton, AddButtonMode, TextInput } from '../../../../components/ui';
import { GridSection } from '../../../../components/composite/grid/grid-section';
import { GridItem } from '../../../../components/composite/grid/grid-item';
import { FieldConstants } from '../../../../utils';
import { LineToAttachOrSplitForm, LineToAttachOrSplitOption, VoltageLevelConnectivityForm } from '../../common';
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
    lineOptions?: LineToAttachOrSplitOption[];
    newVoltageLevel?: VoltageLevelCreationDto | null;
    onNewVoltageLevelCreated?: (voltageLevel: VoltageLevelCreationDto) => Promise<string>;
    isUpdate?: boolean;
    NewVoltageLevelPane?: NewVoltageLevelPaneType;
}

export function LineSplitWithVoltageLevelCreationForm({
    voltageLevelOptions = [],
    fetchBusesOrBusbarSections,
    lineOptions = [],
    newVoltageLevel = null,
    onNewVoltageLevelCreated = () => Promise.reject(new Error('onNewVoltageLevelCreated is not provided')),
    isUpdate = false,
    NewVoltageLevelPane,
}: Readonly<LineSplitWithVoltageLevelCreationFormProps>) {
    const [voltageLevelDialogOpen, setVoltageLevelDialogOpen] = useState(false);

    const voltageLevelIdWatch = useWatch({
        name: `${FieldConstants.CONNECTIVITY}.${FieldConstants.VOLTAGE_LEVEL}.${FieldConstants.ID}`,
    });

    const isVoltageLevelEdit = newVoltageLevel?.equipmentId === voltageLevelIdWatch;

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
                    onCreateVoltageLevel={onNewVoltageLevelCreated}
                    editData={isVoltageLevelEdit ? newVoltageLevel : null}
                    isUpdate={isUpdate}
                />
            )}
        </>
    );
}
