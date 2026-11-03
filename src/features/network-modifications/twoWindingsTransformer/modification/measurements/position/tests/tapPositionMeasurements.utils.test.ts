/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IntlShape } from 'react-intl';
import { OperationType } from '../../../../../../../utils';
import {
    TwoWindingsTransformerModificationFormData,
    twoWindingsTransformerModificationDtoToForm,
    twoWindingsTransformerModificationEmptyFormData,
    twoWindingsTransformerModificationFormToDto,
    twoWindingsTransformerModificationFormSchema,
} from '../../../twoWindingsTransformerModification.utils';
import { TwoWindingsTransformerModificationDto } from '../../../twoWindingsTransformerModification.types';

jest.mock('react-resizable-panels', () => ({}));
jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000', validate: () => true }));

const intl = { formatMessage: ({ id }: { id: string }) => id } as unknown as IntlShape;

const buildDto = (overrides: Partial<TwoWindingsTransformerModificationDto> = {}) =>
    ({ equipmentId: 'twt1', ...overrides }) as TwoWindingsTransformerModificationDto;

const buildForm = (
    ratioTapChangerPositionMeasurement: number | null,
    phaseTapChangerPositionMeasurement: number | null
) =>
    ({
        ...twoWindingsTransformerModificationEmptyFormData,
        equipmentID: 'twt1',
        tapPositionMeasurement: { ratioTapChangerPositionMeasurement, phaseTapChangerPositionMeasurement },
    }) as unknown as TwoWindingsTransformerModificationFormData;

const formToDto = (form: TwoWindingsTransformerModificationFormData) =>
    twoWindingsTransformerModificationFormToDto(form, undefined, intl, null);

describe('twoWindingsTransformer tap position measurements mapping', () => {
    it.each([
        [3, 5],
        [0, 0],
        [-2, -4],
        [0, -1],
    ])('round-trips ratio=%d and phase=%d between DTO and form', (ratio, phase) => {
        const dto = buildDto({
            ratioTapChangerPositionMeasurement: { value: ratio, op: OperationType.SET },
            phaseTapChangerPositionMeasurement: { value: phase, op: OperationType.SET },
        });

        const form = twoWindingsTransformerModificationDtoToForm(dto);
        expect(form.tapPositionMeasurement).toEqual({
            ratioTapChangerPositionMeasurement: ratio,
            phaseTapChangerPositionMeasurement: phase,
        });

        const result = formToDto(form);
        expect(result.ratioTapChangerPositionMeasurement).toEqual({ value: ratio, op: OperationType.SET });
        expect(result.phaseTapChangerPositionMeasurement).toEqual({ value: phase, op: OperationType.SET });
    });

    it('maps absent DTO fields (older DTOs) to null in the form', () => {
        const form = twoWindingsTransformerModificationDtoToForm(buildDto());

        expect(form.tapPositionMeasurement).toEqual({
            ratioTapChangerPositionMeasurement: null,
            phaseTapChangerPositionMeasurement: null,
        });
    });

    it('maps null DTO fields to null in the form', () => {
        const form = twoWindingsTransformerModificationDtoToForm(
            buildDto({ ratioTapChangerPositionMeasurement: null, phaseTapChangerPositionMeasurement: null })
        );

        expect(form.tapPositionMeasurement).toEqual({
            ratioTapChangerPositionMeasurement: null,
            phaseTapChangerPositionMeasurement: null,
        });
    });

    it('produces no modification when both inputs are blank', () => {
        const result = formToDto(buildForm(null, null));

        expect(result.ratioTapChangerPositionMeasurement).toBeNull();
        expect(result.phaseTapChangerPositionMeasurement).toBeNull();
    });

    it('modifies only the filled input', () => {
        const result = formToDto(buildForm(0, null));

        expect(result.ratioTapChangerPositionMeasurement).toEqual({ value: 0, op: OperationType.SET });
        expect(result.phaseTapChangerPositionMeasurement).toBeNull();
    });

    it('is blank by default in the empty form data and accepted by the schema', () => {
        expect(twoWindingsTransformerModificationEmptyFormData.tapPositionMeasurement).toEqual({
            ratioTapChangerPositionMeasurement: null,
            phaseTapChangerPositionMeasurement: null,
        });
        expect(
            twoWindingsTransformerModificationFormSchema.validateSyncAt('tapPositionMeasurement', buildForm(-1, 0))
        ).toEqual({ ratioTapChangerPositionMeasurement: -1, phaseTapChangerPositionMeasurement: 0 });
        expect(
            twoWindingsTransformerModificationFormSchema.validateSyncAt('tapPositionMeasurement', buildForm(null, null))
        ).toEqual({ ratioTapChangerPositionMeasurement: null, phaseTapChangerPositionMeasurement: null });
    });
});
