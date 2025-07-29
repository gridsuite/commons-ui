/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {  useEffect, useState } from 'react';
import {fetchNadGenerationMode} from "../services";

export const useNadeGenerationMode = (
) => {

    const [initialized, setInitialized] = useState<boolean>(false);
    const [nadGenerationMode, setNadGenerationMode] = useState<string>("");

    useEffect(() => {
        if (!initialized) {
            fetchNadGenerationMode().then(({ nadGenerationMode }) => {
                setNadGenerationMode(nadGenerationMode);
                setInitialized(true);
            });
        }
    }, [initialized, setInitialized]);
    return {nadGenerationMode}
};
