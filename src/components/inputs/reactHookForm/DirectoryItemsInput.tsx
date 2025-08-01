/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Chip, FormControl, Grid, IconButton, Theme, Tooltip } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';
import { useCallback, useMemo, useState } from 'react';
import { FieldValues, useController, useFieldArray } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { UUID } from 'crypto';
import { RawReadOnlyInput } from './RawReadOnlyInput';
import { FieldLabel } from './utils/FieldLabel';
import { useCustomFormContext } from './provider/useCustomFormContext';
import { isFieldRequired } from './utils/functions';
import { ErrorInput } from './errorManagement/ErrorInput';
import { useSnackMessage } from '../../../hooks/useSnackMessage';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { mergeSx } from '../../../utils/styles';
import { OverflowableText } from '../../overflowableText';
import { MidFormError } from './errorManagement/MidFormError';
import { DirectoryItemSelector } from '../../directoryItemSelector/DirectoryItemSelector';
import { fetchDirectoryElementPath } from '../../../services';
import { ElementAttributes } from '../../../utils';
import { NAME } from './constants';

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
    formDirectoryElementsError: (theme: Theme) => ({
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
};

export interface DirectoryItemsInputProps {
    label: string | undefined;
    name: string;
    elementType: string;
    equipmentTypes?: string[];
    itemFilter?: (val: ElementAttributes) => boolean;
    titleId?: string;
    hideErrorMessage?: boolean;
    onRowChanged?: (a: boolean) => void;
    onChange?: (e: any) => void;
    disable?: boolean;
    allowMultiSelect?: boolean;
    labelRequiredFromContext?: boolean;
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
    } = useFieldArray({
        name,
    });

    const formContext = useCustomFormContext();
    const { getValues, validationSchema } = formContext;

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
                    onChange?.(getValues(name));
                }
            });
            setDirectoryItemSelectorOpen(false);
            setSelected([]);
        },
        [append, getValues, snackError, name, onRowChanged, onChange, selected, remove]
    );

    const removeElements = useCallback(
        (index: number) => {
            remove(index);
            onRowChanged?.(true);
            onChange?.(getValues(name));
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
                        {elements.map((item, index) => (
                            <Chip
                                key={item.id}
                                size="small"
                                onDelete={() => removeElements(index)}
                                onClick={() => handleChipClick(index)}
                                label={
                                    <OverflowableText
                                        text={<RawReadOnlyInput name={`${name}.${index}.${NAME}`} />}
                                        sx={{ width: '100%' }}
                                    />
                                }
                            />
                        ))}
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
