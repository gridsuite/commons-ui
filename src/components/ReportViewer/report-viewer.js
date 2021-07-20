/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ReportItem from './report-item';
import LogReport from './log-report';
import Grid from '@material-ui/core/Grid';
import LogTable from './log-table';

const MAX_SUB_REPORTS = 500;

const useStyles = makeStyles({
    treeView: {
        height: '100%',
        overflow: 'scroll',
    },
    treeItem: {
        whiteSpace: 'nowrap',
    },
});

export default function ReportViewer({
    jsonReport,
    maxSubReports = MAX_SUB_REPORTS,
}) {
    const classes = useStyles();

    const [selectedNode, setSelectedNode] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [logs, setLogs] = useState(null);

    const rootReport = useRef(null);
    const allReports = useRef({});
    const treeView = useRef(null);

    const createReporterItem = useCallback(
        (logReport) => {
            allReports.current[logReport.getId()] = logReport;
            if (logReport.getSubReports().length > maxSubReports) {
                console.warn(
                    'The number (%s) being greater than %s only the first %s subreports will be displayed',
                    logReport.getSubReports().length,
                    maxSubReports,
                    maxSubReports
                );
            }
            return (
                <ReportItem
                    labelText={logReport.getTitle()}
                    labelIconColor={logReport.getHighestSeverity().color}
                    key={logReport.getId().toString()}
                    className={classes.treeItem}
                    nodeId={logReport.getId().toString()}
                >
                    {logReport
                        .getSubReports()
                        .slice(0, maxSubReports)
                        .map((value) => createReporterItem(value))}
                </ReportItem>
            );
        },
        [maxSubReports, classes.treeItem]
    );

    useEffect(() => {
        rootReport.current = new LogReport(jsonReport);
        let rootId = rootReport.current.getId().toString();
        treeView.current = createReporterItem(rootReport.current);
        setSelectedNode(rootId);
        setExpandedNodes([rootId]);
        setLogs(rootReport.current.getAllLogs());
    }, [jsonReport, createReporterItem]);

    const handleToggleNode = (event, nodeIds) => {
        event.persist();
        let iconClicked = event.target.closest('.MuiTreeItem-iconContainer');
        if (iconClicked) {
            setExpandedNodes(nodeIds);
        }
    };

    const handleSelectNode = (event, nodeId) => {
        selectNode(nodeId);
    };

    const selectNode = (nodeId) => {
        if (selectedNode !== nodeId) {
            setSelectedNode(nodeId);
            setLogs(allReports.current[nodeId].getAllLogs());
        }
    };

    return (
        rootReport.current && (
            <Grid container style={{ height: '100%' }}>
                <Grid
                    item
                    xs={12}
                    sm={3}
                    style={{
                        height: '100%',
                        borderRight: '1px solid rgba(81, 81, 81, 1)',
                    }}
                >
                    <TreeView
                        className={classes.treeView}
                        defaultCollapseIcon={<ArrowDropDownIcon />}
                        defaultExpandIcon={<ArrowRightIcon />}
                        defaultEndIcon={<div style={{ width: 24 }} />}
                        onNodeToggle={handleToggleNode}
                        onNodeSelect={handleSelectNode}
                        selected={selectedNode}
                        expanded={expandedNodes}
                    >
                        {treeView.current}
                    </TreeView>
                </Grid>
                <Grid item xs={12} sm={9} style={{ height: '100%' }}>
                    <LogTable logs={logs} />
                </Grid>
            </Grid>
        )
    );
}
