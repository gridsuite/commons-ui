/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { screen } from '@testing-library/react';
import { it } from '@jest/globals';
import CardErrorBoundary from '../CardErrorBoundary';
import { RenderBuilder } from '../../../tests/testsUtils';

const RenderBuilderInstance = new RenderBuilder().withTrad();
it('renders the child component when there is no error', () => {
    RenderBuilderInstance.render(
        <CardErrorBoundary>
            <div>Child Component</div>
        </CardErrorBoundary>
    );

    const childComponent = screen.getByText('Child Component');
    expect(childComponent).toBeInTheDocument();
});

it('renders an error message when there is an error', () => {
    const errorMessage = 'Something went wrong';
    const ErrorComponent = () => {
        throw new Error(errorMessage);
    };

    RenderBuilderInstance.render(
        <CardErrorBoundary>
            <ErrorComponent />
        </CardErrorBoundary>
    );

    const errorText = screen.getByText(errorMessage);
    expect(errorText).toBeInTheDocument();
});
