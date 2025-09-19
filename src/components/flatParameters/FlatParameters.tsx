/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Fragment, useCallback, useState } from 'react';
import {
    Autocomplete,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    MenuItem,
    Select,
    Switch,
    TextField,
    TextFieldProps,
    Tooltip,
    Typography,
} from '@mui/material';
import { Tune as TuneIcon } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { MultipleSelectionDialog } from '../multipleSelectionDialog/MultipleSelectionDialog';
import type { MuiStyles } from '../../utils/styles';

const styles = {
    paramList: {
        width: '100%',
        margin: 0,
    },
    paramListItem: (theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        gap: theme.spacing(2),
        paddingLeft: 0,
        paddingRight: 0,
    }),
    paramName: {
        fontWeight: 'bold',
        minWidth: '30%',
        overflowWrap: 'anywhere',
    },
} as const satisfies MuiStyles;

const FloatRE = /^-?\d*[.,]?\d*([eE]-?\d*)?$/;
const IntegerRE = /^-?\d*$/;
const ListRE = /^\[(.*)]$/;
const sepRE = /[, ]/;

export function extractDefault(paramDescription: Parameter) {
    const d = paramDescription.defaultValue;
    if (paramDescription.type === 'BOOLEAN') {
        return !!d;
    }
    if (paramDescription.type === 'DOUBLE') {
        return d - 0.0;
    }
    if (paramDescription.type === 'INTEGER') {
        return d - 0;
    }
    if (paramDescription.type === 'STRING_LIST') {
        if (Array.isArray(d)) {
            return d;
        }
        const mo = ListRE.exec(d);
        if (mo === null || mo.length <= 1) {
            return [];
        }
        return mo[1]
            .split(sepRE)
            .map((s) => s.trim())
            .filter((s) => !!s);
    }
    return d ?? null;
}

function longestCommonPrefix(stringList: string[]) {
    if (!stringList?.length) {
        return '';
    }
    let prefix = stringList.reduce((acc: string, str: string) => (str.length < acc.length ? str : acc));

    stringList.forEach((str) => {
        while (!str.startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
        }
    });
    return prefix;
}

export type Parameter = {
    type: 'BOOLEAN' | 'DOUBLE' | 'INTEGER' | 'STRING_LIST' | 'STRING';
    description?: string;
    name: string;
    possibleValues: string[];
    defaultValue: any;
};

export interface FlatParametersProps {
    paramsAsArray: Parameter[];
    initValues: Record<string, string>;
    onChange: (paramName: string, value: unknown, isInEdition: boolean) => void;
    variant?: TextFieldProps['variant'];
    showSeparator?: boolean;
    selectionWithDialog?: (param: Parameter) => boolean;
}

/**
 * Present a "list" of independently editable parameters according to
 * their description, as given by paramsAsArray, with current values as in initValues.
 * @param paramsAsArray [{type,name,possibleValues,defaultValue}]
 * @param initValues {k:v}
 * @param onChange (paramName, newValue, isInEdition)
 * @param variant style variant for TextField, Autocomplete and Select parameter fields
 * @param showSeparator if true, a separator is added between parameters
 * @param selectionWithDialog {(param: {}) => boolean} if true, param with multiple options use dialog for selection
 */
