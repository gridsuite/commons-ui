/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { ElementAttributes, ElementType, LAST_SELECTED_DIRECTORY } from '../../utils';
import { fetchDirectoryElementPath, updateConfigParameter } from '../../services';

/**
 * Gets the last selected directory ID from localStorage with proper null handling
 * @returns UUID or null if no valid directory ID is stored
 */
export function getLastSelectedDirectoryId(): UUID | null {
    const lastSelectedDirId = localStorage.getItem(LAST_SELECTED_DIRECTORY);

    if (!lastSelectedDirId || lastSelectedDirId === 'null') {
        return null;
    }

    return lastSelectedDirId as UUID;
}

/**
 * Clears the last selected directory from both localStorage and backend
 */
export async function clearLastSelectedDirectory(): Promise<void> {
    localStorage.removeItem(LAST_SELECTED_DIRECTORY);

    try {
        await updateConfigParameter(LAST_SELECTED_DIRECTORY, 'null');
    } catch (error) {
        console.error('Failed to clear last selected directory:', error);
    }
}

/**
 * Saves a directory ID as the last selected directory
 * @param directoryId The directory UUID to save
 */
export async function saveLastSelectedDirectory(directoryId: UUID): Promise<void> {
    try {
        await updateConfigParameter(LAST_SELECTED_DIRECTORY, directoryId);
    } catch (error) {
        console.error('Failed to save last selected directory:', error);
    }
}

/**
 * Fetches directory path with error handling and validation
 * @param directoryId The directory UUID to fetch path for
 * @returns Promise resolving to path array or null if failed
 */
export async function fetchDirectoryPathSafe(directoryId: UUID): Promise<ElementAttributes[] | null> {
    try {
        const path = await fetchDirectoryElementPath(directoryId);

        if (!path || path.length === 0) {
            return null;
        }

        return path;
    } catch (error) {
        console.warn(`Failed to fetch directory path for ${directoryId}:`, error);
        return null;
    }
}

/**
 * Initializes directory expansion from last selected directory
 * @returns Promise resolving to expansion path or null if failed
 */
export async function initializeFromLastSelected(): Promise<UUID[] | null> {
    const lastSelectedDirId = getLastSelectedDirectoryId();

    if (!lastSelectedDirId) {
        return null;
    }

    const path = await fetchDirectoryPathSafe(lastSelectedDirId);

    if (!path) {
        // Clear invalid last selected directory
        await clearLastSelectedDirectory();
        return null;
    }

    // Return the full path as expansion array
    return path.map((element) => element.elementUuid);
}

/**
 * Fetches expansion paths for multiple selected items
 * @param selectedIds Array of selected item UUIDs
 * @param expanded Optional existing expanded nodes
 * @returns Promise resolving to combined expansion array
 */
export async function getExpansionPathsForSelected(selectedIds: UUID[], expanded: UUID[] = []): Promise<UUID[]> {
    const expandedSet = new Set<UUID>(expanded);

    const fetchPromises = selectedIds.map(async (selectedId) => {
        const path = await fetchDirectoryPathSafe(selectedId);

        if (path && path.length > 0) {
            // Add all parent directories to the expanded set (exclude the item itself)
            path.forEach((element, index) => {
                if (index < path.length - 1) {
                    expandedSet.add(element.elementUuid);
                }
            });
        }
    });

    await Promise.all(fetchPromises);
    return Array.from(expandedSet);
}

/**
 * Saves the last selected directory from a TreeViewFinderNode
 * @param node The selected node
 */
export async function saveLastSelectedDirectoryFromNode(node: {
    id: UUID;
    type?: string;
    parents?: Array<{ id: UUID }>;
}): Promise<void> {
    let lastSelectedDirId: UUID | undefined;

    if (node.type === ElementType.DIRECTORY || node.type === undefined) {
        // If selecting a directory, save it directly
        lastSelectedDirId = node.id;
    } else if (node.parents && node.parents.length > 0) {
        // If selecting a file, save its parent directory
        lastSelectedDirId = node.parents[node.parents.length - 1].id;
    }

    if (lastSelectedDirId) {
        await saveLastSelectedDirectory(lastSelectedDirId);
    }
}

/**
 * Fetches children for expanded nodes with staggered delay to avoid overwhelming the server
 * @param expandedNodes Array of node UUIDs to fetch children for
 * @param fetchChildrenCallback Function to fetch children for a single node
 * @param delayBetweenRequests Delay in milliseconds between requests (default: 100ms)
 */
export function fetchChildrenForExpandedNodes(
    expandedNodes: UUID[],
    fetchChildrenCallback: (nodeId: UUID, delay: number) => void,
    delayBetweenRequests: number = 100
): void {
    expandedNodes.forEach((nodeId, index) => {
        fetchChildrenCallback(nodeId, index * delayBetweenRequests);
    });
}
