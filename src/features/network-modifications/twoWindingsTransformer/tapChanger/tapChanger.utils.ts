/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { REGULATION_TYPES } from '@gridsuite/commons-ui';
import { IntlShape } from 'react-intl';
import { FieldConstants, REGULATION_SIDES } from '../../../../utils';
import { TapChangerStep, TapChangerStepMapInfos } from '../common/twoWindingsTransformer.types';

export const getRegulationTypeLabel = (twt: any, tap: any, intl: IntlShape) => {
    if (tap?.regulatingTerminalConnectableId != null) {
        return tap?.regulatingTerminalConnectableId === twt?.id
            ? intl.formatMessage({ id: REGULATION_TYPES.LOCAL.label })
            : intl.formatMessage({ id: REGULATION_TYPES.DISTANT.label });
    } else {
        return null;
    }
};

export const getTapSideLabel = (twt: any, tap: any, intl: IntlShape) => {
    if (!tap || !twt) {
        return null;
    }
    if (tap?.regulatingTerminalConnectableId === twt?.id) {
        return tap?.regulatingTerminalVlId === twt?.voltageLevelId1
            ? intl.formatMessage({ id: REGULATION_SIDES.SIDE1.label })
            : intl.formatMessage({ id: REGULATION_SIDES.SIDE2.label });
    } else {
        return null;
    }
};

export const compareStepsWithPreviousValues = (tapSteps: TapChangerStep[], previousValues?: TapChangerStep[]) => {
    if (previousValues === undefined) {
        return false;
    }
    if (tapSteps.length !== previousValues?.length) {
        return false;
    }
    return tapSteps.every((step, index) => {
        const previousStep = previousValues[index];
        /* TODO DBR fix error with stringify
        return (Object.keys(previousStep) as (keyof TapChangerStep)[]).every((key) => {
            return step[key] === previousStep[key];
        });*/
        return JSON.stringify(step) === JSON.stringify(previousStep);
    });
};

export const computeHighTapPosition = (steps: Record<number, TapChangerStepMapInfos>) => {
    const values = steps ? Object.keys(steps).map(Number) : [];
    return values.length > 0 ? Math.max(...values) : null;
};

interface TapChangerInfos {
    regulatingTerminalConnectableType: string;
    regulatingTerminalConnectableId: string;
    regulatingTerminalVlId: string;
}

export const getTapChangerEquipmentSectionTypeValue = (tapChanger: TapChangerInfos) => {
    if (!tapChanger?.regulatingTerminalConnectableType) {
        return null;
    } else {
        return tapChanger?.regulatingTerminalConnectableType + ' : ' + tapChanger?.regulatingTerminalConnectableId;
    }
};

export function toTapChangerStepList(
    stepsRecord: Record<number, TapChangerStepMapInfos> | undefined
): TapChangerStep[] | undefined {
    if (stepsRecord) {
        return Object.keys(stepsRecord)
            .map((key) => {
                const index = Number(key);
                return {
                    ...stepsRecord[index],
                    [FieldConstants.STEPS_TAP]: index,
                };
            })
            .sort((a, b) => {
                return a[FieldConstants.STEPS_TAP] - b[FieldConstants.STEPS_TAP];
            });
    }
    return undefined;
}
