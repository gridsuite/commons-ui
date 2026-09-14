/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, IconButton } from '@mui/material';
import { ExploreOffOutlined, ExploreOutlined } from '@mui/icons-material';
import { useCallback, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { CustomTooltip } from '../../../../components/ui/tooltip/CustomTooltip';
import { IntegerInput, useCustomFormContext } from '../../../../components/ui';
import { FieldConstants } from '../../../../utils';
import { ConnectablePositionFormInfos, ConnectivityNetworkProps } from './connectivity.type';

interface PositionFormProps extends Pick<ConnectivityNetworkProps, 'PositionDiagramPane'> {
    id?: string;
    isEquipmentModification?: boolean;
    previousValues?: {
        connectablePosition?: ConnectablePositionFormInfos;
        voltageLevelId?: string;
    };
}

export function PositionForm({
    id = FieldConstants.CONNECTIVITY,
    isEquipmentModification = false,
    previousValues,
    PositionDiagramPane,
}: Readonly<PositionFormProps>) {
    const intl = useIntl();

    const [isDiagramPaneOpen, setIsDiagramPaneOpen] = useState(false);
    const { isNodeBuilt } = useCustomFormContext();

    const watchVoltageLevelId: string | null | undefined = useWatch({
        name: `${id}.${FieldConstants.VOLTAGE_LEVEL}.${FieldConstants.ID}`,
    });

    const handleClickOpenDiagramPane = useCallback(() => {
        setIsDiagramPaneOpen(true);
    }, []);

    const handleCloseDiagramPane = useCallback(() => {
        setIsDiagramPaneOpen(false);
    }, []);

    const voltageLevelForPositionIcon = useMemo(
        () => watchVoltageLevelId ?? (isEquipmentModification ? previousValues?.voltageLevelId : undefined),
        [watchVoltageLevelId, isEquipmentModification, previousValues?.voltageLevelId]
    );

    const getPositionIconTooltipMessageId = useMemo(() => {
        if (!isNodeBuilt) {
            return 'NodeNotBuildPositionMessage';
        }
        if (voltageLevelForPositionIcon) {
            return 'DisplayTakenPositions';
        }
        return 'NoVoltageLevelPositionMessage';
    }, [isNodeBuilt, voltageLevelForPositionIcon]);

    return (
        <Grid container spacing={2}>
            <Grid size="grow">
                <IntegerInput
                    name={`${id}.${FieldConstants.CONNECTION_POSITION}`}
                    label="ConnectionPosition"
                    previousValue={
                        isEquipmentModification
                            ? (previousValues?.connectablePosition?.connectionPosition ?? undefined)
                            : undefined
                    }
                    clearable
                />
            </Grid>
            {PositionDiagramPane && (
                <>
                    <Grid size={1}>
                        <IconButton
                            {...(isNodeBuilt && voltageLevelForPositionIcon && { onClick: handleClickOpenDiagramPane })}
                            disableRipple={!isNodeBuilt || !voltageLevelForPositionIcon}
                            edge="start"
                        >
                            <CustomTooltip
                                title={intl.formatMessage({
                                    id: getPositionIconTooltipMessageId,
                                })}
                            >
                                {isNodeBuilt && voltageLevelForPositionIcon ? (
                                    <ExploreOutlined color="action" />
                                ) : (
                                    <ExploreOffOutlined color="action" />
                                )}
                            </CustomTooltip>
                        </IconButton>
                    </Grid>
                    {voltageLevelForPositionIcon && (
                        <PositionDiagramPane
                            open={isDiagramPaneOpen}
                            onClose={handleCloseDiagramPane}
                            voltageLevelId={voltageLevelForPositionIcon}
                        />
                    )}
                </>
            )}
        </Grid>
    );
}
