/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { useCallback } from 'react';
import type { UUID } from 'node:crypto';
import { MODIFICATION_TYPES, EquipmentType, ModificationType } from '../utils';

export interface NetworkModificationMetadata {
    uuid: UUID;
    type: ModificationType;
    date: Date;
    stashed: boolean;
    activated: boolean;
    description: string;
    messageType: string;
    messageValues: string;
}

interface ModificationValues {
    equipmentId: string;
    action: string;
    energizedVoltageLevelId: string;
    equipmentAttributeName: string;
    equipmentAttributeValue: string;
    voltageLevelEquipmentId: string;
    substationEquipmentId: string;
}

const getOperatingStatusModificationValues = (modification: ModificationValues, formatBold: boolean) => {
    return {
        action: modification.action,
        energizedEnd: modification.energizedVoltageLevelId,
        computedLabel: formatBold ? <strong>{modification.equipmentId}</strong> : modification.equipmentId,
    };
};

const getEquipmentAttributeModificationValues = (modification: ModificationValues, formatBold: boolean) => {
    return {
        equipmentAttributeName: modification.equipmentAttributeName,
        equipmentAttributeValue: modification.equipmentAttributeValue,
        computedLabel: formatBold ? <strong>{modification.equipmentId}</strong> : modification.equipmentId,
    };
};

const getVoltageLevelWithSubstationModificationValues = (modification: ModificationValues, formatBold: boolean) => {
    return {
        voltageLevelEquipmentId: formatBold ? (
            <strong>{modification.voltageLevelEquipmentId}</strong>
        ) : (
            modification.voltageLevelEquipmentId
        ),
        substationEquipmentId: formatBold ? (
            <strong>{modification.substationEquipmentId}</strong>
        ) : (
            modification.substationEquipmentId
        ),
    };
};

export const useModificationLabelComputer = () => {
    const intl = useIntl();

    const getLabel = useCallback(
        (modif: NetworkModificationMetadata) => {
            const modificationMetadata = JSON.parse(modif.messageValues);

            switch (modif.messageType) {
                case MODIFICATION_TYPES.LINE_SPLIT_WITH_VOLTAGE_LEVEL.type:
                    return modificationMetadata.lineToSplitId;
                case MODIFICATION_TYPES.LINE_ATTACH_TO_VOLTAGE_LEVEL.type:
                    return modificationMetadata.lineToAttachToId;
                case MODIFICATION_TYPES.LINES_ATTACH_TO_SPLIT_LINES.type:
                    return modificationMetadata.attachedLineId;
                case MODIFICATION_TYPES.DELETE_VOLTAGE_LEVEL_ON_LINE.type:
                    return `${modificationMetadata.lineToAttachTo1Id}/${modificationMetadata.lineToAttachTo2Id}`;
                case MODIFICATION_TYPES.DELETE_ATTACHING_LINE.type:
                    return `${modificationMetadata.attachedLineId}/${modificationMetadata.lineToAttachTo1Id}/${modificationMetadata.lineToAttachTo2Id}`;
                case MODIFICATION_TYPES.TABULAR_MODIFICATION.type:
                case MODIFICATION_TYPES.LIMIT_SETS_TABULAR_MODIFICATION.type:
                    return intl.formatMessage({
                        id: `network_modifications.tabular.${modificationMetadata.tabularModificationType}`,
                    });
                case MODIFICATION_TYPES.BY_FILTER_DELETION.type:
                    return intl.formatMessage({
                        id:
                            modificationMetadata.equipmentType === EquipmentType.HVDC_LINE
                                ? 'Hvdc'
                                : modificationMetadata.equipmentType,
                    });
                case MODIFICATION_TYPES.TABULAR_CREATION.type:
                    return intl.formatMessage({
                        id: `network_modifications.tabular.${modificationMetadata.tabularCreationType}`,
                    });
                case MODIFICATION_TYPES.CREATE_COUPLING_DEVICE.type:
                case MODIFICATION_TYPES.CREATE_VOLTAGE_LEVEL_TOPOLOGY.type:
                case MODIFICATION_TYPES.CREATE_VOLTAGE_LEVEL_SECTION.type:
                case MODIFICATION_TYPES.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS.type:
                    return modificationMetadata.voltageLevelId;
                case MODIFICATION_TYPES.VOLTAGE_INIT_MODIFICATION.type:
                    if (
                        modificationMetadata.rootNetworkName &&
                        modificationMetadata.nodeName &&
                        modificationMetadata.computationDate
                    ) {
                        const computedDateFormatted = new Intl.DateTimeFormat(intl.locale, {
                            dateStyle: 'long',
                            timeStyle: 'long',
                            hour12: false,
                        }).format(new Date(modificationMetadata.computationDate));
                        return `: ${modificationMetadata.rootNetworkName} / ${modificationMetadata.nodeName} / ${computedDateFormatted}`;
                    }
                    return '';
                default:
                    return modificationMetadata.equipmentId || '';
            }
        },
        [intl]
    );

    const computeLabel = useCallback(
        (modif: NetworkModificationMetadata, formatBold = true) => {
            const modificationValues = JSON.parse(modif.messageValues);

            switch (modif.messageType) {
                case MODIFICATION_TYPES.OPERATING_STATUS_MODIFICATION.type:
                    return getOperatingStatusModificationValues(modificationValues, formatBold);
                case MODIFICATION_TYPES.EQUIPMENT_ATTRIBUTE_MODIFICATION.type:
                    return getEquipmentAttributeModificationValues(modificationValues, formatBold);
                case MODIFICATION_TYPES.VOLTAGE_LEVEL_CREATION_SUBSTATION_CREATION.type:
                    return getVoltageLevelWithSubstationModificationValues(modificationValues, formatBold);
                default:
                    return { computedLabel: formatBold ? <strong>{getLabel(modif)}</strong> : getLabel(modif) };
            }
        },
        [getLabel]
    );

    return { computeLabel };
};
