/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.ds
 */

import { useIntl } from 'react-intl';
import { Chip } from '@mui/material';
import { OverflowableText } from '../../overflowableText';
import { RawReadOnlyInput } from './RawReadOnlyInput';
import { NAME } from './constants';

// interface shared by DirectoryItemChip and its variants
export interface DirectoryItemChipProps {
    index: number;
    name: string;
    elementName?: string;
    onDelete: () => void;
    onClick: () => void;
}

export function DirectoryItemChip({ index, name, elementName, onDelete, onClick }: Readonly<DirectoryItemChipProps>) {
    const intl = useIntl();
    return (
        <Chip
            size="small"
            sx={
                !elementName
                    ? (theme) => ({
                          backgroundColor: theme.palette.error.light,
                          borderColor: theme.palette.error.main,
                          color: theme.palette.error.contrastText,
                      })
                    : undefined
            }
            onDelete={onDelete}
            onClick={onClick}
            label={
                <OverflowableText
                    text={
                        elementName ? (
                            <RawReadOnlyInput name={`${name}.${index}.${NAME}`} />
                        ) : (
                            intl.formatMessage({ id: 'elementNotFound' })
                        )
                    }
                    sx={{ width: '100%' }}
                />
            }
        />
    );
}
