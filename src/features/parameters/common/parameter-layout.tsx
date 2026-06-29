/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, LinearProgress, Stack, ButtonGroup, Tooltip } from '@mui/material';
import { RestartAlt, Upload } from '@mui/icons-material';
import { ReactNode, useState, useCallback, createContext, useContext, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { UUID } from 'node:crypto';
import { FieldValues, UseFormGetValues } from 'react-hook-form';
import { LabelledButton } from './parameters';
import {
    DirectoryItemSelector,
    PopupConfirmationDialog,
    SubmitButton,
    TreeViewFinderNodeProps,
} from '../../../components/ui';
import { CreateParameterDialog } from './parameters-creation-dialog';
import { ElementType } from '../../../utils';
import { LineSeparator } from './line-separator';

// Context for XS Screen
interface ParameterLayoutContextValue {
    isXsScreen: boolean;
}

const ParameterLayoutContext = createContext<ParameterLayoutContextValue>({ isXsScreen: false });

export const useParameterLayoutContext = () => useContext(ParameterLayoutContext);

export function ParameterLayoutProvider({
    isXsScreen,
    children,
}: Readonly<{
    isXsScreen: boolean;
    children: ReactNode;
}>) {
    const isXsScreenMemo = useMemo(() => ({ isXsScreen }), [isXsScreen]);
    return <ParameterLayoutContext.Provider value={isXsScreenMemo}>{children}</ParameterLayoutContext.Provider>;
}

export type CreateParameterDialogConfig<T extends FieldValues> = {
    studyUuid: UUID | null;
    getParameterValues: UseFormGetValues<T> | any;
    parameterFormatter: (params: any) => any;
};

interface ParameterLayoutProps<T extends FieldValues> {
    children: ReactNode;
    title?: string;
    isLoading?: boolean;
    parameterType: ElementType;
    createParameter?: CreateParameterDialogConfig<T>;
    selectParameterHandler?: (nodes: TreeViewFinderNodeProps[]) => void;
    resetHandler?: () => void;
    validateHandler?: React.MouseEventHandler<HTMLButtonElement>;
    validateDisabled?: boolean;
}

const styles = {
    stack: {
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    title: {
        flexShrink: 0,
        paddingBottom: 2,
    },
    content: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0, // Critical for flex-grow with overflow
    },
    footer: {
        flexShrink: 0,
        p: 1,
    },
} as const;

export function ParameterLayout<T extends FieldValues>({
    children,
    title,
    isLoading,
    createParameter,
    resetHandler,
    validateHandler,
    validateDisabled,
    selectParameterHandler,
    parameterType,
}: Readonly<ParameterLayoutProps<T>>) {
    const { isXsScreen } = useParameterLayoutContext();
    const [openCreateParameterDialog, setOpenCreateParameterDialog] = useState(false);
    const [openSelectParameterDialog, setOpenSelectParameterDialog] = useState(false);
    const [openResetConfirmation, setOpenResetConfirmation] = useState(false);

    const handlePrefillClick = useCallback(() => {
        setOpenSelectParameterDialog(true);
    }, []);
    const handleSaveClick = useCallback(() => {
        setOpenCreateParameterDialog(true);
    }, []);

    const handleResetClick = useCallback(() => {
        setOpenResetConfirmation(true);
    }, []);
    const handleCancelReset = useCallback(() => {
        setOpenResetConfirmation(false);
    }, []);

    const intl = useIntl();

    return (
        <Stack sx={styles.stack}>
            {(title || selectParameterHandler || resetHandler) && (
                <Box sx={styles.title}>
                    <Grid container justifyContent="space-between" sx={{ alignItems: 'center' }}>
                        <Grid item xs={4}>
                            {title && !isXsScreen && <FormattedMessage id={title} />}
                        </Grid>
                        <Grid item xs="auto">
                            <ButtonGroup>
                                {selectParameterHandler && (
                                    <LabelledButton
                                        callback={handlePrefillClick}
                                        label="button.prefill"
                                        data-testid="PrefillButton"
                                        startIcon={<Upload />}
                                    />
                                )}
                                {resetHandler && (
                                    <Tooltip title={<FormattedMessage id="tooltip.reset" />}>
                                        <LabelledButton
                                            callback={handleResetClick}
                                            label="button.reset"
                                            data-testid="ResetButton"
                                            startIcon={<RestartAlt />}
                                        />
                                    </Tooltip>
                                )}
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Box>
            )}
            <Box sx={styles.content}>{isLoading ? <LinearProgress /> : children}</Box>
            <Box sx={styles.footer}>
                <Grid container paddingTop={1} paddingBottom={1}>
                    <LineSeparator />
                </Grid>
                {createParameter && <LabelledButton label="save" data-testid="SaveButton" callback={handleSaveClick} />}
                {validateHandler && (
                    <SubmitButton
                        variant="contained"
                        data-testid="ValidateButton"
                        onClick={validateHandler}
                        disabled={validateDisabled}
                    />
                )}
                {openCreateParameterDialog && createParameter && (
                    <CreateParameterDialog
                        studyUuid={createParameter?.studyUuid}
                        open={openCreateParameterDialog}
                        onClose={() => setOpenCreateParameterDialog(false)}
                        parameterValues={createParameter?.getParameterValues}
                        parameterFormatter={createParameter?.parameterFormatter}
                        parameterType={parameterType}
                    />
                )}
                {openSelectParameterDialog && selectParameterHandler && (
                    <DirectoryItemSelector
                        open={openSelectParameterDialog}
                        onClose={(nodes) => {
                            setOpenSelectParameterDialog(false);
                            selectParameterHandler(nodes);
                        }}
                        types={[parameterType]}
                        title={intl.formatMessage({
                            id: 'showSelectParameterDialog',
                        })}
                        onlyLeaves
                        multiSelect={false}
                        validationButtonText={intl.formatMessage({
                            id: 'validate',
                        })}
                    />
                )}
                {/* Reset Confirmation Dialog */}
                {openResetConfirmation && resetHandler && (
                    <PopupConfirmationDialog
                        message="resetParamsConfirmation"
                        validateButtonLabel="validate"
                        openConfirmationPopup={openResetConfirmation}
                        setOpenConfirmationPopup={handleCancelReset}
                        handlePopupConfirmation={() => {
                            resetHandler();
                            setOpenResetConfirmation(false);
                        }}
                    />
                )}
            </Box>
        </Stack>
    );
}
