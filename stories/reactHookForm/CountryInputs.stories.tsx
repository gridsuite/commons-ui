import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CustomFormProvider } from '../../src/components/ui/reactHookForm/provider/CustomFormProvider';
import { CountriesInput } from '../../src/components/ui/reactHookForm/selectInputs/CountriesInput';
import { CountrySelectionInput } from '../../src/components/ui/reactHookForm/CountrySelectionInput';

function CountryForm({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { country: 'FR' } });
    return <CustomFormProvider {...methods} validationSchema={yup.object().shape({country: yup.string().required()})}>{children}</CustomFormProvider>;
}

function CountriesForm({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { countries: ['FR', 'GB'] } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({ countries: yup.array().required().of(yup.string().required()) })}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Selection/CountryInputs',
    component: CountriesInput,
    tags: ['autodocs'],
    args: { name: 'countries', label: 'Countries' },
} satisfies Meta<typeof CountriesInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Multiple: Story = {
    decorators: [
        (Story) => (
            <CountriesForm>
                <Story />
            </CountriesForm>
        ),
    ],
};
export const Single: Story = {
    render: () => <CountryForm><CountrySelectionInput name="country" label="Country" /></CountryForm>,
};
