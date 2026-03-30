/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IconButton } from '@mui/material';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
import { FieldConstants } from '../../../../../../../utils';
import { CreateSwitchesFormData, SwitchKind, SwitchKindFormData } from '../../../voltageLevelCreation.types';
import GridItem from '../../../../../../grid/grid-item';
import { TextInput } from '../../../../../../inputs';
import { CreateSwitchesDialog } from './creation';

export function SwitchesBetweenSections() {
    const { getValues, setValue } = useFormContext();
    const [openCreateSwitchesDialog, setOpenCreateSwitchesDialog] = useState(false);

    const watchSectionCount: number = useWatch({ name: FieldConstants.SECTION_COUNT });
    const watchSwitchesBetweenSections: string = useWatch({
        name: FieldConstants.SWITCHES_BETWEEN_SECTIONS,
    });

    const addIconAdornment = useCallback((clickCallback: () => void): ReactElement => {
        return (
            <IconButton onClick={clickCallback}>
                <ArrowDropDownIcon />
            </IconButton>
        );
    }, []);

    const handleClickOpenSwitchesPane = useCallback(() => {
        if (watchSectionCount > 1) {
            setOpenCreateSwitchesDialog(true);
        }
    }, [watchSectionCount]);

    const intl = useIntl();
    const setSwitchesKinds = useCallback(
        (data: CreateSwitchesFormData) => {
            const map = data[FieldConstants.SWITCH_KINDS].map((switchData) => {
                return intl.formatMessage({ id: switchData[FieldConstants.SWITCH_KIND] });
            });
            setValue(FieldConstants.SWITCHES_BETWEEN_SECTIONS, map.join(' / '), {
                shouldValidate: true,
                shouldDirty: true,
            });
            setValue(FieldConstants.SWITCH_KINDS, data[FieldConstants.SWITCH_KINDS]);
        },
        [intl, setValue]
    );

    const handleCreateSwitchesDialog = useCallback(
        (data: CreateSwitchesFormData) => {
            setSwitchesKinds(data);
        },
        [setSwitchesKinds]
    );

    const sectionCountRef = useRef<number>(watchSectionCount);
    const switchesBetweenSectionsRef = useRef<string>(watchSwitchesBetweenSections);

    useEffect(() => {
        // If the user changes the section count, we reset the switches between sections
        if (
            sectionCountRef.current !== watchSectionCount &&
            switchesBetweenSectionsRef.current === watchSwitchesBetweenSections
        ) {
            const initialKindDisconnector: SwitchKindFormData = { switchKind: SwitchKind.DISCONNECTOR };
            let list = [];
            if (watchSectionCount >= 1) {
                list = new Array(watchSectionCount - 1).fill(initialKindDisconnector);
            }
            const data: CreateSwitchesFormData = { switchKinds: list };
            setSwitchesKinds(data);
        }
        sectionCountRef.current = watchSectionCount;
        switchesBetweenSectionsRef.current = watchSwitchesBetweenSections;
    }, [watchSectionCount, watchSwitchesBetweenSections, setSwitchesKinds]);

    if (Number.isNaN(watchSectionCount) || watchSectionCount <= 1) {
        return null;
    }

    return (
        <>
            <GridItem size={4}>
                <TextInput
                    name={FieldConstants.SWITCHES_BETWEEN_SECTIONS}
                    label="SwitchesBetweenSections"
                    formProps={{
                        multiline: true,
                    }}
                    customAdornment={addIconAdornment(handleClickOpenSwitchesPane)}
                />
            </GridItem>
            {openCreateSwitchesDialog && (
                <CreateSwitchesDialog
                    openCreateSwitchesDialog={openCreateSwitchesDialog}
                    setOpenCreateSwitchesDialog={setOpenCreateSwitchesDialog}
                    handleCreateSwitchesDialog={handleCreateSwitchesDialog}
                    sectionCount={getValues(FieldConstants.SECTION_COUNT)}
                    switchKinds={getValues(FieldConstants.SWITCH_KINDS)}
                />
            )}
        </>
    );
}