export function FlatParameters({
    paramsAsArray,
    initValues,
    onChange,
    variant = 'outlined',
    showSeparator = false,
    selectionWithDialog = () => false,
}: FlatParametersProps) {
    const intl = useIntl();

    const longestPrefix = longestCommonPrefix(paramsAsArray.map((m) => m.name));
    const lastDotIndex = longestPrefix.lastIndexOf('.');
    const prefix = longestPrefix.slice(0, lastDotIndex + 1);

    const [uncommitted, setUncommitted] = useState(null);
    const [inEditionParam, setInEditionParam] = useState<string | null>(null);
    const [openSelector, setOpenSelector] = useState(false);

    const getTranslatedValue = useCallback(
        (prefixValue: string, value: string) => {
            return intl.formatMessage({
                id: `${prefixValue}.${value}`,
                defaultMessage: value,
            });
        },
        [intl]
    );

    const getSelectionDialogName = useCallback(
        (paramName: string) => {
            const defaultMessage = intl.formatMessage({
                id: paramName,
                defaultMessage: paramName.slice(prefix.length),
            });
            return intl.formatMessage({
                id: `${paramName}.selectionDialog.name`,
                defaultMessage,
            });
        },
        [intl, prefix.length]
    );
    const sortPossibleValues = useCallback(
        (prefixValue: string, values: string[]) => {
            if (values == null) {
                return [];
            }
            // Sort by translated values
            return values
                .map((value) => {
                    return {
                        id: value,
                        message: getTranslatedValue(prefixValue, value),
                    };
                })
                .sort((a, b) => a.message.localeCompare(b.message));
        },
        [getTranslatedValue]
    );

    const onFieldChange = useCallback(
        (value: any, param: Parameter) => {
            const paramName = param.name;
            const isInEdition = inEditionParam === paramName;
            if (isInEdition) {
                setUncommitted(value);
            }
            if (onChange) {
                if (param.type === 'STRING_LIST') {
                    onChange(paramName, value ? value.toString() : null, isInEdition);
                } else {
                    onChange(paramName, value, isInEdition);
                }
            }
        },
        [inEditionParam, onChange]
    );

    const onUncommitted = useCallback(
        (param: Parameter, inEdit: boolean) => {
            if (inEdit) {
                setInEditionParam(param.name);
            } else {
                if (onChange && uncommitted != null) {
                    if (!['INTEGER', 'DOUBLE'].includes(param.type)) {
                        onChange(param.name, uncommitted, false);
                    } else if (uncommitted) {
                        // may give NaN
                        onChange(param.name, uncommitted - 0, false);
                    } else {
                        onChange(param.name, extractDefault(param), false);
                    }
                }
                setInEditionParam(null);
                setUncommitted(null);
            }
        },
        [uncommitted, onChange]
    );

    function mixInitAndDefault(param: Parameter) {
        if (param.name === inEditionParam && uncommitted !== null) {
            return uncommitted;
        }
        if (initValues && Object.hasOwn(initValues, param.name)) {
            if (param.type === 'BOOLEAN') {
                // on the server side, we only store String, so we eventually need to convert before
                return initValues[param.name] === 'false' ? false : initValues[param.name]; // 'true' is truthly
            }
            if (param.type !== 'STRING_LIST') {
                return initValues[param.name];
            }
            const valueList = initValues[param.name];
            if (Array.isArray(valueList)) {
                return valueList;
            }
            // otherwise split string into array
            return valueList
                ? valueList
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => !!s)
                : [];
        }
        return extractDefault(param);
    }

    const outputTransformFloatString = (value: string | undefined) => {
        return value?.replace(',', '.') || '';
    };

    const getStringListValue = (allValues: string[], selectValues: string[]) => {
        if (!selectValues || !selectValues.length) {
            return intl.formatMessage({ id: 'flat_parameters/none' });
        }

        if (selectValues.length === allValues.length) {
            return intl.formatMessage({ id: 'flat_parameters/all' });
        }

        return intl.formatMessage({ id: 'flat_parameters/some' });
    };

    const renderField = (param: Parameter) => {
        const fieldValue = mixInitAndDefault(param);
        // eslint-disable-next-line default-case
        switch (param.type) {
            case 'BOOLEAN':
                return <Switch checked={!!fieldValue} onChange={(e) => onFieldChange(e.target.checked, param)} />;
            case 'DOUBLE': {
                const err =
                    Number.isNaN(fieldValue) ||
                    (typeof fieldValue !== 'number' && !!fieldValue && Number.isNaN(fieldValue - 0));
                return (
                    <TextField
                        size="small"
                        sx={{ width: '50%' }}
                        inputProps={{ style: { textAlign: 'right' } }}
                        value={fieldValue}
                        onFocus={() => onUncommitted(param, true)}
                        onBlur={() => onUncommitted(param, false)}
                        onChange={(e) => {
                            const m = FloatRE.exec(e.target.value);
                            if (m) {
                                onFieldChange(outputTransformFloatString(e.target.value), param);
                            }
                        }}
                        error={err}
                        variant={variant}
                    />
                );
            }
            case 'INTEGER':
                return (
                    <TextField
                        size="small"
                        sx={{ width: '50%' }}
                        inputProps={{ style: { textAlign: 'right' } }}
                        value={fieldValue}
                        onFocus={() => onUncommitted(param, true)}
                        onBlur={() => onUncommitted(param, false)}
                        onChange={(e) => {
                            const m = IntegerRE.exec(e.target.value);
                            if (m) {
                                onFieldChange(e.target.value, param);
                            }
                        }}
                        variant={variant}
                    />
                );
            case 'STRING_LIST':
                if (param.possibleValues) {
                    const allOptions = sortPossibleValues(param.name, param.possibleValues).map(({ id }) => id);

                    const withDialog = selectionWithDialog(param);
                    if (withDialog) {
                        return (
                            <>
                                <TextField
                                    value={getStringListValue(allOptions, fieldValue)}
                                    size="small"
                                    variant={variant}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <IconButton onClick={() => setOpenSelector(true)}>
                                                <TuneIcon />
                                            </IconButton>
                                        ),
                                    }}
                                />
                                <MultipleSelectionDialog
                                    items={allOptions}
                                    titleId={getSelectionDialogName(param.name)}
                                    open={openSelector}
                                    getItemLabel={(option) => getTranslatedValue(param.name, option)}
                                    getItemId={(o) => o}
                                    selectedItems={fieldValue}
                                    addSelectAllCheckbox
                                    handleClose={() => setOpenSelector(false)}
                                    handleValidate={(selectedOptions) => {
                                        onFieldChange(selectedOptions, param);
                                        setOpenSelector(false);
                                    }}
                                />
                            </>
                        );
                    }
                    return (
                        <Autocomplete
                            fullWidth
                            multiple
                            size="small"
                            options={sortPossibleValues(param.name, param.possibleValues).map((v) => v.id)}
                            getOptionLabel={(option) => getTranslatedValue(param.name, option)}
                            onChange={(e, value) => onFieldChange(value, param)}
                            value={fieldValue}
                            renderTags={(values, getTagProps) => {
                                return values.map((value, index) => (
                                    <Chip
                                        label={getTranslatedValue(param.name, value)}
                                        {...getTagProps({ index })}
                                        key={`chip_${value}`}
                                    />
                                ));
                            }}
                            renderInput={(inputProps) => <TextField {...inputProps} variant={variant} />}
                        />
                    );
                }
                // no possible values => free user inputs
                return (
                    <Autocomplete
                        multiple
                        freeSolo
                        autoSelect
                        sx={{ width: '50%' }}
                        options={[]}
                        size="small"
                        onChange={(e, value) => onFieldChange(value, param)}
                        value={fieldValue}
                        renderTags={(values, getTagProps) => {
                            return values.map((value, index) => (
                                <Chip
                                    id={`chip_${value}`}
                                    size="small"
                                    label={value}
                                    {...getTagProps({ index })}
                                    key={`chip_${value}`}
                                />
                            ));
                        }}
                        renderInput={(inputProps) => <TextField {...inputProps} variant={variant} />}
                    />
                );
            case 'STRING':
                if (param.possibleValues) {
                    return (
                        <Select
                            labelId={param.name}
                            value={fieldValue ?? ''}
                            onChange={(ev) => {
                                onFieldChange(ev.target.value, param);
                            }}
                            size="small"
                            sx={{ minWidth: '4em' }}
                            variant={variant}
                        >
                            {sortPossibleValues(param.name, param.possibleValues).map((value) => (
                                <MenuItem key={value.id} value={value.id}>
                                    <Typography>{value.message}</Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    );
                }
            // else continu/fallthrough to default
        }
        return (
            <TextField
                sx={{ width: '50%' }}
                size="small"
                value={fieldValue || ''}
                onFocus={() => onUncommitted(param, true)}
                onBlur={() => onUncommitted(param, false)}
                onChange={(e) => onFieldChange(e.target.value, param)}
                variant={variant}
            />
        );
    };

    return (
        <List sx={styles.paramList}>
            {paramsAsArray.map((param, index) => (
                <Fragment key={param.name}>
                    <ListItem sx={styles.paramListItem}>
                        <Tooltip
                            title={<FormattedMessage id={`${param.name}.desc`} defaultMessage={param.description} />}
                            enterDelay={1200}
                            key={param.name}
                        >
                            <Typography sx={styles.paramName}>
                                <FormattedMessage id={param.name} defaultMessage={param.name.slice(prefix.length)} />
                            </Typography>
                        </Tooltip>
                        {renderField(param)}
                    </ListItem>
                    {showSeparator && index !== paramsAsArray.length - 1 && <Divider />}
                </Fragment>
            ))}
        </List>
    );
}
