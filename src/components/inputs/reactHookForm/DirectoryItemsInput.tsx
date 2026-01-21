/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, FormControl, IconButton, InputLabel, OutlinedInput, Select, Tooltip } from '@mui/material';
import { DriveFolderUpload } from '@mui/icons-material';
import { ComponentType, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useController, useFieldArray, useWatch } from 'react-hook-form';
import { useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import { useCustomFormContext } from './provider';
import { ErrorInput, MidFormError } from './errorManagement';
import { useSnackMessage } from '../../../hooks';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { type MuiStyles } from '../../../utils/styles';
import { DirectoryItemSelector } from '../../directoryItemSelector';
import { fetchDirectoryElementPath } from '../../../services';
import { ArrayAction, ElementAttributes, getEquipmentTypeShortLabel, mergeSx } from '../../../utils';
import { NAME } from './constants';
import { OverflowableChip, OverflowableChipProps } from './OverflowableChip';
import { FieldLabel, isFieldRequired } from './utils';

const styles = {
    selectDirectoryElements: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        cursor: 'pointer',
        '& .MuiSelect-select': {
            paddingY: '3px',
            paddingX: '8px !important', // because of the hidden select icon at right, we force a smaller padding
        },
        '& .MuiSelect-icon': {
            display: 'none',
        },
    },
    renderDirectoryElements: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    addDirectoryElements: {
        marginTop: '-5px',
    },
    inputLabel: {
        left: '30px',
        '&.MuiInputLabel-shrink': {
            transform: 'translate(-16px, -9px) scale(0.75)',
        },
    },
} as const satisfies MuiStyles;

export interface DirectoryItemsInputProps<CP extends OverflowableChipProps = OverflowableChipProps> {
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
    ChipComponent?: ComponentType<CP>;
    chipProps?: Partial<CP>;
    fullHeight?: boolean;
    fullWidth?: boolean;
}

export function DirectoryItemsInput<CP extends OverflowableChipProps = OverflowableChipProps>({
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
    ChipComponent = OverflowableChip,
    chipProps,
    fullHeight = false,
    fullWidth = true,
}: Readonly<DirectoryItemsInputProps<CP>>) {
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

    const handleDeleteChip = useCallback(
        (event: React.MouseEvent, index: number) => {
            event.stopPropagation();
            const elemToRemove = getValues(name)[index];
            remove(index);
            const newElems = getValues(name); // must call getValues again to get the newly updated array
            onRowChanged?.(true);
            onChange?.(newElems, ArrayAction.REMOVE, elemToRemove);
        },
        [onRowChanged, remove, getValues, name, onChange]
    );

    const openItemsSelector = useCallback(
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

    const handleClickChip = useCallback(
        (event: React.MouseEvent, index: number) => {
            event.stopPropagation();
            openItemsSelector(index);
        },
        [openItemsSelector]
    );

    const shouldReplaceElement = useMemo(() => {
        return allowMultiSelect === false && elements?.length === 1;
    }, [allowMultiSelect, elements]);

    const handleClickInput = useCallback(() => {
        if (disable) {
            return;
        }
        if (shouldReplaceElement) {
            openItemsSelector(0);
        } else {
            setDirectoryItemSelectorOpen(true);
            if (allowMultiSelect) {
                setMultiSelect(true);
            }
        }
    }, [shouldReplaceElement, openItemsSelector, allowMultiSelect, disable]);

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

    const inputId = `directory-items-input-${name}`;

    const fullLabel = label && (
        <FieldLabel
            label={label}
            optional={labelRequiredFromContext && !isFieldRequired(name, validationSchema, getValues())}
        />
    );

    const hasElements = elements && elements.length > 0;

    const fullHeightSx = fullHeight ? { height: '100%' } : undefined;

    // 6ch for folder + approximate width of the label text
    const selectWidth = label ? `${6 + label.length * 0.8}ch` : 'auto';

    // To keep folder icon visible and in the same flexbox as chips, we render it in renderValue (not startAdornment).
    // This also requires manually controlling label shrink/notch and setting displayEmpty to true.
    return (
        <Box sx={fullHeightSx}>
            <FormControl
                size="small"
                fullWidth={fullWidth}
                sx={fullHeightSx}
                disabled={disable}
                error={!!error?.message}
            >
                {label && (
                    <InputLabel htmlFor={inputId} shrink={hasElements} sx={styles.inputLabel}>
                        {fullLabel}
                    </InputLabel>
                )}
                <Select
                    value={elements}
                    multiple
                    displayEmpty
                    notched={hasElements}
                    open={false} // disable the MUI select menu
                    onClick={handleClickInput}
                    sx={mergeSx(styles.selectDirectoryElements, { minWidth: selectWidth }, fullHeightSx)}
                    input={
                        <OutlinedInput
                            id={inputId}
                            {...(label && {
                                label: fullLabel,
                            })}
                        />
                    }
                    renderValue={(directoryElements: TreeViewFinderNodeProps[]) => (
                        <Box sx={styles.renderDirectoryElements}>
                            <Tooltip title={intl.formatMessage({ id: titleId })}>
                                <span>
                                    <IconButton size="small" disabled={disable}>
                                        <DriveFolderUpload />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            {directoryElements?.map((item, index) => {
                                const elementName =
                                    watchedElements?.[index]?.[NAME] ??
                                    getValues(`${name}.${index}.${NAME}`) ??
                                    (item as FieldValues)?.[NAME];

                                const equipmentTypeShortLabel = getEquipmentTypeShortLabel(
                                    item?.specificMetadata?.equipmentType
                                );

                                const { sx: chipSx, ...otherChipProps } = chipProps ?? {};

                                return (
                                    <ChipComponent
                                        key={item.id}
                                        onDelete={(e) => handleDeleteChip(e, index)}
                                        onClick={(e) => handleClickChip(e, index)}
                                        label={elementName || intl.formatMessage({ id: 'elementNotFound' })}
                                        {...(equipmentTypeShortLabel && {
                                            helperText: intl.formatMessage({
                                                id: equipmentTypeShortLabel,
                                            }),
                                        })}
                                        sx={mergeSx(
                                            !elementName
                                                ? (theme) => ({
                                                      backgroundColor: theme.palette.error.light,
                                                      borderColor: theme.palette.error.main,
                                                      color: theme.palette.error.contrastText,
                                                  })
                                                : undefined,
                                            chipSx
                                        )}
                                        {...(otherChipProps as CP)}
                                    />
                                );
                            })}
                        </Box>
                    )}
                />
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
        </Box>
    );
}
