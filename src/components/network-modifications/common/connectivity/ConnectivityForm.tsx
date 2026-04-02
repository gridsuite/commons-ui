/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { CONNECTION_DIRECTIONS, FieldConstants, getConnectionDirectionLabel } from '../../../../utils';
import { SelectInput, SwitchInput, TextInput } from '../../../inputs';
import { CheckboxNullableInput } from '../../../inputs/reactHookForm/CheckboxNullableInput';
import { PositionForm } from './PositionForm';
import { VoltageLevelConnectivityForm, VoltageLevelConnectivityFormProps } from './VoltageLevelConnectivityForm';

/**
 * Hook to handle a 'connectivity value' (voltage level, bus or bus bar section)
 * @param id optional id that has to be defined if the component is used more than once in a form
 * @param voltageLevelSelectLabel label to display for the voltage level auto complete component
 * @param direction direction of placement. Either 'row' or 'column', 'row' by default.
 * @param withDirectionsInfos
 * @param withPosition
 * @param onVoltageLevelChangeCallback callback to be called when the voltage level changes
 * @param isEquipmentModification connectivity form is used in a modification form or not
 * @param previousValues previous values of connectivity form's fields
 * @param voltageLevelOptions list of network voltage levels
 * @param PositionDiagramPane a component type to display current taken positions in the voltage level
 * @param fetchBusesOrBusbarSections a promise to retrieve bus bars for a given voltage level
 * @returns JSX.Element
 */

interface ConnectivityFormProps extends VoltageLevelConnectivityFormProps {}

export function ConnectivityForm({
    id = FieldConstants.CONNECTIVITY,
    voltageLevelSelectLabel = 'VOLTAGE_LEVEL',
    onVoltageLevelChangeCallback = undefined,
    isEquipmentModification = false,
    previousValues,
    voltageLevelOptions = [],
    PositionDiagramPane,
    fetchBusesOrBusbarSections,
}: Readonly<ConnectivityFormProps>) {
    const intl = useIntl();

    const previousConnectedField = useMemo(() => {
        if (!isEquipmentModification || previousValues?.terminalConnected == null) {
            return null;
        }
        return previousValues.terminalConnected
            ? intl.formatMessage({ id: 'connected' })
            : intl.formatMessage({ id: 'disconnected' });
    }, [intl, previousValues, isEquipmentModification]);

    const previousConnectionDirectionLabel = isEquipmentModification
        ? (getConnectionDirectionLabel(previousValues?.connectablePosition?.connectionDirection) ?? null)
        : null;

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <VoltageLevelConnectivityForm
                    id={id}
                    voltageLevelSelectLabel={voltageLevelSelectLabel}
                    onVoltageLevelChangeCallback={onVoltageLevelChangeCallback}
                    previousValues={previousValues}
                    voltageLevelOptions={voltageLevelOptions}
                    fetchBusesOrBusbarSections={fetchBusesOrBusbarSections}
                />
            </Grid>
            <Grid item xs={4}>
                {isEquipmentModification ? (
                    <CheckboxNullableInput
                        name={`${id}.${FieldConstants.CONNECTED}`}
                        label="connected"
                        previousValue={previousConnectedField ?? undefined}
                    />
                ) : (
                    <SwitchInput name={`${id}.${FieldConstants.CONNECTED}`} label="connected" />
                )}
            </Grid>
            <Grid item xs={4}>
                <TextInput
                    name={`${id}.${FieldConstants.CONNECTION_NAME}`}
                    label="ConnectionName"
                    previousValue={
                        isEquipmentModification
                            ? (previousValues?.connectablePosition?.connectionName ?? undefined)
                            : undefined
                    }
                />
            </Grid>
            <Grid item xs={4}>
                <SelectInput
                    name={`${id}.${FieldConstants.CONNECTION_DIRECTION}`}
                    label="ConnectionDirection"
                    options={Object.values(CONNECTION_DIRECTIONS)}
                    previousValue={
                        (previousConnectionDirectionLabel &&
                            intl.formatMessage({
                                id: previousConnectionDirectionLabel,
                            })) ??
                        undefined
                    }
                    fullWidth
                    size="small"
                />
            </Grid>
            <Grid item xs={4}>
                <PositionForm
                    id={id}
                    PositionDiagramPane={PositionDiagramPane}
                    previousValues={previousValues}
                    isEquipmentModification={isEquipmentModification}
                />
            </Grid>
        </Grid>
    );
}
