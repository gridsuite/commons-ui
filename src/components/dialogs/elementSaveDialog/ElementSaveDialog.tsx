/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage, useIntl } from 'react-intl';
import { UUID } from 'crypto';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { DescriptionField, RadioInput, UniqueNameInput } from '../../inputs';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { CustomMuiDialog } from '../customMuiDialog/CustomMuiDialog';
import { ElementAttributes, ElementType, FieldConstants, MAX_CHAR_DESCRIPTION } from '../../../utils';
import { useSnackMessage } from '../../../hooks';
import { fetchDirectoryElementPath } from '../../../services';

// Define operation types
enum OperationType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
}

// Base interface with common fields used by all interfaces
export interface IElementCommonFields {
    [FieldConstants.NAME]: string;
    [FieldConstants.DESCRIPTION]: string;
}

interface FormData extends IElementCommonFields {
    [FieldConstants.OPERATION_TYPE]: OperationType;
}
export interface IElementCreationDialog extends IElementCommonFields {
    [FieldConstants.FOLDER_NAME]: string;
    [FieldConstants.FOLDER_ID]: UUID;
}

export interface IElementUpdateDialog extends IElementCommonFields {
    [FieldConstants.ID]: UUID;
    parentFolderId?: UUID;
    elementFullPath: string;
}

export type ElementSaveDialogProps = {
    open: boolean;
    onClose: () => void;
    type: ElementType;
    titleId: string;
    onSave: (data: IElementCreationDialog) => void;
    OnUpdate?: (data: IElementUpdateDialog) => void;
    prefixIdForGeneratedName?: string;
    initialOperation?: OperationType;
    selectorTitleId?: string;
    createLabelId?: string;
    updateLabelId?: string;
    createOnlyMode?: boolean;
} & (
    | {
          /** createOnlyMode uses only CREATE operation */
          createOnlyMode: true;
          selectorTitleId?: string;
          createLabelId?: string;
          updateLabelId?: string;
      }
    | {
          /** Standard mode requires label IDs for both operations and update callback */
          createOnlyMode?: false;
          selectorTitleId: string;
          createLabelId: string;
          updateLabelId: string;
          OnUpdate: (data: IElementUpdateDialog) => void;
      }
) &
    (
        | {
              /** starting directory can be the same as a given study */
              studyUuid: UUID;
              initDirectory?: never;
          }
        | {
              studyUuid?: never;
              /** or directly a given directory */
              initDirectory?: ElementAttributes;
          }
    );

const emptyFormData: FormData = {
    [FieldConstants.NAME]: '',
    [FieldConstants.DESCRIPTION]: '',
    [FieldConstants.OPERATION_TYPE]: OperationType.CREATE,
};

