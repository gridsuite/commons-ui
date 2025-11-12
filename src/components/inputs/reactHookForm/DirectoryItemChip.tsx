/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.ds
 */

import { useIntl } from 'react-intl';
import { Box, Chip, type ChipProps } from '@mui/material';
import { RawReadOnlyInput } from './RawReadOnlyInput';
import { NAME } from './constants';
import { OverflowableText } from '../../overflowableText';

export interface DirectoryItemChipProps extends Omit<ChipProps, 'label'> {
    index: number;
    name: string;
    elementName?: string;
}

export function DirectoryItemChip({ index, name, elementName, ...otherProps }: Readonly<DirectoryItemChipProps>) {
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
            label={
                <Box sx={{ display: 'flex' }}>
                    <OverflowableText
                        text={
                            elementName ? (
                                <RawReadOnlyInput name={`${name}.${index}.${NAME}`} />
                            ) : (
                                intl.formatMessage({ id: 'elementNotFound' })
                            )
                        }
                        sx={{
                            maxWidth: '20ch',
                            mx: 'auto',
                        }}
                    />
                </Box>
            }
            {...otherProps}
        />
    );
}
