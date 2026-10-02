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
import { LineToAttachOrSplitForm, VoltageLevelConnectivityForm } from '../../common';
import { ConnectivityNetworkProps } from '../../common/connectivity/connectivity.type';
import { LineCreationDto, LineCreationDtoWithId } from '../../line/creation/lineCreation.types';
import { VoltageLevelCreationDto } from '../../voltageLevel/creation/voltageLevelCreation.types';

export type VoltageLevelCreationPaneType = ComponentType<{
    open: boolean;
    onClose: () => void;
    onCreateVoltageLevel: (voltageLevel: VoltageLevelCreationDto) => Promise<string>;
    editData: VoltageLevelCreationDto | null;
    isUpdate: boolean;
}>;

export type AttachedLinePaneType = ComponentType<{
    open: boolean;
    onClose: () => void;
    onCreateLine: (params: { lineCreationInfos: LineCreationDto }) => Promise<string>;
    editData: LineCreationDtoWithId | null;
    isUpdate: boolean;
}>;

export interface LineAttachToVoltageLevelCreationFormProps extends Pick<
    ConnectivityNetworkProps,
    'voltageLevelOptions' | 'fetchBusesOrBusbarSections'
> {
    lineOptions?: string[];
    isUpdate?: boolean;

    newVoltageLevel?: VoltageLevelCreationDto | null;
    onNewVoltageLevelCreated?: (voltageLevel: VoltageLevelCreationDto) => Promise<string>;
    NewVoltageLevelPane?: VoltageLevelCreationPaneType;

    attachmentPoint?: VoltageLevelCreationDto | null;
    onAttachmentPointModified?: (voltageLevel: VoltageLevelCreationDto) => Promise<string>;
    onAttachmentPointIdChanged?: (value: string) => void;
    onAttachmentPointNameChanged?: (value: string) => void;
    AttachmentPointPane?: VoltageLevelCreationPaneType;

    attachmentLine?: LineCreationDtoWithId | null;
    onAttachedLineCreated?: (params: { lineCreationInfos: LineCreationDto }) => Promise<string>;
    AttachedLinePane?: AttachedLinePaneType;
}

