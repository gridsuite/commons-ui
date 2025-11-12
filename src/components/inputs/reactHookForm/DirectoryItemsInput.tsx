/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormControl, Grid, IconButton, Tooltip } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useController, useFieldArray, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import { FieldLabel, isFieldRequired } from './utils';
import { useCustomFormContext } from './provider';
import { ErrorInput, MidFormError } from './errorManagement';
import { useSnackMessage } from '../../../hooks';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { type MuiStyles } from '../../../utils/styles';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { fetchDirectoryElementPath } from '../../../services';
import { ArrayAction, ElementAttributes, EQUIPMENT_TYPE, mergeSx } from '../../../utils';
import { NAME } from './constants';
import { DirectoryItemChip, DirectoryItemChipProps } from './DirectoryItemChip';
import { DirectoryItemChipWithHelperTextProps } from './DirectoryItemChipWithHelperText';

const styles = {
    formDirectoryElements1: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        flexDirection: 'row',
        border: '2px solid lightgray',
        padding: '4px',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    formDirectoryElementsError: (theme) => ({
        borderColor: theme.palette.error.main,
    }),
    formDirectoryElements2: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginTop: 0,
        padding: '4px',
        overflow: 'hidden',
    },
    addDirectoryElements: {
        marginTop: '-5px',
    },
} as const satisfies MuiStyles;

export interface DirectoryItemsInputProps {
    label: string | undefined;
    name: string;
    elementType: string;
    equipmentTypes?: string[];
    itemFilter?: (val: ElementAttributes) => boolean;
    titleId?: string;
    hideErrorMessage?: boolean;
    onRowChanged?: (a: boolean) => void;
    onChange?: (e: any, action?: ArrayAction, element?: any) => void;
    disable?: boolean;
    allowMultiSelect?: boolean;
    labelRequiredFromContext?: boolean;
    ChipComponent?: React.ComponentType<DirectoryItemChipProps & DirectoryItemChipWithHelperTextProps>;
    chipProps?: DirectoryItemChipProps & DirectoryItemChipWithHelperTextProps;
}

