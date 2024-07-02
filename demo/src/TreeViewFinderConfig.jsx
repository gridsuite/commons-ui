/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import PropTypes from 'prop-types';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
} from '@mui/material';

/**
 * TreeViewFinderConfig documentation:
 * Component to configure TreeViewFinder for demo
 *

 * @param {Boolean}         dynamicData - Does data needs dynamic update (Controlled). (see onDynamicDataChange)
 * @param {String}          dataFormat - Data format. Could be ('Tree' or 'List') (Controlled). (see onDataFormatChange)
 * @param {Boolean}         multiSelect - TreeViewFinder selection type parameter (Controlled). (see onSelectionTypeChange)
 * @param {Boolean}         onlyLeaves - TreeViewFinder selection only on leaves items (Controlled). (see onOnlyLeavesChange)
 * @param {EventListener}   onDynamicDataChange - onChange type EventListener on the dynamicData value change.
 * @param {EventListener}   onDataFormatChange - onChange type EventListener on the dataFormat value change.
 * @param {EventListener}   onSelectionTypeChange - onChange type EventListener on the multiselect value change.
 * @param {EventListener}   onOnlyLeavesChange - onChange type EventListener on the onlyLeaves value change.
 */
function TreeViewFinderConfig(props) {
    const {
        dynamicData,
        dataFormat,
        multiSelect,
        onlyLeaves,
        sortedAlphabetically,
        onDynamicDataChange,
        onDataFormatChange,
        onSelectionTypeChange,
        onOnlyLeavesChange,
        onSortedAlphabeticallyChange,
    } = props;

    return (
        <div
            style={{
                border: '1px solid black',
                padding: '8px',
            }}
        >
            <h3
                style={{
                    margin: '0px',
                }}
            >
                TreeViewFinder Configuration for Demo (no translation)
            </h3>
            <FormControl component="fieldset">
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                    }}
                >
                    <div>
                        <FormLabel component="legend-data-format">
                            Data Format
                        </FormLabel>
                        <RadioGroup
                            aria-label="data-format"
                            name="Data Format"
                            value={dataFormat}
                            onChange={onDataFormatChange}
                        >
                            <FormControlLabel
                                value="Tree"
                                control={<Radio />}
                                label="Tree"
                            />
                            <FormControlLabel
                                value="List"
                                control={<Radio />}
                                label="List"
                            />
                        </RadioGroup>
                    </div>
                    <div>
                        <FormLabel component="legend-data-update">
                            Data update
                        </FormLabel>
                        <RadioGroup
                            aria-label="dynamic-data"
                            name="Dynamic Data"
                            value={dynamicData ? 'dynamic' : 'static'}
                            onChange={onDynamicDataChange}
                        >
                            <FormControlLabel
                                value="static"
                                control={<Radio />}
                                label="static"
                            />
                            <FormControlLabel
                                value="dynamic"
                                control={<Radio />}
                                label="dynamic"
                            />
                        </RadioGroup>
                    </div>
                    <div>
                        <FormLabel component="legend-selection">
                            Selection Type
                        </FormLabel>
                        <RadioGroup
                            aria-label="seletcion-type"
                            name="Selection type"
                            value={multiSelect ? 'multiselect' : 'singleselect'}
                            onChange={onSelectionTypeChange}
                        >
                            <FormControlLabel
                                value="singleselect"
                                control={<Radio />}
                                label="single selection"
                            />
                            <FormControlLabel
                                value="multiselect"
                                control={<Radio />}
                                label="multiselect"
                            />
                        </RadioGroup>
                    </div>
                    <div>
                        <FormLabel component="legend">Other options</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={onlyLeaves}
                                        onChange={onOnlyLeavesChange}
                                        name="only-leaves"
                                    />
                                }
                                label="Only leaves selection"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={sortedAlphabetically}
                                        onChange={onSortedAlphabeticallyChange}
                                        name="sort-alphabetically"
                                    />
                                }
                                label="Sorted alphabetically"
                            />
                        </FormGroup>
                    </div>
                </div>
            </FormControl>
        </div>
    );
}

TreeViewFinderConfig.propTypes = {
    dynamicData: PropTypes.bool,
    dataFormat: PropTypes.string,
    multiSelect: PropTypes.bool,
    onlyLeaves: PropTypes.bool,
    sortedAlphabetically: PropTypes.bool,
    onDynamicDataChange: PropTypes.func,
    onDataFormatChange: PropTypes.func,
    onSelectionTypeChange: PropTypes.func,
    onOnlyLeavesChange: PropTypes.func,
    onSortedAlphabeticallyChange: PropTypes.func,
};

TreeViewFinderConfig.defaultProps = {
    dynamicData: false,
    dataFormat: 'Tree',
    multiSelect: false,
    onlyLeaves: false,
    sortedAlphabetically: false,
    onDynamicDataChange: () => {},
    onDataFormatChange: () => {},
    onSelectionTypeChange: () => {},
    onOnlyLeavesChange: () => {},
    onSortedAlphabeticallyChange: () => {},
};

export default TreeViewFinderConfig;
