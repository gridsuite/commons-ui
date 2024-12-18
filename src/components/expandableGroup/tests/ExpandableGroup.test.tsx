/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { ExpandableGroup } from '../ExpandableGroup';

describe('ExpandableGroup', () => {
    it('renders the header correctly', () => {
        const headerText = 'Test Header';
        render(<ExpandableGroup renderHeader={<div>{headerText}</div>} />);
        const headerElement = screen.getByText(headerText);
        expect(headerElement).toBeInTheDocument();
    });

    it('renders the children when expanded', () => {
        const childrenText = 'Test Children';
        render(
            <ExpandableGroup renderHeader={<div>Header</div>}>
                <div>{childrenText}</div>
            </ExpandableGroup>
        );
        const childrenElement = screen.getByText(childrenText);
        expect(childrenElement).toBeInTheDocument();
    });

    it('expands and collapses when clicked', async () => {
        const user = userEvent.setup();
        const headerText = 'Test Header';
        const childrenText = 'Test Children';
        render(
            <ExpandableGroup renderHeader={<div>{headerText}</div>}>
                <div>{childrenText}</div>
            </ExpandableGroup>
        );
        const accordionSummary = screen.getByText(headerText);
        const childrenTextDiv = screen.getByText(childrenText);
        expect(childrenTextDiv).not.toBeVisible();

        await user.click(accordionSummary);
        expect(childrenTextDiv).toBeVisible();
    });
});
