/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo } from 'react';
import {
    Equipment,
    EquipmentType,
    ExtendedEquipmentType,
    getEquipmentsInfosForSearchBar,
    getIdentifiableNameOrId,
    getUseNameKey,
    Identifiable,
    StudyContext,
} from '../utils';
import { searchEquipmentsInfos } from '../services';
import { useElementSearch } from './useElementSearch';

interface UseSearchMatchingEquipmentsProps {
    inUpstreamBuiltParentNode?: boolean;
    equipmentType?: EquipmentType | ExtendedEquipmentType;
    studyContext: StudyContext;
}

export const useSearchMatchingEquipments = (props: UseSearchMatchingEquipmentsProps) => {
    const { studyContext, inUpstreamBuiltParentNode, equipmentType } = props;

    const getNameOrId = useCallback(
        (infos?: Identifiable | null) => {
            return getIdentifiableNameOrId(studyContext.useNameParam, infos);
        },
        [studyContext.useNameParam]
    );

    const getUseNameParameterKey = useCallback(() => {
        return getUseNameKey(studyContext.useNameParam);
    }, [studyContext.useNameParam]);

    const fetchElements: (newSearchTerm: string) => Promise<Equipment[]> = useCallback(
        (newSearchTerm) =>
            searchEquipmentsInfos(
                studyContext.studyId,
                studyContext.nodeId,
                studyContext.rootNetworkId,
                newSearchTerm,
                getUseNameParameterKey,
                inUpstreamBuiltParentNode,
                equipmentType
            ),
        [equipmentType, getUseNameParameterKey, inUpstreamBuiltParentNode, studyContext]
    );

    const { elementsFound, isLoading, searchTerm, updateSearchTerm } = useElementSearch({
        fetchElements,
    });

    const equipmentsFound = useMemo(
        () => getEquipmentsInfosForSearchBar(elementsFound, getNameOrId),
        [elementsFound, getNameOrId]
    );

    useEffect(() => {
        updateSearchTerm(searchTerm?.trim());
    }, [searchTerm, equipmentType, updateSearchTerm]);

    return {
        searchTerm,
        updateSearchTerm,
        equipmentsFound,
        isLoading,
    };
};
