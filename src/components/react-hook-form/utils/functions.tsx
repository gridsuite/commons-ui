import { FormattedMessage } from 'react-intl';
import { SchemaDescription, getIn } from 'yup';

export function genHelperPreviousValue(
    previousValue: number | string,
    adornment?: any
) {
    return {
        ...((previousValue || previousValue === 0) && {
            error: false,
            helperText:
                previousValue + (adornment ? ' ' + adornment?.text : ''),
        }),
    };
}

export function genHelperError(...errors: any[]) {
    const inError = errors.find((e) => e);
    if (inError) {
        return {
            error: true,
            helperText: <FormattedMessage id={inError} />,
        };
    }
    return {};
}

export function identity(x: any) {
    return x;
}

// When using Typescript, you can't get the validation schema from useFormContext (because it is a custom prop)
// this method can be used instead in Typescript files
export const isFieldFromContextRequired = (
    fieldName: string,
    formContext: any,
    values: unknown
) => {
    const { validationSchema } = formContext;
    return isFieldRequired(fieldName, validationSchema, values);
};

export const isFieldRequired = (
    fieldName: string,
    schema: any,
    values: unknown
) => {
    const { schema: fieldSchema, parent: parentValues } =
        getIn(schema, fieldName, values) || {};
    return (
        (fieldSchema.describe({ parent: parentValues }) as SchemaDescription)
            ?.optional === false
    );

    //static way, not working when using "when" in schema, but does not need form values
    //return yup.reach(schema, fieldName)?.exclusiveTests?.required === true;
};
