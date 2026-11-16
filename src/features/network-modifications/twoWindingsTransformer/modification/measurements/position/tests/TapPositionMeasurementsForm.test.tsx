/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { PropsWithChildren } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { object } from 'yup';
import { RenderBuilder } from '../../../../../../../tests/testsUtils.test';
import { CustomFormProvider } from '../../../../../../../components';
import { FieldConstants } from '../../../../../../../utils';
import { TapPositionMeasurementsForm } from '../TapPositionMeasurementsForm';
import {
    getTapPositionMeasurementsValidationSchemaObject,
    tapPositionMeasurementsEmptyFormData,
} from '../tapPositionMeasurements.utils';

jest.mock('react-resizable-panels', () => ({}));
jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000', validate: () => true }));

const schema = object().shape({
    [FieldConstants.TAP_POSITION_MEASUREMENT]: getTapPositionMeasurementsValidationSchemaObject(),
});

const trad = {
    TapMeasurementsSection: 'Tap position measurements',
    RatioTapPosition: 'Ratio tap position',
    PhaseTapPosition: 'Phase tap position',
};

let currentValues: Record<string, any> = {};

function FormWrapper({ children, defaultValue }: PropsWithChildren<{ defaultValue?: any }>) {
    const methods = useForm({
        defaultValues: {
            [FieldConstants.TAP_POSITION_MEASUREMENT]: defaultValue ?? tapPositionMeasurementsEmptyFormData,
        },
    });
    currentValues = methods.watch();
    return (
        <CustomFormProvider validationSchema={schema} {...methods}>
            {children}
        </CustomFormProvider>
    );
}

const renderForm = (
    props: Parameters<typeof TapPositionMeasurementsForm>[0] = {},
    defaultValue?: Record<string, number | null>
) =>
    new RenderBuilder().withTrad(trad).render(
        <FormWrapper defaultValue={defaultValue}>
            <TapPositionMeasurementsForm {...props} />
        </FormWrapper>
    );

describe('TapPositionMeasurementsForm', () => {
    it('renders both tap position inputs, empty by default', () => {
        renderForm();

        expect(screen.getByText('Tap position measurements')).toBeInTheDocument();
        expect(screen.getByLabelText(/Ratio tap position/)).toHaveValue('');
        expect(screen.getByLabelText(/Phase tap position/)).toHaveValue('');
    });

    it('shows previous values including zero and negative ones', () => {
        renderForm({
            measurementRatioTap: { value: 0, validity: true },
            measurementPhaseTap: { value: -3, validity: false },
        });

        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('-3')).toBeInTheDocument();
    });

    it('shows no previous value when the measurement is absent', () => {
        renderForm({ measurementRatioTap: undefined, measurementPhaseTap: { validity: true } });

        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('writes typed integers, including 0 and negative values, to the form', () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/Ratio tap position/), { target: { value: '0' } });
        fireEvent.change(screen.getByLabelText(/Phase tap position/), { target: { value: '-4' } });

        expect(currentValues[FieldConstants.TAP_POSITION_MEASUREMENT]).toEqual({
            ratioTapChangerPositionMeasurement: 0,
            phaseTapChangerPositionMeasurement: -4,
        });
    });

    it('can be cleared back to null (no modification)', () => {
        renderForm({}, { ratioTapChangerPositionMeasurement: 2, phaseTapChangerPositionMeasurement: null });

        const ratioInput = screen.getByLabelText(/Ratio tap position/);
        expect(ratioInput).toHaveValue('2');

        fireEvent.change(ratioInput, { target: { value: '' } });

        expect(currentValues[FieldConstants.TAP_POSITION_MEASUREMENT].ratioTapChangerPositionMeasurement).toBeNull();
    });
});
