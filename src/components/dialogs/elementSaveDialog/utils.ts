/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { ElementAttributes } from '../../../utils';
import {
    clearLastSelectedDirectory,
    fetchDirectoryPathSafe,
    getLastSelectedDirectoryId,
} from '../../directoryItemSelector/utils';

/**
 * Generic directory initialization configuration
 */
export interface DirectoryInitConfig {
    studyUuid?: UUID;
    initDirectory?: ElementAttributes;
    onError?: (message: string, headerId: string) => void;
}

/**
 * Generic destination directory initialization that follows the standard priority:
 * 1. Last selected directory from localStorage
 * 2. Study UUID (if provided)
 * 3. Initial directory (if provided)
 *
 * @param config Configuration object
 * @returns Promise resolving to { element, path } or null if all methods fail
 */
export async function initializeDirectory(
    config: DirectoryInitConfig
): Promise<{ element: ElementAttributes; path?: ElementAttributes[] } | null> {
    const { studyUuid, initDirectory, onError } = config;

    // Priority 1: Try last selected directory from localStorage
    const lastSelectedDirId = getLastSelectedDirectoryId();
    if (lastSelectedDirId) {
        const path = await fetchDirectoryPathSafe(lastSelectedDirId);
        if (path && path.length > 0) {
            const targetElement = path[path.length - 1];
            return { element: targetElement, path };
        }
        // Clear invalid last selected directory
        await clearLastSelectedDirectory();
    }

    // Priority 2: Try study UUID
    if (studyUuid) {
        const path = await fetchDirectoryPathSafe(studyUuid);
        if (path && path.length >= 2) {
            const parentFolderIndex = path.length - 2;
            const parentElement = path[parentFolderIndex];
            return {
                element: parentElement,
                path: path.slice(0, parentFolderIndex + 1),
            };
        }
        onError?.('unknown study directory', 'studyDirectoryFetchingError');
        return null;
    }

    // Priority 3: Try initial directory
    if (initDirectory) {
        return { element: initDirectory };
    }

    return null;
}
