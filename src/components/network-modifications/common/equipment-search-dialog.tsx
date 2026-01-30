/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { ElementSearchDialog, EquipmentItem } from '../../elementSearch';
import { EquipmentInfos, equipmentStyles, EquipmentType, ExtendedEquipmentType, StudyContext } from '../../../utils';
import { useSearchMatchingEquipments } from '../../../hooks';

interface EquipmentSearchDialogProps {
    open: boolean;
    onClose: () => void;
    onSelectionChange: (equipment: EquipmentInfos) => void;
    equipmentType: EquipmentType | ExtendedEquipmentType;
    studyContext: StudyContext;
}

/**
 * Dialog to search equipment with a given type
 * @param {Boolean} open: Is the dialog open ?
 * @param {Function} onClose: callback to call when closing the dialog
 * @param {Function} onSelectionChange: callback when the selection changes
 * @param {String} equipmentType: the type of equipment we want to search
 * @param studyContext the current tree node context (study case)
 */
export function EquipmentSearchDialog({
    open,
    onClose,
    onSelectionChange,
    equipmentType,
    studyContext,
}: Readonly<EquipmentSearchDialogProps>) {
    const intl = useIntl();
    const { searchTerm, updateSearchTerm, equipmentsFound, isLoading } = useSearchMatchingEquipments({
        inUpstreamBuiltParentNode: true,
        equipmentType,
        studyContext,
    });

    return (
        <ElementSearchDialog
            open={open}
            onClose={onClose}
            searchTerm={searchTerm}
            onSearchTermChange={updateSearchTerm}
            onSelectionChange={(element) => {
                updateSearchTerm('');
                onSelectionChange(element);
            }}
            elementsFound={equipmentsFound}
            renderElement={(props) => <EquipmentItem styles={equipmentStyles} {...props} key={props.element.key} />}
            loading={isLoading}
            getOptionLabel={(equipment) => equipment.label}
            isOptionEqualToValue={(equipment1, equipment2) => equipment1.id === equipment2.id}
            renderInput={(displayedValue, params) => (
                <TextField
                    autoFocus
                    {...params}
                    label={intl.formatMessage({
                        id: 'element_search/label',
                    })}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <Search color="disabled" />
                                {params.InputProps.startAdornment}
                            </>
                        ),
                    }}
                    value={displayedValue}
                />
            )}
        />
    );
}
