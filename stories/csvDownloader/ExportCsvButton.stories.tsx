/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ExportButtonProps, ExportCsvButton } from '../../src/components/ui/csvDownloader/export-csv-button';

function ExportCsvButtonStory(args: ExportButtonProps) {
    const [isDownloadLoading, setIsDownloadLoading] = useState(false);
    const [isDownloadSuccessful, setIsDownloadSuccessful] = useState(false);
    const simulatedDownload = () => {
        setIsDownloadLoading(true);
        setTimeout(() => {
            setIsDownloadLoading(false);
            setIsDownloadSuccessful(true);
        }, 1000);
    };
    return (
        <ExportCsvButton
            {...args}
            onClick={simulatedDownload}
            isDownloadLoading={isDownloadLoading}
            isDownloadSuccessful={isDownloadSuccessful}
        />
    );
}

const meta = {
    title: 'UI/Buttons/ExportCsvButton',
    component: ExportCsvButton,
    tags: ['autodocs'],
    args: { onClick: () => undefined },
    render: (args) => <ExportCsvButtonStory {...args} />,
} satisfies Meta<typeof ExportCsvButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
