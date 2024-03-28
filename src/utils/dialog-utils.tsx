import { Grid } from '@mui/material';
import { ReactElement } from 'react';
import { SchemaDescription, getIn } from 'yup';

export const isFieldRequired = (
    fieldName: any,
    schema: string,
    values: any
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

export const gridItem = (field: string | ReactElement, size: number = 6) => {
    return (
        <Grid
            item
            xs={size}
            alignItems={'start'}
            component={() => <>{field}</>}
        />
    );
};

export const isFloatNumber = (val: string) => {
    return /^-?[0-9]*[.,]?[0-9]*$/.test(val);
};

export const func_identity = (e: unknown) => e;

export const toFloatOrNullValue = (value: string) => {
    if (value === '-') {
        return value;
    }
    if (value === '0') {
        return 0;
    }
    const tmp = value?.replace(',', '.') || '';
    return parseFloat(tmp) || null;
};
