/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {
    FunctionComponent,
    MouseEvent,
    useCallback,
    useState,
} from 'react';
import { Box, Divider, IconButton, List, ListItem } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Draggable } from 'react-beautiful-dnd';
import CheckBoxItem, { HasId } from './check-box-item';
import { useMultiselect } from './use-multiselect';

interface CheckboxListProps {
    itemRenderer?: (params: {
        item: any;
        index: number;
        checked: boolean;
        toggleSelection: (id: any) => void;
    }) => React.ReactNode;
    values: any[];
    defaultSelected?: any[];
    itemComparator?: (val1: any, val2: any) => boolean;
    isAllSelected?: boolean;
    setIsAllSelected?: (value: boolean) => void;
    setIsPartiallySelected?: (value: boolean) => void;
    getValueId: (value: any) => any;
    getValueLabel?: (value: any) => string;
    checkboxListSx?: any;
    labelSx?: any;
    enableKeyboardSelection?: boolean;
    isCheckBoxDraggable?: boolean;
    isDragDisable?: boolean;
    draggableProps?: any;
    secondaryAction?: (item: HasId) => React.ReactElement;
    enableSecondaryActionOnHover?: boolean;
    isDisabled?: (item: any) => boolean;
    [key: string]: any;
}

export const areIdsEqual = (val1: any, val2: any) => {
    return val1.id === val2.id;
};

const styles = {
    dragIcon: (theme: any) => ({
        padding: theme.spacing(0),
        border: theme.spacing(1),
        borderRadius: theme.spacing(0),
        zIndex: 90,
    }),
};

const CheckboxList: FunctionComponent<CheckboxListProps> = ({
    itemRenderer,
    values = [],
    defaultSelected = [],
    itemComparator = areIdsEqual,
    isAllSelected = undefined,
    setIsAllSelected = undefined,
    setIsPartiallySelected = undefined,
    getValueId = (value) => value?.id ?? value,
    getValueLabel = (value) => value?.label ?? value,
    checkboxListSx,
    labelSx,
    enableKeyboardSelection,
    isCheckBoxDraggable = false,
    isDragDisable,
    draggableProps,
    secondaryAction,
    enableSecondaryActionOnHover = true,
    isDisabled = (item: any) => false,
    ...props
}) => {
    const { toggleSelection, selectedIds, handleShiftAndCtrlClick } =
        useMultiselect(
            values.map((v) => getValueId(v)),
            defaultSelected.map((v) => getValueId(v))
        );

    const isChecked = useCallback(
        (item: any) => selectedIds.includes(getValueId(item)),
        [selectedIds, getValueId]
    );

    const [hover, setHover] = useState(null);

    /*useEffect(() => {
        if (isAllSelected !== undefined) {
            if (isAllSelected && selectedIds.length !== values.length) {
                toggleSelectAll(true);
            } else if (!isAllSelected && selectedIds.length !== 0) {
                toggleSelectAll(false);
            }
        }
    }, [isAllSelected, toggleSelectAll, values.length, selectedIds.length]);*/

    const handleCheckBoxClicked = useCallback((
        event: MouseEvent<HTMLButtonElement>,
        item: any
    ) => {
        toggleSelection(getValueId(item));
        const selectedIdsLength = selectedIds.length;
        if (setIsAllSelected) {
            setIsAllSelected(selectedIdsLength === values.length);
        }

        if (setIsPartiallySelected) {
            setIsPartiallySelected(
                selectedIdsLength !== 0 && selectedIdsLength < values.length
            );
        }
        if (enableKeyboardSelection) {
            handleShiftAndCtrlClick(event, getValueId(item));
        }
    }, []);

    const handleSecondaryAction = (item: any) => {
        if (!secondaryAction) {
            return undefined;
        }

        if (!enableSecondaryActionOnHover) {
            return secondaryAction(item);
        }

        if (hover === getValueId(item)) {
            return secondaryAction(item);
        }

        return undefined;
    };

    return (
        <List {...props}>
            {values?.map((item, index) => {
                if (itemRenderer) {
                    return itemRenderer({
                        item,
                        index,
                        checked: isChecked(item),
                        toggleSelection,
                    });
                }
                return (
                    <React.Fragment key={getValueId(item)}>
                        {isCheckBoxDraggable && (
                            <Draggable
                                draggableId={String(getValueId(item))}
                                index={index}
                                isDragDisabled={isDragDisable}
                            >
                                {(provided: any) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        onMouseEnter={() =>
                                            setHover(getValueId(item))
                                        }
                                        onMouseLeave={() => setHover(null)}
                                        {...draggableProps}
                                    >
                                        <ListItem
                                            {...props}
                                            sx={checkboxListSx}
                                        >
                                            <IconButton
                                                {...provided.dragHandleProps}
                                                sx={styles.dragIcon}
                                                size="small"
                                                style={{
                                                    opacity:
                                                        hover ===
                                                            getValueId(item) &&
                                                        !isDragDisable
                                                            ? '1'
                                                            : '0',
                                                }}
                                            >
                                                <DragIndicatorIcon />
                                            </IconButton>
                                            <CheckBoxItem
                                                item={item}
                                                checked={isChecked(item)}
                                                label={
                                                    getValueLabel
                                                        ? getValueLabel(item)
                                                        : ''
                                                }
                                                onClick={(
                                                    e: MouseEvent<HTMLButtonElement>
                                                ) =>
                                                    handleCheckBoxClicked(
                                                        e,
                                                        item
                                                    )
                                                }
                                                secondaryAction={handleSecondaryAction(
                                                    item
                                                )}
                                                labelSx={labelSx}
                                                disabled={
                                                    isDisabled
                                                        ? isDisabled(item)
                                                        : false
                                                }
                                            />
                                        </ListItem>
                                    </Box>
                                )}
                            </Draggable>
                        )}
                        {!isCheckBoxDraggable && (
                            <CheckBoxItem
                                item={item}
                                checked={isChecked(item)}
                                label={getValueLabel(item)}
                                onClick={(e: MouseEvent<HTMLButtonElement>) =>
                                    handleCheckBoxClicked(e, item)
                                }
                                secondaryAction={handleSecondaryAction(item)}
                                labelSx={labelSx}
                                disabled={isDisabled(item)}
                            />
                        )}
                        {index !== values.length - 1 && <Divider />}
                    </React.Fragment>
                );
            })}
        </List>
    );
};

export default CheckboxList;
