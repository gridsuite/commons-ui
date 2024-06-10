/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ValueEditorProps } from 'react-querybuilder';
import { Grid, Theme } from '@mui/material';
import CompositeRuleValueEditor from './composite-rule-value-editor';
import {
    CompositeField,
    CompositeRule,
} from '../../../filter/expert/expert-filter.type';
import { useCallback } from 'react';

const styles = {
    group: (theme: Theme) => ({
        border: 1,
        borderRadius: 1,
        borderColor: theme.palette.grey[500],
    }),
};

const CompositeGroupValueEditor = (props: ValueEditorProps<CompositeField>) => {
    const {
        handleOnChange,
        fieldData: { combinator, children },
        value,
    } = props;

    const generateOnChangeHandler = useCallback(
        (field: string) => (compositeRule: CompositeRule) => {
            handleOnChange({
                ...value,
                combinator: combinator,
                rules: {
                    ...value?.rules,
                    [field]: compositeRule,
                },
            });
        },
        [handleOnChange, combinator, value]
    );

    return (
        <Grid
            container
            direction={'column'}
            sx={styles.group}
            paddingLeft={1}
            paddingRight={1}
            paddingBottom={1}
        >
            {children &&
                Object.values(children).map((fieldData) => (
                    <CompositeRuleValueEditor
                        {...props}
                        key={fieldData.name}
                        field={fieldData.name}
                        fieldData={fieldData}
                        compositeRule={value?.rules?.[fieldData.name]}
                        handleOnChange={generateOnChangeHandler(fieldData.name)}
                    />
                ))}
        </Grid>
    );
};

export default CompositeGroupValueEditor;