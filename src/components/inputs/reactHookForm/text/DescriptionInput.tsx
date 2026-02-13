/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, IconButton, Tooltip } from '@mui/material';
import { useController } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { EditNoteIcon } from '../../../icons';
import { MuiStyles } from '../../../../utils';
import { useCustomFormContext } from '../provider';
import { DescriptionModificationDialog } from '../../../dialogs/descriptionModificationDialog';

const styles = {
    descriptionTooltip: {
        display: 'inline-block',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: '250px',
        maxHeight: '50px',
        cursor: 'pointer',
    },
    coloredButton: (theme) => ({
        color: theme.palette.text.primary,
    }),
} as const satisfies MuiStyles;

export type DescriptionInputProps = { name: string };

export function DescriptionInput({ name }: Readonly<DescriptionInputProps>) {
    const {
        field: { value },
    } = useController({ name });
    const formContext = useCustomFormContext();

    const [openDescModificationDialog, setOpenDescModificationDialog] = useState(false);

    const updateModification = useCallback(
        (descriptionRecord: Record<string, string>) => {
            const newDescription = descriptionRecord?.description ?? '';
            formContext.setValue(name, newDescription, {
                shouldValidate: true,
                shouldDirty: true,
            });
        },
        [formContext, name]
    );

    const handleDescDialogClose = useCallback(() => {
        setOpenDescModificationDialog(false);
    }, [setOpenDescModificationDialog]);

    const handleModifyDescription = useCallback(() => {
        setOpenDescModificationDialog(true);
    }, [setOpenDescModificationDialog]);

    const descriptionLines = value?.split('\n');
    if (descriptionLines?.length > 3) {
        descriptionLines[2] = '...';
    }

    const tooltipBox = value ? <Box sx={styles.descriptionTooltip}> {descriptionLines?.join('\n')} </Box> : undefined;
    const icon = (
        <Tooltip title={tooltipBox} arrow placement="right">
            <IconButton onClick={handleModifyDescription} sx={styles.coloredButton}>
                <EditNoteIcon empty={!value} />
            </IconButton>
        </Tooltip>
    );

    return (
        <>
            {openDescModificationDialog && (
                <DescriptionModificationDialog
                    open
                    description={value ?? ''}
                    onClose={handleDescDialogClose}
                    updateForm={updateModification}
                />
            )}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    verticalAlign: 'middle',
                    cursor: undefined,
                }}
            >
                {icon}
            </Box>
        </>
    );
}