export function ElementSaveDialog({
    open,
    onSave,
    OnUpdate,
    onClose,
    type,
    titleId,
    prefixIdForGeneratedName,
    studyUuid,
    initDirectory,
    initialOperation = OperationType.CREATE,
    selectorTitleId,
    createLabelId,
    updateLabelId,
    createOnlyMode = false,
}: Readonly<ElementSaveDialogProps>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    // Directory/Item selector states
    const [directorySelectorOpen, setDirectorySelectorOpen] = useState(false);
    const [destinationFolder, setDestinationFolder] = useState<TreeViewFinderNodeProps>();
    const [selectedItem, setSelectedItem] = useState<
        TreeViewFinderNodeProps & { parentFolderId: UUID; fullPath: string }
    >();

    const schema = useMemo(
        () =>
            yup
                .object()
                .shape({
                    [FieldConstants.NAME]: yup.string().trim().required(),
                    [FieldConstants.DESCRIPTION]: yup
                        .string()
                        .optional()
                        .max(MAX_CHAR_DESCRIPTION, intl.formatMessage({ id: 'descriptionLimitError' })),
                    [FieldConstants.OPERATION_TYPE]: yup.string().oneOf(Object.values(OperationType)).required(),
                })
                .required(),
        [intl]
    );

    type SchemaType = yup.InferType<typeof schema>;

    // Form handling with conditional defaultValues
    const formMethods = useForm({
        defaultValues: {
            ...emptyFormData,
            [FieldConstants.OPERATION_TYPE]: createOnlyMode ? OperationType.CREATE : initialOperation,
        },
        resolver: yupResolver(schema),
    });

    const {
        reset,
        setValue,
        watch,
        formState: { errors },
    } = formMethods;

    // Force create mode if in legacy mode
    const operationType = createOnlyMode ? OperationType.CREATE : watch(FieldConstants.OPERATION_TYPE);
    const isCreateMode = operationType === OperationType.CREATE;

    const disableSave =
        Object.keys(errors).length > 0 || (isCreateMode && !destinationFolder) || (!isCreateMode && !selectedItem);

    // Handle cancellation
    const onCancel = useCallback(() => {
        reset({ ...emptyFormData, [FieldConstants.OPERATION_TYPE]: initialOperation });
        onClose();
    }, [onClose, reset, initialOperation]);

    // Set prefixed name for creation if provided
    useEffect(() => {
        if (isCreateMode && prefixIdForGeneratedName) {
            const getCurrentDateTime = () => new Date().toISOString();
            const formattedMessage = intl.formatMessage({
                id: prefixIdForGeneratedName,
            });
            const dateTime = getCurrentDateTime();
            reset(
                { ...emptyFormData, [FieldConstants.NAME]: `${formattedMessage}-${dateTime}` },
                { keepDefaultValues: true }
            );
        }
    }, [prefixIdForGeneratedName, intl, reset, isCreateMode]);

    // Fetch study directory for creation if needed
    useEffect(() => {
        if (open && isCreateMode && studyUuid) {
            fetchDirectoryElementPath(studyUuid).then((res) => {
                if (!res || res.length < 2) {
                    snackError({ messageTxt: 'unknown study directory', headerId: 'studyDirectoryFetchingError' });
                    return;
                }
                const parentFolderIndex = res.length - 2;
                const { elementUuid, elementName } = res[parentFolderIndex];
                setDestinationFolder({ id: elementUuid, name: elementName });
            });
        }
    }, [studyUuid, open, snackError, isCreateMode]);

    // Set initial directory for creation if provided
    useEffect(() => {
        if (open && isCreateMode && initDirectory) {
            setDestinationFolder({ id: initDirectory.elementUuid, name: initDirectory.elementName });
        }
    }, [initDirectory, open, isCreateMode]);

    // Open selector dialog
    const handleChangeFolder = useCallback(() => {
        setDirectorySelectorOpen(true);
    }, []);

    // Handle selection for CREATE mode
    const handleSelection = useCallback(
        (items: TreeViewFinderNodeProps[]) => {
            if (isCreateMode) {
                // Handle directory selection for creation
                if (items?.length > 0 && items[0].id !== destinationFolder?.id) {
                    const { id, name } = items[0];
                    setDestinationFolder({ id, name });
                }
            } else if (items?.length > 0 && items[0].id !== selectedItem?.id) {
                // Handle item selection for update
                const { id, name, description, parents } = items[0];

                if (!parents) {
                    snackError({ messageTxt: 'errorNoParent', headerId: 'error' });
                    return;
                }
                const fullPath = [...parents.map((parent) => parent.name), name].join('/');
                const parentFolderId = parents[parents.length - 1].id;

                setSelectedItem({ id, name, description, parentFolderId, fullPath });
                setValue(FieldConstants.DESCRIPTION, description ?? '', { shouldDirty: true });
                setValue(FieldConstants.NAME, name, { shouldDirty: true });
            }
            setDirectorySelectorOpen(false);
        },
        [isCreateMode, destinationFolder?.id, selectedItem?.id, setValue, snackError]
    );

    // Form submission handler
    const onSubmit = useCallback<SubmitHandler<SchemaType>>(
        (values) => {
            if (isCreateMode && destinationFolder && onSave) {
                // Handle creation
                const creationData: IElementCreationDialog = {
                    [FieldConstants.NAME]: values.name,
                    [FieldConstants.DESCRIPTION]: values.description ?? '',
                    [FieldConstants.FOLDER_NAME]: destinationFolder.name ?? '',
                    [FieldConstants.FOLDER_ID]: destinationFolder.id,
                };
                onSave(creationData);
            } else if (!isCreateMode && selectedItem && OnUpdate) {
                // Handle update
                const updateData: IElementUpdateDialog = {
                    [FieldConstants.ID]: selectedItem.id,
                    [FieldConstants.NAME]: values.name,
                    [FieldConstants.DESCRIPTION]: values.description ?? '',
                    elementFullPath: selectedItem.fullPath,
                    parentFolderId: selectedItem.parentFolderId,
                };
                OnUpdate(updateData);
            }
        },
        [isCreateMode, onSave, OnUpdate, destinationFolder, selectedItem]
    );

    // Render folder/item chooser
    const renderChooser = () => {
        if (isCreateMode) {
            return (
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
        }
        return (
            <Grid container item>
                <Grid item>
                    <Button onClick={handleChangeFolder} variant="contained" size="small">
                        <FormattedMessage id="showSelectDirectoryItemDialog" />
                    </Button>
                </Grid>
                <Typography m={1} component="span">
                    <Box fontWeight="fontWeightBold">{selectedItem ? selectedItem.fullPath : null}</Box>
                </Typography>
            </Grid>
        );
    };

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
                {!createOnlyMode && (
                    <Grid item>
                        <RadioInput
                            name={FieldConstants.OPERATION_TYPE}
                            options={[
                                { id: OperationType.CREATE, label: intl.formatMessage({ id: createLabelId }) },
                                { id: OperationType.UPDATE, label: intl.formatMessage({ id: updateLabelId }) },
                            ]}
                            formProps={{
                                sx: {
                                    '& .MuiFormControlLabel-root': { marginRight: 15 },
                                },
                            }}
                        />
                    </Grid>
                )}
                <Grid item>
                    <UniqueNameInput
                        name={FieldConstants.NAME}
                        label="name"
                        elementType={type}
                        currentName={!isCreateMode ? selectedItem?.name : undefined}
                        activeDirectory={isCreateMode ? destinationFolder?.id : selectedItem?.parentFolderId}
                        autoFocus
                    />
                </Grid>
                <Grid item>
                    <DescriptionField />
                </Grid>
                {renderChooser()}
            </Grid>
            <DirectoryItemSelector
                key={isCreateMode ? destinationFolder?.id : selectedItem?.id}
                open={directorySelectorOpen}
                onClose={handleSelection}
                types={isCreateMode ? [ElementType.DIRECTORY] : [type]}
                onlyLeaves={isCreateMode ? false : undefined}
                multiSelect={false}
                validationButtonText={intl.formatMessage({ id: 'validate' })}
                title={intl.formatMessage({ id: isCreateMode ? 'showSelectDirectoryDialog' : selectorTitleId })}
            />
        </CustomMuiDialog>
    );
}
