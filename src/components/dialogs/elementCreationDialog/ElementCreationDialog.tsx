/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage, useIntl } from 'react-intl';
import { UUID } from 'crypto';
import { useCallback, useEffect, useState } from 'react';
import { Grid, Box, Button, CircularProgress, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../../utils/yupConfig';
import { ElementAttributes, ElementType, FieldConstants, MAX_CHAR_DESCRIPTION } from '../../../utils';
import { CustomMuiDialog } from '../customMuiDialog/CustomMuiDialog';
import { DescriptionField, UniqueNameInput } from '../../inputs';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { useSnackMessage } from '../../../hooks';
import { fetchDirectoryElementPath } from '../../../services';

interface FormData {
    [FieldConstants.NAME]: string;
    [FieldConstants.DESCRIPTION]: string;
}
export interface IElementCreationDialog extends FormData {
    [FieldConstants.FOLDER_NAME]: string;
    [FieldConstants.FOLDER_ID]: UUID;
}

interface ElementCreationDialogProps {
    open: boolean;
    onSave: (data: IElementCreationDialog) => void;
    onClose: () => void;
    type: ElementType;
    titleId: string;
    prefixIdForGeneratedName?: string;
    studyUuid?: UUID; // starting directory can be the same as a given study
    initDirectory?: ElementAttributes; // or a specific directory
}

const schema = yup
    .object()
    .shape({
        [FieldConstants.NAME]: yup.string().trim().required(),
        [FieldConstants.DESCRIPTION]: yup.string().optional().max(MAX_CHAR_DESCRIPTION, 'descriptionLimitError'),
    })
    .required();

type SchemaType = yup.InferType<typeof schema>;

const emptyFormData: FormData = {
    [FieldConstants.NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
};

export function ElementCreationDialog({
    open,
    onSave,
    onClose,
    type,
    titleId,
    prefixIdForGeneratedName,
    studyUuid,
    initDirectory,
}: Readonly<ElementCreationDialogProps>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const [directorySelectorOpen, setDirectorySelectorOpen] = useState(false);
    const [destinationFolder, setDestinationFolder] = useState<TreeViewFinderNodeProps>();

    const formMethods = useForm({
        defaultValues: emptyFormData,
        resolver: yupResolver(schema),
    });
    const {
        reset,
        formState: { errors },
    } = formMethods;

    const disableSave = Object.keys(errors).length > 0;

    const onCancel = () => {
        reset(emptyFormData);
        onClose();
    };

    useEffect(() => {
        if (prefixIdForGeneratedName) {
            const getCurrentDateTime = () => new Date().toISOString();
            const formattedMessage = intl.formatMessage({
                id: prefixIdForGeneratedName,
            });
            const dateTime = getCurrentDateTime();
            reset(
                {
                    ...emptyFormData,
                    [FieldConstants.NAME]: `${formattedMessage}-${dateTime}`,
                },
                { keepDefaultValues: true }
            );
        }
    }, [prefixIdForGeneratedName, intl, reset]);

    useEffect(() => {
        if (open && studyUuid) {
            fetchDirectoryElementPath(studyUuid).then((res) => {
                if (!res || res.length < 2) {
                    snackError({
                        messageTxt: 'unknown study directory',
                        headerId: 'studyDirectoryFetchingError',
                    });
                    return;
                }
                const parentFolderIndex = res.length - 2;
                const { elementUuid, elementName } = res[parentFolderIndex];
                setDestinationFolder({
                    id: elementUuid,
                    name: elementName,
                });
            });
        }
    }, [studyUuid, open, snackError]);

    useEffect(() => {
        if (open && initDirectory) {
            setDestinationFolder({
                id: initDirectory.elementUuid,
                name: initDirectory.elementName,
            });
        }
    }, [initDirectory, open]);

    const handleChangeFolder = () => {
        setDirectorySelectorOpen(true);
    };

    const setSelectedFolder = (folder: TreeViewFinderNodeProps[]) => {
        if (folder?.length > 0 && folder[0].id !== destinationFolder?.id) {
            const { id, name } = folder[0];
            setDestinationFolder({ id, name });
        }
        setDirectorySelectorOpen(false);
    };

    const onSubmit = useCallback<SubmitHandler<SchemaType>>(
        (values) => {
            if (destinationFolder) {
                const creationData: IElementCreationDialog = {
                    [FieldConstants.NAME]: values.name,
                    [FieldConstants.DESCRIPTION]: values.description ?? '',
                    [FieldConstants.FOLDER_NAME]: destinationFolder.name ?? '',
                    [FieldConstants.FOLDER_ID]: destinationFolder.id as UUID,
                };
                onSave(creationData);
            }
        },
        [onSave, destinationFolder]
    );

    const folderChooser = (
        <Grid container item>
            <Grid item>
                <Button onClick={handleChangeFolder} variant="contained" size="small">
                    <FormattedMessage id="showSelectDirectoryDialog" />
                </Button>
            </Grid>
            <Typography m={1} component="span">
                <Box fontWeight="fontWeightBold">
                    {destinationFolder ? destinationFolder.name : <CircularProgress />}
                </Box>
            </Typography>
        </Grid>
    );

    return (
        <CustomMuiDialog
            open={open}
            onClose={onCancel}
            titleId={titleId}
            onSave={onSubmit}
            disabledSave={disableSave}
            formSchema={schema}
            formMethods={formMethods}
        >
            <Grid container spacing={2} marginTop="auto" direction="column">
                <Grid item>
                    <UniqueNameInput
                        name={FieldConstants.NAME}
                        label="name"
                        elementType={type}
                        activeDirectory={destinationFolder?.id as UUID}
                        autoFocus
                    />
                </Grid>
                <Grid item>
                    <DescriptionField />
                </Grid>
                {folderChooser}
            </Grid>
            <DirectoryItemSelector
                open={directorySelectorOpen}
                onClose={setSelectedFolder}
                types={[ElementType.DIRECTORY]}
                onlyLeaves={false}
                multiSelect={false}
                validationButtonText={intl.formatMessage({
                    id: 'validate',
                })}
                title={intl.formatMessage({
                    id: 'showSelectDirectoryDialog',
                })}
            />
        </CustomMuiDialog>
    );
}
