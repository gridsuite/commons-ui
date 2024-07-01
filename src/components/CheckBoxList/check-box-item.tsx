import React, { FunctionComponent } from 'react';
import { Checkbox, ListItemIcon } from '@mui/material';
import { SxProps } from '@mui/material';
import OverflowableText from '../OverflowableText';

export interface HasId {
    id?: string;
    uuid?: string;
    [key: string]: any; // Allow any other properties
}

export interface CheckBoxItemProps {
    item: HasId;
    checkBoxIconSx?: SxProps;
    labelSx?: SxProps;
    checked: boolean;
    getLabel: (item: HasId) => string;
    onClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        id: HasId
    ) => void;
    secondaryAction?: React.ReactElement | undefined;
}

const CheckBoxItem: FunctionComponent<CheckBoxItemProps> = ({
    item,
    checkBoxIconSx,
    checked,
    labelSx,
    getLabel = (item: HasId) => item.id,
    onClick,
    secondaryAction,
    ...props
}) => {
    return (
        <>
            <ListItemIcon sx={checkBoxIconSx}>
                <Checkbox
                    color={'primary'}
                    edge="start"
                    checked={checked}
                    onClick={(event) => onClick(event, item)}
                    disableRipple
                    {...props}
                />
            </ListItemIcon>
            <OverflowableText sx={labelSx} text={getLabel(item)} />
            {secondaryAction && secondaryAction}
        </>
    );
};

export default CheckBoxItem;
