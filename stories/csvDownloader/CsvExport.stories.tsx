import type { Meta, StoryObj } from '@storybook/react-vite';
import { CsvExport } from '../../src/components/ui/csvDownloader/csv-export';

const meta = {
    title: 'UI/Csv/CsvExport',
    component: CsvExport,
    tags: ['autodocs'],
    args: {
        columns: [{ field: 'name' }, { field: 'status' }],
        tableName: 'sample-table',
        language: 'en',
        disabled: false,
        getData: () => 'name,status\nLine A,Active',
    },
} satisfies Meta<typeof CsvExport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };

//TODO: remove