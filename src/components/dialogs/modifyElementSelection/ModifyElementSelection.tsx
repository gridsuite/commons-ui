/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useController } from 'react-hook-form';
import type { UUID } from 'node:crypto';
import { FolderOutlined } from '@mui/icons-material';
import { TreeViewFinderNodeProps } from '../../treeViewFinder';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { DirectoryItemSelector } from '../../directoryItemSelector/DirectoryItemSelector';
import { ElementType } from '../../../utils/types/elementType';
import { fetchDirectoryElementPath } from '../../../services';
import { ElementAttributes } from '../../../utils';

export interface ModifyElementSelectionProps {
    elementType: ElementType;
    dialogOpeningButtonLabel: string;
    dialogTitleLabel: string;
    dialogMessageLabel: string;
    noElementMessageLabel?: string;
    onElementValidated?: (elementId: UUID) => void;
}

export function ModifyElementSelection(props: ModifyElementSelectionProps) {
    const intl = useIntl();
    const {
        elementType,
        dialogTitleLabel,
        dialogMessageLabel,
        dialogOpeningButtonLabel,
        noElementMessageLabel,
        onElementValidated,
    } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [activeDirectoryName, setActiveDirectoryName] = useState('');

    const {
        field: { onChange, value: directory },
    } = useController({
        name: FieldConstants.DIRECTORY,
    });

    useEffect(() => {
        if (directory) {
            fetchDirectoryElementPath(directory).then((res: ElementAttributes[]) => {
                setActiveDirectoryName(res.map((element: ElementAttributes) => element.elementName.trim()).join('/'));
            });
        }
    }, [directory]);

    const handleSelectFolder = () => {
        setOpen(true);
    };

    const handleClose = (nodes: TreeViewFinderNodeProps[]) => {
        if (nodes.length) {
            onChange(nodes[0].id);
            if (onElementValidated) {
                onElementValidated(nodes[0].id as UUID);
            }
        }
        setOpen(false);
    };

    return (
        <Grid
            sx={{
                marginTop: '10px',
                alignItems: 'center',
            }}
        >
            <Grid container>
                <Typography m={1} component="span">
                    <Box fontWeight="fontWeightBold" display="flex" justifyContent="center" alignItems="center">
                        <FolderOutlined />
                        <span>
                            &nbsp;
                            {activeDirectoryName ||
                                (props?.noElementMessageLabel
                                    ? intl.formatMessage({
                                          id: noElementMessageLabel,
                                      })
                                    : '')}
                        </span>
                    </Box>
                </Typography>
                <Button onClick={handleSelectFolder} variant="contained" size="small">
                    <FormattedMessage id={dialogOpeningButtonLabel} />
                </Button>
            </Grid>
            <DirectoryItemSelector
                open={open}
                onClose={handleClose}
                types={[elementType]}
                onlyLeaves={elementType !== ElementType.DIRECTORY}
                multiSelect={false}
                validationButtonText={intl.formatMessage({
                    id: 'confirmDirectoryDialog',
                })}
                title={intl.formatMessage({
                    id: dialogTitleLabel,
                })}
                contentText={intl.formatMessage({
                    id: dialogMessageLabel,
                })}
            />
        </Grid>
    );
}
