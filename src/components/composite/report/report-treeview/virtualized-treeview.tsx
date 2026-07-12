/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List, useListRef } from 'react-window';
import { Label } from '@mui/icons-material';
import { Box, Theme } from '@mui/material';
import { ReportItem, TreeviewItem } from './treeview-item';
import { ReportTree } from '../report.type';
import { useTreeViewScroll } from './hooks/use-treeview-scroll';
import { QuickSearch } from '../QuickSearch';
import { reportStyles } from '../report.styles';
import { MuiStyles } from '../../../../utils';

const styles = {
    treeItem: {
        whiteSpace: 'nowrap',
        minHeight: '100%',
    },
    labelIcon: (theme: Theme) => ({
        marginRight: theme.spacing(1),
    }),
    listContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    treeviewContainer: {
        flex: 1,
        position: 'relative',
    },
} as const satisfies MuiStyles;

export interface TreeViewProps {
    expandedTreeReports: string[];
    setExpandedTreeReports: (reportIds: string[]) => void;
    selectedReportId: string;
    reportTree: ReportTree;
    onSelectedItem: (node: ReportItem) => void;
    highlightedReportId?: string;
}

export function VirtualizedTreeview({
    expandedTreeReports,
    setExpandedTreeReports,
    selectedReportId,
    onSelectedItem,
    highlightedReportId,
    reportTree,
}: TreeViewProps) {
    const listRef = useListRef(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<number[]>([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const onExpandItem = useCallback(
        (node: ReportItem) => {
            if (node.collapsed) {
                return setExpandedTreeReports([...expandedTreeReports, node.id]);
            }
            return setExpandedTreeReports(expandedTreeReports.filter((id) => id !== node.id));
        },
        [expandedTreeReports, setExpandedTreeReports]
    );

    const toTreeNodes = useCallback(
        (item: ReportTree, depth: number, newExpandedTreeReports: string[]): ReportItem[] => {
            const result: ReportItem[] = [];
            const collapsed = !newExpandedTreeReports.includes(item.id);
            if (item.id) {
                result.push({
                    collapsed,
                    depth,
                    label: item.message,
                    id: item.id,
                    isLeaf: !item.subReports.find((subReports) => subReports.id !== null),
                    icon: <Label htmlColor={item.severity.colorName} sx={styles.labelIcon} />,
                    isSelected: item.id === selectedReportId,
                });
                if (!collapsed) {
                    item.subReports.forEach((subReport) => {
                        result.push(...toTreeNodes(subReport, depth + 1, newExpandedTreeReports));
                    });
                }
            }
            return result;
        },
        [selectedReportId]
    );

    const nodes = useMemo(
        () => toTreeNodes(reportTree, 0, expandedTreeReports),
        [reportTree, toTreeNodes, expandedTreeReports]
    );

    useTreeViewScroll(highlightedReportId, nodes, listRef);

    const expandIfMatch = useCallback(
        (item: ReportTree, newSearchTerm: string, newExpandedTreeReports: Set<string>) => {
            let hasMatchingChild = false;
            item.subReports.forEach((subReport) => {
                if (expandIfMatch(subReport, newSearchTerm, newExpandedTreeReports)) {
                    hasMatchingChild = true;
                }
            });
            if (item.message.toLowerCase().includes(newSearchTerm.toLowerCase()) || hasMatchingChild) {
                newExpandedTreeReports.add(item.id);
                return true;
            }
            return false;
        },
        []
    );

    const handleSearch = useCallback(
        (newSearchTerm: string) => {
            setSearchTerm(newSearchTerm);
            const matches: number[] = [];
            const newExpandedTreeReports = new Set(expandedTreeReports);

            expandIfMatch(reportTree, newSearchTerm, newExpandedTreeReports);

            const updatedExpandedTreeReports = Array.from(newExpandedTreeReports);
            setExpandedTreeReports(updatedExpandedTreeReports);

            const expandedNodes = toTreeNodes(reportTree, 0, updatedExpandedTreeReports);
            expandedNodes.forEach((node, index) => {
                if (node.label.toLowerCase().includes(newSearchTerm.toLowerCase())) {
                    matches.push(index);
                }
            });

            setSearchResults(matches);
            setCurrentResultIndex(matches.length > 0 ? 0 : -1);
        },
        [expandedTreeReports, expandIfMatch, reportTree, toTreeNodes, setExpandedTreeReports]
    );

    useEffect(() => {
        if (currentResultIndex >= 0 && searchResults.length > 0) {
            listRef.current?.scrollToRow({ index: searchResults[currentResultIndex], align: 'end' });
        }
    }, [currentResultIndex, listRef, searchResults]);

    const handleNavigate = useCallback(
        (direction: 'next' | 'previous') => {
            if (searchResults.length === 0) {
                return;
            }
            let newIndex;
            if (direction === 'next') {
                newIndex = (currentResultIndex + 1) % searchResults.length;
            } else {
                newIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
            }
            setCurrentResultIndex(newIndex);
        },
        [currentResultIndex, searchResults]
    );

    const resetSearch = useCallback(() => {
        setSearchTerm('');
        setSearchResults([]);
        setCurrentResultIndex(-1);
    }, []);

    return (
        <Box sx={reportStyles.mainContainer}>
            <QuickSearch
                currentResultIndex={currentResultIndex}
                onSearch={handleSearch}
                onNavigate={handleNavigate}
                resultCount={searchResults.length}
                resetSearch={resetSearch}
                placeholder="searchPlaceholderLogsTreeStructure"
                inputRef={inputRef}
            />
            <Box sx={styles.treeviewContainer}>
                <Box sx={styles.listContainer}>
                    <List
                        listRef={listRef}
                        style={styles.treeItem}
                        rowCount={nodes.length}
                        rowHeight={32}
                        rowProps={{
                            nodes,
                            onSelectedItem,
                            onExpandItem,
                            highlightedReportId,
                            searchTerm,
                            currentResultIndex,
                            searchResults,
                        }}
                        rowComponent={TreeviewItem}
                    />
                </Box>
            </Box>
        </Box>
    );
}
