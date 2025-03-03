/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FormattedMessage, useIntl } from 'react-intl';
import { SchemaDescription, getIn } from 'yup';
import { ReactElement } from 'react';
import { FormHelperText, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { InfoOutlined, WarningAmberRounded } from '@mui/icons-material';

export function HelperPreviousValue(
    previousValue: number | string,
    nodeIsBuilt?: boolean,
    disableTooltip?: boolean,
    adornment?: any
) {
    const intl = useIntl();
    if (previousValue || previousValue === 0) {
        return !disableTooltip ? (
            <FormHelperText error={false}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {nodeIsBuilt ? (
                        <InfoOutlined color="info" fontSize="small" />
                    ) : (
                        <WarningAmberRounded color="warning" fontSize="small" />
                    )}
                    <Tooltip
                        title={intl.formatMessage({ id: nodeIsBuilt ? 'builtNodeTooltip' : 'UnBuiltNodeTooltip' })}
                        placement="bottom-start"
                        arrow
                        PopperProps={{
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [0, -10],
                                    },
                                },
                            ],
                        }}
                    >
                        <Typography noWrap fontSize={11} align="center">
                            {previousValue + (adornment ? ` ${adornment?.text}` : '')}
                        </Typography>
                    </Tooltip>
                </Stack>
            </FormHelperText>
        ) : (
            <FormHelperText error={false}>{previousValue + (adornment ? ` ${adornment?.text}` : '')}</FormHelperText>
        );
    }
    return undefined;
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

export const isFieldRequired = (fieldName: string, schema: any, values: unknown) => {
    const { schema: fieldSchema, parent: parentValues } = getIn(schema, fieldName, values) || {};
    return (fieldSchema.describe({ parent: parentValues }) as SchemaDescription)?.optional === false;

    // static way, not working when using "when" in schema, but does not need form values
    // return yup.reach(schema, fieldName)?.exclusiveTests?.required === true;
};

export const gridItem = (field: string | ReactElement, size: number = 6) => {
    return (
        <Grid item xs={size} alignItems="start">
            {field}
        </Grid>
    );
};

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
