/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { useCallback, useState } from 'react';
import { UUID } from 'node:crypto';
import {
    EquipmentInfos,
    EquipmentInfosTypes,
    EquipmentType,
    ExtendedEquipmentType,
    snackWithFallback,
    StudyContext,
} from '../utils';
import { useSnackMessage } from './useSnackMessage';
import { fetchNetworkElementInfos } from '../services';

// TODO fetchNetworkElementInfos has no type
type FetchResponse = Awaited<ReturnType<typeof fetchNetworkElementInfos>>;

export interface UseFormSearchCopy {
    isDialogSearchOpen: boolean;
    handleOpenSearchDialog: () => void;
    handleSelectionChange: (element: EquipmentInfos) => void;
    handleCloseSearchDialog: () => void;
}

export function useFormSearchCopy(
    setFormValues: (response: FetchResponse) => void,
    elementType: EquipmentType | ExtendedEquipmentType,
    studyContext?: StudyContext
): UseFormSearchCopy {
    const intl = useIntl();
    const { snackInfo, snackError } = useSnackMessage();
    const [isDialogSearchOpen, setIsDialogSearchOpen] = useState(false);

    const handleCloseSearchDialog = useCallback(() => {
        setIsDialogSearchOpen(false);
    }, []);

    const handleOpenSearchDialog = useCallback(() => {
        setIsDialogSearchOpen(true);
    }, []);

    const handleSelectionChange = useCallback(
        (element: EquipmentInfos) => {
            if (!studyContext) {
                return;
            }
            fetchNetworkElementInfos(
                studyContext.studyId,
                studyContext.nodeId,
                studyContext.rootNetworkId,
                elementType,
                EquipmentInfosTypes.FORM,
                element.id as UUID,
                true
            )
                .then((response) => {
                    setFormValues(response);
                    snackInfo({
                        messageTxt: intl.formatMessage({ id: 'EquipmentCopied' }, { equipmentId: element.id }),
                    });
                })
                .catch((error: Error) => {
                    snackWithFallback(snackError, error, {
                        headerId: 'EquipmentCopyFailed',
                        headerValues: { equipmentId: element.id },
                    });
                })
                .finally(() => handleCloseSearchDialog());
        },
        [studyContext, elementType, handleCloseSearchDialog, intl, setFormValues, snackError, snackInfo]
    );

    return {
        isDialogSearchOpen,
        handleOpenSearchDialog,
        handleSelectionChange,
        handleCloseSearchDialog,
    };
}