export function DirectoryItemsInput({
    label,
    name,
    elementType, // Used to specify type of element (Filter, Contingency list, ...)
    equipmentTypes, // Mostly used for filters, it allows the user to get elements of specific equipment only
    itemFilter, // Used to further filter the results displayed according to specific requirement
    titleId, // title of directory item selector dialogue
    hideErrorMessage,
    onRowChanged,
    onChange,
    disable = false,
    allowMultiSelect = true,
    labelRequiredFromContext = true,
    ChipComponent,
    chipProps,
}: Readonly<DirectoryItemsInputProps>) {
    const { snackError } = useSnackMessage();
    const intl = useIntl();
    const [selected, setSelected] = useState<UUID[]>([]);
    const [expanded, setExpanded] = useState<UUID[]>([]);
    const [multiSelect, setMultiSelect] = useState(allowMultiSelect);
    const types = useMemo(() => [elementType], [elementType]);
    const [directoryItemSelectorOpen, setDirectoryItemSelectorOpen] = useState(false);
    const {
        fields: elements,
        append,
        remove,
    } = useFieldArray<{ [key: string]: TreeViewFinderNodeProps[] }>({
        name,
    });

    const formContext = useCustomFormContext();
    const { getValues, validationSchema, setError, clearErrors, getFieldState } = formContext;
    const watchedElements = useWatch({ name }) as FieldValues[] | undefined;

    const {
        fieldState: { error },
    } = useController({
        name,
    });

    const addElements = useCallback(
        (values: TreeViewFinderNodeProps[] | undefined) => {
            if (!values) {
                return;
            }
            // if we select a chip and return a new values, we remove it to be replaced
            if (selected?.length > 0 && values?.length > 0) {
                selected.forEach((chip) => {
                    remove(getValues(name).findIndex((item: FieldValues) => item.id === chip));
                });
            }
            values.forEach((value) => {
                const { icon, children, ...otherElementAttributes } = value;

                // Check if the element is already present
                if (getValues(name).find((v: FieldValues) => v?.id === otherElementAttributes.id) !== undefined) {
                    snackError({
                        messageTxt: '',
                        headerId: 'directory_items_input/ElementAlreadyUsed',
                    });
                } else {
                    append(otherElementAttributes);
                    onRowChanged?.(true);
                    onChange?.(getValues(name), ArrayAction.ADD, otherElementAttributes);
                }
            });
            setDirectoryItemSelectorOpen(false);
            setSelected([]);
        },
        [append, getValues, snackError, name, onRowChanged, onChange, selected, remove]
    );

    const removeElements = useCallback(
        (index: number) => {
            const currentValues = getValues(name);
            remove(index);
            onRowChanged?.(true);
            onChange?.(currentValues, ArrayAction.REMOVE, currentValues[index]);
        },
        [onRowChanged, remove, getValues, name, onChange]
    );

    const handleChipClick = useCallback(
        (index: number) => {
            const chips = getValues(name);
            const chip = chips.at(index)?.id;
            if (chip) {
                fetchDirectoryElementPath(chip).then((response: ElementAttributes[]) => {
                    const path = response.filter((e) => e.elementUuid !== chip).map((e) => e.elementUuid);

                    setExpanded(path);
                    setSelected([chip]);
                    setDirectoryItemSelectorOpen(true);
                    setMultiSelect(false);
                });
            }
        },
        [getValues, name]
    );

    const shouldReplaceElement = useMemo(() => {
        return allowMultiSelect === false && elements?.length === 1;
    }, [allowMultiSelect, elements]);

    const hasElementsWithoutName = useMemo(() => {
        const elementsToCheck = (watchedElements ?? elements) as FieldValues[] | undefined;

        return (elementsToCheck ?? []).some((item) => !item?.[NAME]);
    }, [elements, watchedElements]);

    useEffect(() => {
        const errorMessage = intl.formatMessage({ id: 'elementNotFound' });
        const fieldState = getFieldState(name);

        if (hasElementsWithoutName) {
            if (fieldState.error?.message !== errorMessage) {
                setError(name as any, {
                    type: 'manual',
                    message: errorMessage,
                });
            }
        } else if (fieldState.error?.type === 'manual' && fieldState.error?.message === errorMessage) {
            clearErrors(name as any);
        }
    }, [clearErrors, getFieldState, hasElementsWithoutName, intl, name, setError]);

    return (
        <>
            <FormControl
                sx={mergeSx(
                    styles.formDirectoryElements1,
                    // @ts-expect-error
                    error?.message && styles.formDirectoryElementsError
                )}
                error={!!error?.message}
            >
                {elements?.length === 0 && label && (
                    <FieldLabel
                        label={label}
                        optional={labelRequiredFromContext && !isFieldRequired(name, validationSchema, getValues())}
                    />
                )}
                {elements?.length > 0 && (
                    <FormControl sx={styles.formDirectoryElements2}>
                        {elements.map((item, index) => {
                            const elementName =
                                watchedElements?.[index]?.[NAME] ??
                                getValues(`${name}.${index}.${NAME}`) ??
                                (item as FieldValues)?.[NAME];

                            const ChipToRender = ChipComponent ?? DirectoryItemChip;

                            const equipmentTypeTagLabel =
                                (item?.specificMetadata?.equipmentType &&
                                    EQUIPMENT_TYPE[item.specificMetadata.equipmentType as keyof typeof EQUIPMENT_TYPE]
                                        ?.tagLabel) ??
                                '';

                            return (
                                <ChipToRender
                                    key={item.id}
                                    index={index}
                                    name={name}
                                    elementName={elementName}
                                    onDelete={() => removeElements(index)}
                                    onClick={() => handleChipClick(index)}
                                    {...(equipmentTypeTagLabel && {
                                        helperText: intl.formatMessage({
                                            id: equipmentTypeTagLabel,
                                        }),
                                    })}
                                    {...chipProps}
                                />
                            );
                        })}
                    </FormControl>
                )}
                <Grid item xs>
                    <Grid container direction="row-reverse">
                        <Tooltip title={intl.formatMessage({ id: titleId })}>
                            <span>
                                <IconButton
                                    sx={styles.addDirectoryElements}
                                    size="small"
                                    disabled={disable}
                                    onClick={() => {
                                        if (shouldReplaceElement) {
                                            handleChipClick(0);
                                        } else {
                                            setDirectoryItemSelectorOpen(true);
                                            if (allowMultiSelect) {
                                                setMultiSelect(true);
                                            }
                                        }
                                    }}
                                >
                                    <FolderIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                </Grid>
            </FormControl>
            {!hideErrorMessage && <ErrorInput name={name} InputField={MidFormError} />}
            <DirectoryItemSelector
                open={directoryItemSelectorOpen}
                onClose={addElements}
                types={types}
                equipmentTypes={equipmentTypes}
                title={intl.formatMessage({ id: titleId })}
                itemFilter={itemFilter}
                selected={selected}
                expanded={expanded}
                multiSelect={multiSelect}
            />
        </>
    );
}
