/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ValueEditorProps } from 'react-querybuilder';
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { CompositeRule, OperatorOption } from '../../../filter/expert/expertFilter.type';
import type { MuiStyles } from '../../../../utils/styles';

const styles = {
    gridItem: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'baseline',
    },
} as const satisfies MuiStyles;

type RuleValueEditorProps = ValueEditorProps & {
    rule?: CompositeRule;
    handleOnChangeRule: (rule: CompositeRule) => void;
};

export function RuleValueEditor(props: RuleValueEditorProps) {
    const {
        schema: {
            controls: { valueEditor: ValueEditorControlElement },
        },
        fieldData,
        rule,
        handleOnChangeRule,
    } = props;
    const intl = useIntl();

    // set operator as the previous in rule if exists, otherwise the first operator in schema is selected
    const operator = rule?.operator ?? (fieldData.operators as OperatorOption[])?.map((op) => op.name)[0];

    const handleOnChangeOperator = (newOperator: string) => {
        handleOnChangeRule({
            ...rule,
            operator: newOperator,
        });
    };

    const handleOnChangeValue = (value: any) => {
        handleOnChangeRule({
            ...rule,
            value,
            operator,
        });
    };

    return (
        <Grid container paddingTop={1}>
            <Grid container item xs={4} sx={styles.gridItem}>
                <Typography>{intl.formatMessage({ id: fieldData.label })}</Typography>
            </Grid>
            <Grid container item xs={2.5} sx={styles.gridItem} paddingLeft={1}>
                <Select
                    value={operator}
                    size="small"
                    onChange={(event) => {
                        handleOnChangeOperator(event.target.value);
                    }}
                    variant="standard"
                >
                    {(fieldData.operators as OperatorOption[])?.map((option) => (
                        <MenuItem key={option.name} value={option.name}>
                            {intl.formatMessage({ id: option.label })}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid container item xs={5.5} sx={styles.gridItem} paddingLeft={1}>
                <ValueEditorControlElement
                    {...props}
                    operator={operator}
                    handleOnChange={handleOnChangeValue}
                    value={rule?.value}
                />
            </Grid>
        </Grid>
    );
}
