/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { TapChangerSteps } from '../TapChangerSteps';
import { TapChangerMapInfos } from '../../common/twoWindingsTransformer.types';
import { DndColumn } from '../../../../../components';
import { TwoWindingsTransformerModificationDto } from '../../modification/twoWindingsTransformerModification.types';
import { DndColumnType } from '../../../../../../dist/components/composite/dnd-table';
import { FieldConstants } from '../../../../../utils/constants/fieldConstants';
import { parseIntData } from '../../../../../utils';

export interface RatioTapChangerPaneStepsProps {
    disabled?: boolean;
    previousValues?: TapChangerMapInfos;
    editData?: TwoWindingsTransformerModificationDto;
    isModification?: boolean;
}

export function RatioTapChangerPaneSteps({
    disabled,
    previousValues,
    editData,
    isModification = false,
}: Readonly<RatioTapChangerPaneStepsProps>) {
    const intl = useIntl();

    const COLUMNS_DEFINITIONS = useMemo<DndColumn[]>(() => {
        return [
            {
                label: 'Tap',
                dataKey: FieldConstants.STEPS_TAP,
                type: DndColumnType.TEXT as const,
            },
            {
                label: 'DeltaResistance',
                dataKey: FieldConstants.STEPS_RESISTANCE,
                initialValue: 0,
                editable: true,
                type: DndColumnType.NUMERIC as const,
                clearable: false,
            },
            {
                label: 'DeltaReactance',
                dataKey: FieldConstants.STEPS_REACTANCE,
                initialValue: 0,
                editable: true,
                type: DndColumnType.NUMERIC as const,
                clearable: false,
            },
            {
                label: 'DeltaConductance',
                dataKey: FieldConstants.STEPS_CONDUCTANCE,
                initialValue: 0,
                editable: true,
                type: DndColumnType.NUMERIC as const,
                clearable: false,
            },
            {
                label: 'DeltaSusceptance',
                dataKey: FieldConstants.STEPS_SUSCEPTANCE,
                initialValue: 0,
                editable: true,
                type: DndColumnType.NUMERIC as const,
                clearable: false,
            },
            {
                label: 'Ratio',
                dataKey: FieldConstants.STEPS_RATIO,
                initialValue: 1,
                editable: true,
                type: DndColumnType.NUMERIC as const,
                clearable: false,
            },
        ].map((column) => ({
            ...column,
            label: intl
                .formatMessage({ id: column.label })
                .toLowerCase()
                .replace(/^\w/, (c) => c.toUpperCase()),
        })) satisfies DndColumn[];
    }, [intl]);

    const csvColumns = useMemo(() => {
        return [
            intl.formatMessage({ id: 'ImportFileResistance' }),
            intl.formatMessage({ id: 'ImportFileReactance' }),
            intl.formatMessage({ id: 'ImportFileConductance' }),
            intl.formatMessage({ id: 'ImportFileSusceptance' }),
            intl.formatMessage({ id: 'Ratio' }),
        ];
    }, [intl]);

    const handleImportRow = (val: Record<string, string>): Record<string, string | number> => {
        return {
            [FieldConstants.STEPS_RESISTANCE]: parseIntData(
                val[
                    intl.formatMessage({
                        id: 'ImportFileResistance',
                    })
                ],
                0
            ),
            [FieldConstants.STEPS_REACTANCE]: parseIntData(
                val[
                    intl.formatMessage({
                        id: 'ImportFileReactance',
                    })
                ],
                0
            ),
            [FieldConstants.STEPS_CONDUCTANCE]: parseIntData(
                val[
                    intl.formatMessage({
                        id: 'ImportFileConductance',
                    })
                ],
                0
            ),
            [FieldConstants.STEPS_SUSCEPTANCE]: parseIntData(
                val[
                    intl.formatMessage({
                        id: 'ImportFileSusceptance',
                    })
                ],
                0
            ),
            [FieldConstants.STEPS_RATIO]: Number.isNaN(Number.parseFloat(val[intl.formatMessage({ id: 'Ratio' })]))
                ? 1
                : Number.parseFloat(val[intl.formatMessage({ id: 'Ratio' })]),
        };
    };

    return (
        <TapChangerSteps
            tapChanger={FieldConstants.RATIO_TAP_CHANGER}
            createTapRuleColumn={FieldConstants.STEPS_RATIO}
            columnsDefinition={COLUMNS_DEFINITIONS}
            csvColumns={csvColumns}
            createRuleMessageId="CreateRegulationRule"
            createRuleAllowNegativeValues={false}
            importRuleMessageId="ImportRegulationRule"
            resetButtonMessageId="ResetRegulationRule"
            handleImportRow={handleImportRow}
            disabled={disabled}
            previousValues={previousValues}
            editData={editData?.[FieldConstants.RATIO_TAP_CHANGER] as Record<string, unknown> | undefined}
            isModification={isModification}
        />
    );
}
