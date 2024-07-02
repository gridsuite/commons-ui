/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ValueEditorProps } from 'react-querybuilder';
import { Grid, Theme } from '@mui/material';
import { useCallback } from 'react';
import RuleValueEditor from './rule-value-editor';
import {
    CompositeField,
    CompositeGroup,
    CompositeRule,
} from '../../../filter/expert/expert-filter.type';

const styles = {
    group: (theme: Theme) => ({
        border: 1,
        borderRadius: 1,
        borderColor: theme.palette.grey[500],
    }),
};

function GroupValueEditor(props: ValueEditorProps<CompositeField>) {
    const {
        fieldData: { combinator, children },
        value,
        handleOnChange,
    } = props;

    const generateOnChangeRuleHandler = useCallback(
        (field: string) => (rule: CompositeRule) => {
            const compositeGroup: CompositeGroup = {
                ...value,
                combinator,
                rules: {
                    ...value?.rules,
                    [field]: rule,
                },
            };

            handleOnChange(compositeGroup);
        },
        [handleOnChange, combinator, value]
    );

    return (
        <Grid
            container
            direction="column"
            sx={styles.group}
            paddingLeft={1}
            paddingRight={1}
            paddingBottom={1}
        >
            {children &&
                Object.values(children).map((fieldData) => (
                    <RuleValueEditor
                        {...props}
                        key={fieldData.name}
                        field={fieldData.name}
                        fieldData={fieldData}
                        rule={value?.rules?.[fieldData.name]}
                        handleOnChangeRule={generateOnChangeRuleHandler(
                            fieldData.name
                        )}
                    />
                ))}
        </Grid>
    );
}

export default GroupValueEditor;
