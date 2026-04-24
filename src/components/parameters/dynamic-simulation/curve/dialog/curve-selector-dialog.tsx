/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
    useTheme,
} from '@mui/material';
import { CustomTooltip } from '../../../../tooltip/CustomTooltip';
import { useCallback, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArrowCircleLeft, ArrowCircleRight } from '@mui/icons-material';
import CurvePreview, { CurvePreviewApi } from './curve-preview';
import CurveSelector, { CurveSelectorApi } from './curve-selector';
import { mergeSx } from '../../../../../utils/styles';
import { DynamicSimulationModelInfos } from '../../../../../utils/types/dynamic-simulation.type';
import { VoltageLevelInfos } from '../../../../../utils/types/equipmentType';
import { ExpertFilter, IdentifiableAttributes } from '../../../../filter';
import { Curve } from '../common/curve.type';
import { parametersStyles } from '../../../parameters-style';

interface CurveSelectorDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (curves: Curve[]) => void;
    voltageLevelsFetcher?: () => Promise<VoltageLevelInfos[]>;
    countriesFetcher?: () => Promise<string[]>;
    evaluateFilterFetcher?: (filter: ExpertFilter) => Promise<IdentifiableAttributes[]>;
    modelsFetcher?: () => Promise<DynamicSimulationModelInfos[]> | undefined;
}

function CurveSelectorDialog({
    open,
    onClose,
    onSave,
    voltageLevelsFetcher,
    countriesFetcher,
    evaluateFilterFetcher,
    modelsFetcher,
}: Readonly<CurveSelectorDialogProps>) {
    const theme = useTheme();

    const selectorRef = useRef<CurveSelectorApi>(null);
    const previewRef = useRef<CurvePreviewApi>(null);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleAdd = useCallback(() => {
        if (!previewRef.current) {
            return;
        }
        onSave(previewRef.current.getCurves());
    }, [onSave]);

    const intl = useIntl();

    const handleAddButton = useCallback(() => {
        if (!selectorRef.current || !previewRef.current) {
            return;
        }
        const selectedEquipments = selectorRef.current.getSelectedEquipments();

        const selectedVariables = selectorRef.current.getSelectedVariables();

        // combine between equipments and variables
        const curves = selectedEquipments.flatMap((equipment) =>
            selectedVariables.map((variable) => ({
                equipmentType: equipment.type,
                equipmentId: equipment.id,
                variableId: variable.variableId,
            }))
        );
        previewRef.current.addCurves(curves);
    }, []);
    const handleDeleteButton = useCallback(() => {
        if (!previewRef.current) {
            return;
        }
        previewRef.current.removeCurves();
    }, []);

    const hasSelectedRow = false;

    return (
        <Dialog open={open} aria-labelledby="curve-selector-dialog-title" maxWidth="xl" fullWidth>
            <DialogTitle id="curve-selector-dialog-title">
                <Typography component="span" variant="h5" sx={parametersStyles.title}>
                    <FormattedMessage id="DynamicSimulationCurveSelectorDialogTitle" />
                </Typography>
            </DialogTitle>
            <DialogContent style={{ overflowY: 'hidden', height: '60vh' }}>
                <Grid
                    container
                    sx={mergeSx(parametersStyles.scrollableGrid, {
                        maxWidth: 'xl',
                        height: '100%',
                        maxHeight: '100%',
                    })}
                >
                    <Grid item container xs={8} spacing={theme.spacing(1)}>
                        <CurveSelector
                            ref={selectorRef}
                            voltageLevelsFetcher={voltageLevelsFetcher}
                            countriesFetcher={countriesFetcher}
                            evaluateFilterFetcher={evaluateFilterFetcher}
                            modelsFetcher={modelsFetcher}
                        />
                    </Grid>
                    <Grid item container direction="column" justifyContent="center" alignItems="center" xs={0.5}>
                        <Grid item>
                            <CustomTooltip
                                title={intl.formatMessage({
                                    id: 'AddRows',
                                })}
                            >
                                <span>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleAddButton()}
                                        disabled={hasSelectedRow}
                                    >
                                        <ArrowCircleRight />
                                    </IconButton>
                                </span>
                            </CustomTooltip>
                        </Grid>
                        <Grid item>
                            <CustomTooltip
                                title={intl.formatMessage({
                                    id: 'DeleteRows',
                                })}
                            >
                                <span>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleDeleteButton()}
                                        disabled={hasSelectedRow}
                                    >
                                        <ArrowCircleLeft />
                                    </IconButton>
                                </span>
                            </CustomTooltip>
                        </Grid>
                    </Grid>
                    <Grid item container xs direction="column">
                        <CurvePreview ref={previewRef} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAdd}>
                    <FormattedMessage id="DynamicSimulationAdd" />
                </Button>
                <Button onClick={handleClose}>
                    <FormattedMessage id="DynamicSimulationClose" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CurveSelectorDialog;