export function LineAttachToVoltageLevelCreationForm({
    voltageLevelOptions = [],
    fetchBusesOrBusbarSections,
    lineOptions = [],
    isUpdate = false,
    newVoltageLevel = null,
    onNewVoltageLevelCreated = () => new Promise(() => {}),
    NewVoltageLevelPane,
    attachmentPoint = null,
    onAttachmentPointModified = () => new Promise(() => {}),
    onAttachmentPointIdChanged,
    onAttachmentPointNameChanged,
    AttachmentPointPane,
    attachmentLine = null,
    onAttachedLineCreated = () => new Promise(() => {}),
    AttachedLinePane,
}: Readonly<LineAttachToVoltageLevelCreationFormProps>) {
    const [voltageLevelDialogOpen, setVoltageLevelDialogOpen] = useState(false);
    const [attachmentPointDialogOpen, setAttachmentPointDialogOpen] = useState(false);
    const [lineDialogOpen, setLineDialogOpen] = useState(false);

    const voltageLevelIdWatch = useWatch({
        name: `${FieldConstants.CONNECTIVITY}.${FieldConstants.VOLTAGE_LEVEL}.${FieldConstants.ID}`,
    });

    const isVoltageLevelEdit = !!voltageLevelIdWatch && newVoltageLevel?.equipmentId === voltageLevelIdWatch;
    // as equipmentId and equipmentName are synchronized to check if the icon is add or edit
    // other attributes than id and name must be present
    const hasSubstationCreation = attachmentPoint?.substationCreation != null;

    return (
        <>
            <GridSection title="LineToAttachTo" />
            <GridItem size={12}>
                <LineToAttachOrSplitForm label="LineToAttachTo" lineOptions={lineOptions} />
            </GridItem>
            <GridSection title="AttachmentPoint" />
            <Grid container spacing={2}>
                <GridItem>
                    <TextInput
                        name={FieldConstants.ATTACHMENT_POINT_ID}
                        label="AttachmentPointId"
                        onChange={onAttachmentPointIdChanged}
                        dataTestId="AttachmentPointIDInput"
                    />
                </GridItem>
                <GridItem>
                    <TextInput
                        name={FieldConstants.ATTACHMENT_POINT_NAME}
                        label="AttachmentPointName"
                        onChange={onAttachmentPointNameChanged}
                        dataTestId="AttachmentPointNameInput"
                    />
                </GridItem>
                {AttachmentPointPane && (
                    <GridItem>
                        <AddButton
                            onClick={() => setAttachmentPointDialogOpen(true)}
                            mode={hasSubstationCreation ? AddButtonMode.EDIT : AddButtonMode.ADD}
                            label="SpecifyAttachmentPoint"
                            data-testid="AttachmentPointButton"
                        />
                    </GridItem>
                )}
            </Grid>
            <GridSection title="AttachedVoltageLevelId" />
            <Grid container spacing={2}>
                <GridItem size={12}>
                    <VoltageLevelConnectivityForm
                        voltageLevelSelectLabel="AttachedVoltageLevelId"
                        voltageLevelOptions={voltageLevelOptions}
                        fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                    />
                </GridItem>
                {NewVoltageLevelPane && (
                    <GridItem>
                        <AddButton
                            onClick={() => setVoltageLevelDialogOpen(true)}
                            mode={isVoltageLevelEdit ? AddButtonMode.EDIT : AddButtonMode.ADD}
                            label="NewVoltageLevel"
                            data-testid="NewVoltageLevelButton"
                        />
                    </GridItem>
                )}
            </Grid>
            <GridSection title="AttachedLine" />
            <Grid container spacing={2}>
                <GridItem>
                    <TextInput
                        name={FieldConstants.ATTACHMENT_LINE_ID}
                        label="AttachedLineId"
                        formProps={{ disabled: true }}
                        dataTestId="AttachedLineIDInput"
                    />
                </GridItem>
                {AttachedLinePane && (
                    <GridItem size={12}>
                        <AddButton
                            onClick={() => setLineDialogOpen(true)}
                            mode={attachmentLine ? AddButtonMode.EDIT : AddButtonMode.ADD}
                            label="AttachedLine"
                            data-testid="AttachedLineButton"
                        />
                    </GridItem>
                )}
            </Grid>
            <GridSection title="Line1" />
            <Grid container spacing={2}>
                <GridItem>
                    <TextInput name={FieldConstants.LINE1_ID} label="Line1ID" dataTestId="AttachmentLine1IDInput" />
                </GridItem>
                <GridItem>
                    <TextInput
                        name={FieldConstants.LINE1_NAME}
                        label="Line1Name"
                        dataTestId="AttachmentLine1NameInput"
                    />
                </GridItem>
            </Grid>
            <GridSection title="Line2" />
            <Grid container spacing={2}>
                <GridItem>
                    <TextInput name={FieldConstants.LINE2_ID} label="Line2ID" dataTestId="AttachmentLine2IDInput" />
                </GridItem>
                <GridItem>
                    <TextInput
                        name={FieldConstants.LINE2_NAME}
                        label="Line2Name"
                        dataTestId="AttachmentLine2NameInput"
                    />
                </GridItem>
            </Grid>
            {AttachmentPointPane && attachmentPointDialogOpen && (
                <AttachmentPointPane
                    open
                    onClose={() => setAttachmentPointDialogOpen(false)}
                    onCreateVoltageLevel={onAttachmentPointModified}
                    editData={attachmentPoint}
                    isUpdate={isUpdate}
                />
            )}
            {NewVoltageLevelPane && voltageLevelDialogOpen && (
                <NewVoltageLevelPane
                    open
                    onClose={() => setVoltageLevelDialogOpen(false)}
                    onCreateVoltageLevel={onNewVoltageLevelCreated}
                    editData={isVoltageLevelEdit ? newVoltageLevel : null}
                    isUpdate={isUpdate}
                />
            )}
            {AttachedLinePane && lineDialogOpen && (
                <AttachedLinePane
                    open
                    onClose={() => setLineDialogOpen(false)}
                    onCreateLine={onAttachedLineCreated}
                    editData={attachmentLine}
                    isUpdate={isUpdate}
                />
            )}
        </>
    );
}
