/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ValueEditorProps } from 'react-querybuilder';
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import {
    CompositeRule,
    OperatorOption,
} from '../../../filter/expert/expert-filter.type';

const styles = {
    gridItem: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'baseline',
    },
};

type RuleValueEditorProps = ValueEditorProps & {
    rule?: CompositeRule;
    handleOnChangeRule: (rule: CompositeRule) => void;
};

const RuleValueEditor = (props: RuleValueEditorProps) => {
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
    const operator =
        rule?.operator ??
        (fieldData.operators as OperatorOption[])?.map((op) => op.name)[0];

    const handleOnChangeOperator = (operator: string) => {
        handleOnChangeRule({
            ...rule,
            operator: operator,
        });
    };

    const handleOnChangeValue = (value: any) => {
        handleOnChangeRule({
            ...rule,
            value: value,
            operator: operator,
        });
    };

    return (
        <Grid container paddingTop={1}>
            <Grid container item xs={4} sx={styles.gridItem}>
                <Typography>
                    {intl.formatMessage({ id: fieldData.label })}
                </Typography>
            </Grid>
            <Grid container item xs={2.5} sx={styles.gridItem} paddingLeft={1}>
                <Select
                    value={operator}
                    size={'small'}
                    onChange={(event) => {
                        handleOnChangeOperator(event.target.value);
                    }}
                    variant={'standard'}
                >
                    {(fieldData.operators as OperatorOption[])?.map(
                        (operator) => (
                            <MenuItem key={operator.name} value={operator.name}>
                                {intl.formatMessage({ id: operator.label })}
                            </MenuItem>
                        )
                    )}
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
};

export default RuleValueEditor;
