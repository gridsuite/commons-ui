import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExportCsvButton } from '../../src/components/ui/csvDownloader/export-csv-button';
import { useState } from 'react';

const meta = {
    title: 'UI/Csv/ExportCsvButton',
    component: ExportCsvButton,
    tags: ['autodocs'],
    args: { onClick: () => undefined },
    render: (args) => {
        const [isDownloadLoading, setIsDownloadLoading] = useState(false);
        const [isDownloadSuccessful, setIsDownloadSuccessful] = useState(false);
        const simulatedDownload = () => {
            setIsDownloadLoading(true);
            setTimeout(() => {setIsDownloadLoading(false); setIsDownloadSuccessful(true)}, 1000);
        }
        return <ExportCsvButton {...args} onClick={simulatedDownload} isDownloadLoading={isDownloadLoading} isDownloadSuccessful={isDownloadSuccessful} />;
    },
} satisfies Meta<typeof ExportCsvButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
