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
import { LineCreationDto, LineCreationDtoWithId } from '../../line/creation/lineCreation.types';
import { VoltageLevelCreationDto } from '../../voltageLevel/creation/voltageLevelCreation.types';
import { lineAttachToVoltageLevelEmptyAttachmentPoint } from './lineAttachToVoltageLevelCreation.utils';

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

    // Optional: the form already records the new voltage level itself; this only notifies a consumer
    // that also needs to know, e.g. to add it to a locally-displayed options list.
    onNewVoltageLevelCreated?: (voltageLevel: VoltageLevelCreationDto) => Promise<string>;
    NewVoltageLevelPane?: VoltageLevelCreationPaneType;

    AttachmentPointPane?: VoltageLevelCreationPaneType;

    AttachedLinePane?: AttachedLinePaneType;
}

export function LineAttachToVoltageLevelCreationForm({
    voltageLevelOptions = [],
    fetchBusesOrBusbarSections,
    lineOptions = [],
    isUpdate = false,
    onNewVoltageLevelCreated,
    NewVoltageLevelPane,
    AttachmentPointPane,
    AttachedLinePane,
}: Readonly<LineAttachToVoltageLevelCreationFormProps>) {
    const [voltageLevelDialogOpen, setVoltageLevelDialogOpen] = useState(false);
    const [attachmentPointDialogOpen, setAttachmentPointDialogOpen] = useState(false);
    const [lineDialogOpen, setLineDialogOpen] = useState(false);
    const { setValue, getValues } = useCustomFormContext();

    const newVoltageLevel: VoltageLevelCreationDto | null = useWatch({ name: FieldConstants.NEW_VOLTAGE_LEVEL });
    const attachmentPoint: VoltageLevelCreationDto | null = useWatch({
        name: FieldConstants.ATTACHMENT_POINT_DETAIL,
    });
    const attachmentLine: LineCreationDto | null = useWatch({ name: FieldConstants.ATTACHMENT_LINE });

    const voltageLevelIdWatch = useWatch({
        name: `${FieldConstants.CONNECTIVITY}.${FieldConstants.VOLTAGE_LEVEL}.${FieldConstants.ID}`,
    });

    const isVoltageLevelEdit = !!voltageLevelIdWatch && newVoltageLevel?.equipmentId === voltageLevelIdWatch;
    // as equipmentId and equipmentName are synchronized to check if the icon is add or edit
    // other attributes than id and name must be present
    const hasSubstationCreation = attachmentPoint?.substationCreation != null;

    const handleCreateVoltageLevel = useCallback(
        (voltageLevel: VoltageLevelCreationDto) => {
            setValue(FieldConstants.NEW_VOLTAGE_LEVEL, voltageLevel, { shouldDirty: true });
            setValue(
                FieldConstants.CONNECTIVITY,
                {
                    ...getValues(FieldConstants.CONNECTIVITY),
                    [FieldConstants.VOLTAGE_LEVEL]: { [FieldConstants.ID]: voltageLevel.equipmentId },
                    [FieldConstants.BUS_OR_BUSBAR_SECTION]: null,
                },
                { shouldDirty: true }
            );
            return onNewVoltageLevelCreated?.(voltageLevel) ?? new Promise<string>(() => {});
        },
        [setValue, getValues, onNewVoltageLevelCreated]
    );

    const handleAttachmentPointModified = useCallback(
        (attachmentPointData: VoltageLevelCreationDto) => {
            setValue(FieldConstants.ATTACHMENT_POINT_DETAIL, attachmentPointData, { shouldDirty: true });
            setValue(FieldConstants.ATTACHMENT_POINT_ID, attachmentPointData.equipmentId, {
                shouldValidate: true,
                shouldDirty: true,
            });
            setValue(FieldConstants.ATTACHMENT_POINT_NAME, attachmentPointData.equipmentName, {
                shouldValidate: true,
                shouldDirty: true,
            });
            return new Promise<string>(() => {});
        },
        [setValue]
    );

    const handleAttachmentPointIdChanged = useCallback(
        (value: string) => {
            const current =
                getValues(FieldConstants.ATTACHMENT_POINT_DETAIL) ?? lineAttachToVoltageLevelEmptyAttachmentPoint;
            setValue(FieldConstants.ATTACHMENT_POINT_DETAIL, { ...current, equipmentId: value }, { shouldDirty: true });
        },
        [setValue, getValues]
    );

    const handleAttachmentPointNameChanged = useCallback(
        (value: string) => {
            const current =
                getValues(FieldConstants.ATTACHMENT_POINT_DETAIL) ?? lineAttachToVoltageLevelEmptyAttachmentPoint;
            setValue(
                FieldConstants.ATTACHMENT_POINT_DETAIL,
                { ...current, equipmentName: value },
                { shouldDirty: true }
            );
        },
        [setValue, getValues]
    );

    const handleAttachedLineCreated = useCallback(
        ({ lineCreationInfos }: { lineCreationInfos: LineCreationDto }) => {
            // clean unused (required) fields by a simple copy with casting
            const {
                type,
                equipmentId,
                equipmentName,
                r,
                x,
                g1,
                b1,
                g2,
                b2,
                operationalLimitsGroups,
                selectedOperationalLimitsGroupId1,
                selectedOperationalLimitsGroupId2,
                properties,
            } = lineCreationInfos;

            const preparedLine: LineCreationDto = {
                type,
                equipmentId,
                equipmentName,
                r,
                x,
                g1,
                b1,
                g2,
                b2,
                operationalLimitsGroups,
                selectedOperationalLimitsGroupId1,
                selectedOperationalLimitsGroupId2,
                properties,
            } as LineCreationDto;

            setValue(FieldConstants.ATTACHMENT_LINE, preparedLine, { shouldDirty: true });
            setValue(FieldConstants.ATTACHMENT_LINE_ID, preparedLine.equipmentId, {
                shouldValidate: true,
                shouldDirty: true,
            });
            return new Promise<string>(() => {});
        },
        [setValue]
    );

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
                        onChange={handleAttachmentPointIdChanged}
                        dataTestId="AttachmentPointIDInput"
                    />
                </GridItem>
                <GridItem>
                    <TextInput
                        name={FieldConstants.ATTACHMENT_POINT_NAME}
                        label="AttachmentPointName"
                        onChange={handleAttachmentPointNameChanged}
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
                    onCreateVoltageLevel={handleAttachmentPointModified}
                    editData={attachmentPoint}
                    isUpdate={isUpdate}
                />
            )}
            {NewVoltageLevelPane && voltageLevelDialogOpen && (
                <NewVoltageLevelPane
                    open
                    onClose={() => setVoltageLevelDialogOpen(false)}
                    onCreateVoltageLevel={handleCreateVoltageLevel}
                    editData={isVoltageLevelEdit ? newVoltageLevel : null}
                    isUpdate={isUpdate}
                />
            )}
            {AttachedLinePane && lineDialogOpen && (
                <AttachedLinePane
                    open
                    onClose={() => setLineDialogOpen(false)}
                    onCreateLine={handleAttachedLineCreated}
                    editData={attachmentLine}
                    isUpdate={isUpdate}
                />
            )}
        </>
    );
}
