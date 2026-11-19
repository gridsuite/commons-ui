/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { act, renderHook } from '@testing-library/react';
import type { FieldErrors } from 'react-hook-form';
import { useTabs } from '../../../../../hooks/use-tabs';
import { FieldConstants } from '../../../../../utils';
import { TWT_TAB_FIELDS, TwoWindingsTransformerDialogTab } from '../twoWindingsTransformer.utils';

jest.mock('react-resizable-panels', () => ({}));
jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000', validate: () => true }));

const { CONNECTIVITY_TAB, CHARACTERISTICS_TAB, STATE_ESTIMATION_TAB } = TwoWindingsTransformerDialogTab;

const tapPositionMeasurementErrors = (
    measurementField:
        FieldConstants.RATIO_TAP_CHANGER_POSITION_MEASUREMENT | FieldConstants.PHASE_TAP_CHANGER_POSITION_MEASUREMENT
): FieldErrors => ({
    [FieldConstants.TAP_POSITION_MEASUREMENT]: {
        [measurementField]: { type: 'typeError', message: 'invalid' },
    },
});

const renderTwtTabs = (errors?: FieldErrors) =>
    renderHook(
        ({ liveErrors }: { liveErrors?: FieldErrors }) =>
            useTabs<TwoWindingsTransformerDialogTab>({
                defaultTab: CONNECTIVITY_TAB,
                errors: liveErrors,
                tabFields: TWT_TAB_FIELDS,
            }),
        { initialProps: { liveErrors: errors } }
    );

describe('TWT_TAB_FIELDS tap position measurement errors', () => {
    it('maps tap position measurements to the state estimation tab', () => {
        expect(TWT_TAB_FIELDS[STATE_ESTIMATION_TAB]).toContain(FieldConstants.TAP_POSITION_MEASUREMENT);
    });

    it.each([
        ['ratio', FieldConstants.RATIO_TAP_CHANGER_POSITION_MEASUREMENT],
        ['phase', FieldConstants.PHASE_TAP_CHANGER_POSITION_MEASUREMENT],
    ] as const)('navigates to the state estimation tab on %s tap position measurement error', (_name, field) => {
        const { result } = renderTwtTabs();
        act(() => result.current.setSelectedTab(CHARACTERISTICS_TAB));
        expect(result.current.selectedTab).toBe(CHARACTERISTICS_TAB);

        act(() => result.current.onError(tapPositionMeasurementErrors(field)));

        expect(result.current.selectedTab).toBe(STATE_ESTIMATION_TAB);
        expect(result.current.tabsWithError).toEqual([]);
    });

    it.each([
        ['ratio', FieldConstants.RATIO_TAP_CHANGER_POSITION_MEASUREMENT],
        ['phase', FieldConstants.PHASE_TAP_CHANGER_POSITION_MEASUREMENT],
    ] as const)('highlights the state estimation tab on live %s tap position measurement error', (_name, field) => {
        const { result } = renderTwtTabs(tapPositionMeasurementErrors(field));

        act(() => result.current.onTabChange({} as never, CHARACTERISTICS_TAB));

        expect(result.current.selectedTab).toBe(CHARACTERISTICS_TAB);
        expect(result.current.tabsWithError).toEqual([STATE_ESTIMATION_TAB]);
    });
});
