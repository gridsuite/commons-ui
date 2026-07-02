/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Tab, Tabs } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { UseFieldArrayAppend, useWatch } from 'react-hook-form';
import { ContextMenuCoordinates, LimitsGroupsContextualMenu } from './LimitsGroupsContextualMenu';
import { OperationalLimitsGroupTabLabel } from './OperationalLimitsGroupTabLabel';
import { OperationalLimitsGroupFormSchema } from './operationalLimitsGroups.types';
import { limitsStyles } from './operationalLimitsGroupsStyles';
import { CurrentLimitsData } from './limits.types';
import { FieldConstants } from '../../../../utils';

export interface OperationalLimitsGroupsTabsProps {
    parentFormName: string;
    indexSelectedLimitSet: number | null;
    setIndexSelectedLimitSet: React.Dispatch<React.SetStateAction<number | null>>;
    currentLimitsToModify: CurrentLimitsData[];
    editable: boolean;
    appendToLimitsGroups: UseFieldArrayAppend<
        {
            [p: string]: OperationalLimitsGroupFormSchema[];
        },
        string
    >;
    removeLimitsGroups: () => void;
}

export function OperationalLimitsGroupsTabs({
    parentFormName,
    setIndexSelectedLimitSet,
    indexSelectedLimitSet,
    editable,
    appendToLimitsGroups,
    removeLimitsGroups,
    currentLimitsToModify,
}: Readonly<OperationalLimitsGroupsTabsProps>) {
    const [hoveredRowIndex, setHoveredRowIndex] = useState(-1);
    const [contextMenuCoordinates, setContextMenuCoordinates] = useState<ContextMenuCoordinates>({
        x: null,
        y: null,
        tabIndex: null,
    });
    const selectedLimitsGroups1: string = useWatch({
        name: `${parentFormName}.${FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1}`,
    });
    const selectedLimitsGroups2: string = useWatch({
        name: `${parentFormName}.${FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2}`,
    });

    const operationalLimitsGroups: OperationalLimitsGroupFormSchema[] = useWatch({
        name: `${parentFormName}.${FieldConstants.OPERATIONAL_LIMITS_GROUPS}`,
    });

    const handleOpenMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>, index: number): void => {
            if (!editable) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            setIndexSelectedLimitSet(index);
            setContextMenuCoordinates({
                x: event.clientX,
                y: event.clientY,
                tabIndex: index,
            });
        },
        [editable, setIndexSelectedLimitSet]
    );

    const handleCloseMenu = useCallback(() => {
        setContextMenuCoordinates({
            x: null,
            y: null,
            tabIndex: null,
        });
    }, [setContextMenuCoordinates]);

    useEffect(() => {
        // as long as there are limit sets, one should be selected
        if (indexSelectedLimitSet === null && operationalLimitsGroups?.length) {
            setIndexSelectedLimitSet(0);
        }
    }, [indexSelectedLimitSet, setIndexSelectedLimitSet, operationalLimitsGroups]);

    const handleTabChange = useCallback(
        (_event: React.SyntheticEvent, newValue: number): void => {
            setIndexSelectedLimitSet(newValue);
        },
        [setIndexSelectedLimitSet]
    );

    return (
        <Grid>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={indexSelectedLimitSet !== null && indexSelectedLimitSet}
                onChange={handleTabChange}
                sx={limitsStyles.tabs}
            >
                {operationalLimitsGroups?.map((opLg: OperationalLimitsGroupFormSchema, index: number) => (
                    <Tab
                        onMouseEnter={() => setHoveredRowIndex(index)}
                        onContextMenu={(e) => handleOpenMenu(e, index)}
                        key={opLg.id}
                        disableRipple
                        sx={limitsStyles.tabBackground}
                        label={
                            <OperationalLimitsGroupTabLabel
                                operationalLimitsGroup={opLg}
                                showIconButton={editable && index === hoveredRowIndex}
                                limitsPropertiesName={`${parentFormName}.${FieldConstants.OPERATIONAL_LIMITS_GROUPS}[${index}].${FieldConstants.LIMITS_PROPERTIES}`}
                                handleOpenMenu={handleOpenMenu}
                                index={index}
                            />
                        }
                    />
                ))}
            </Tabs>
            <LimitsGroupsContextualMenu
                parentFormName={parentFormName}
                indexSelectedLimitSet={indexSelectedLimitSet}
                setIndexSelectedLimitSet={setIndexSelectedLimitSet}
                handleCloseMenu={handleCloseMenu}
                contextMenuCoordinates={contextMenuCoordinates}
                selectedLimitsGroups1={selectedLimitsGroups1}
                selectedLimitsGroups2={selectedLimitsGroups2}
                currentLimitsToModify={currentLimitsToModify}
                operationalLimitsGroups={operationalLimitsGroups}
                appendToLimitsGroups={appendToLimitsGroups}
                removeLimitsGroups={removeLimitsGroups}
            />
        </Grid>
    );
}
