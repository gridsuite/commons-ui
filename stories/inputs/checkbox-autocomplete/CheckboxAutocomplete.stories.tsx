/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    CheckboxAutocomplete,
    CheckboxAutocompleteProps,
} from '../../../src/components/ui/inputs/checkbox-autocomplete';

const options = ['France', 'Germany', 'Italy', 'Spain', 'Sweden'];

function CheckboxAutocompleteStory(args: CheckboxAutocompleteProps<string>) {
    const { value: defaultValue } = args;
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return <CheckboxAutocomplete {...args} value={value} onChange={setValue} />;
}

const meta = {
    title: 'UI/Inputs/CheckboxAutocomplete',
    component: CheckboxAutocomplete<string>,
    tags: ['autodocs'],
    args: { options, value: [], getOptionLabel: (option) => option, onChange: () => undefined },
    render: (args) => <CheckboxAutocompleteStory {...args} />,
} satisfies Meta<typeof CheckboxAutocomplete<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Selected: Story = { args: { value: ['France', 'Spain'] } };
export const Limited: Story = { args: { maxSelection: 2, value: ['France'] } };
