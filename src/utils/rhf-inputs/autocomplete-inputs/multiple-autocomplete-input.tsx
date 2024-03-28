import { useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import AutocompleteInput from '../../../components/react-hook-form/autocomplete-input';

const MultipleAutocompleteInput = ({ name, ...props }: any) => {
    const [unsavedInput, setUnsavedInput] = useState('');
    const watchAutocompleteValues = useWatch({
        name,
    });

    const { append } = useFieldArray({
        name,
    });

    const handleOnBlur = () => {
        if (unsavedInput && !watchAutocompleteValues.includes(unsavedInput)) {
            append(unsavedInput);
        }
        setUnsavedInput('');
    };

    const outputTransform = (values: any[]) => {
        const newValues = values.map((val) => val.trim());

        return newValues.filter(
            (val, index) => newValues.indexOf(val) === index
        );
    };

    return (
        <AutocompleteInput
            name={name}
            fullWidth
            options={[]}
            allowNewValue
            clearOnBlur
            disableClearable={true}
            outputTransform={outputTransform}
            onInputChange={(_: unknown, val: string) =>
                setUnsavedInput(val.trim() ?? '')
            }
            onBlur={handleOnBlur}
            blurOnSelect={false}
            multiple
            ChipProps={{ size: 'small' }}
            {...props}
            u
        />
    );
};

export default MultipleAutocompleteInput;
