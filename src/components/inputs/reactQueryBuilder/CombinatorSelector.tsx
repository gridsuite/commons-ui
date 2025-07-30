/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CombinatorSelectorProps } from 'react-querybuilder';
import { useCallback, useState } from 'react';
import { MaterialValueSelector } from '@react-querybuilder/material';
import { PopupConfirmationDialog } from '../../dialogs/popupConfirmationDialog/PopupConfirmationDialog';
import { useSelectAppearance } from '../../../hooks/useSelectAppearance';

export function CombinatorSelector(props: CombinatorSelectorProps) {
    const { options, value, handleOnChange } = props;
    const [tempCombinator, setTempCombinator] = useState(value);
    const [openPopup, setOpenPopup] = useState(false);

    const handlePopupConfirmation = useCallback(() => {
        handleOnChange(tempCombinator);
        setOpenPopup(false);
    }, [handleOnChange, tempCombinator]);

    return (
        <>
            <PopupConfirmationDialog
                message="changeOperatorMessage"
                validateButtonLabel="button.changeOperator"
                openConfirmationPopup={openPopup}
                setOpenConfirmationPopup={setOpenPopup}
                handlePopupConfirmation={handlePopupConfirmation}
            />
            <MaterialValueSelector
                {...props}
                handleOnChange={(newCombinator) => {
                    setTempCombinator(newCombinator);
                    setOpenPopup(true);
                }}
                {...useSelectAppearance(options.length)}
            />
        </>
    );
}
