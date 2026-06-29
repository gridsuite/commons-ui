/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckBoxList } from '../../src/components/ui/checkBoxList/CheckBoxList';
import { CheckboxListProps } from '../../src';

type Item = { id: string; label: string; detail: string };
const items: Item[] = [
    { id: 'north', label: 'North', detail: '134 substations' },
    { id: 'south', label: 'South', detail: '234 substations' },
    { id: 'east', label: 'East', detail: '12 substations' },
];

function CheckboxListStory(args: CheckboxListProps<Item>) {
    const { selectedItems: defaultSelectedItems } = args;
    const [selectedItems, setSelectedItems] = useState(defaultSelectedItems);
    return <CheckBoxList {...args} selectedItems={selectedItems} onSelectionChange={setSelectedItems} />;
}

const meta = {
    title: 'UI/Inputs/CheckBoxList',
    component: CheckBoxList<Item>,
    tags: ['autodocs'],
    args: {
        items,
        selectedItems: [],
        getItemId: (item) => item.id,
        getItemLabel: (item) => item.label,
    },
    render: (args) => <CheckboxListStory {...args} />,
} satisfies Meta<typeof CheckBoxList<Item>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithSecondaryLabels: Story = { args: { getItemLabelSecondary: (item) => item.detail } };
export const WithDragNDrop: Story = { args: { isDndActive: true } };
export const WithAllSelection: Story = { args: { addSelectAllCheckbox: true } };
