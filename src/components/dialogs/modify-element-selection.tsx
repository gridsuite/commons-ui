/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useController } from 'react-hook-form';
import { UUID } from 'crypto';
import { TreeViewFinderNodeProps } from '../TreeViewFinder';
import FieldConstants from '../../utils/field-constants';
import DirectoryItemSelector from '../DirectoryItemSelector/directory-item-selector';
import { ElementType } from '../../utils/ElementType';
import { DirectorySvc } from '../../services';

export interface ModifyElementSelectionProps {
    elementType: ElementType;
    dialogOpeningButtonLabel: string;
    dialogTitleLabel: string;
    dialogMessageLabel: string;
    noElementMessageLabel?: string;
    onElementValidated?: (elementId: UUID) => void;
}

function ModifyElementSelection(props: ModifyElementSelectionProps) {
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
            DirectorySvc.fetchDirectoryElementPath(directory).then(
                (res: any) => {
                    setActiveDirectoryName(
                        res
                            .map((element: any) => element.elementName.trim())
                            .join('/')
                    );
                }
            );
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
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Button
                onClick={handleSelectFolder}
                variant="contained"
                sx={{
                    padding: '10px 30px',
                }}
                color="primary"
                component="label"
            >
                <FormattedMessage id={dialogOpeningButtonLabel} />
            </Button>
            <Typography
                sx={{
                    marginLeft: '10px',
                    fontWeight: 'bold',
                }}
            >
                {activeDirectoryName ||
                    (props?.noElementMessageLabel
                        ? intl.formatMessage({
                              id: noElementMessageLabel,
                          })
                        : '')}
            </Typography>
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

export default ModifyElementSelection;
