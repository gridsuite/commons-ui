/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { v4 as uuid4 } from 'uuid';
import LogReportItem from './log-report-item';

import { Report } from './report.type';
import { LogSeverities, LogSeverity } from './log-severity';

export default class LogReport {
    id: string;

    key: string;

    title: string;

    subReports: LogReport[];

    logs: LogReportItem[];

    parentReportId?: string;

    constructor(jsonReporter: Report, parentReportId?: string) {
        this.id = uuid4();
        this.key = jsonReporter.taskKey;
        this.title = LogReportItem.resolveTemplateMessage(
            jsonReporter.defaultName,
            jsonReporter.taskValues
        );
        this.subReports = [];
        this.logs = [];
        this.parentReportId = parentReportId;
        this.init(jsonReporter);
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    getSubReports() {
        return this.subReports;
    }

    getLogs() {
        return this.logs;
    }

    getAllLogs(): LogReportItem[] {
        return this.getLogs().concat(
            this.getSubReports().flatMap((r) => r.getAllLogs())
        );
    }

    init(jsonReporter: Report) {
        jsonReporter.subReporters.map((value) =>
            this.subReports.push(new LogReport(value, this.id))
        );
        jsonReporter.reports.map((value) =>
            this.logs.push(new LogReportItem(value, this.id))
        );
    }

    getHighestSeverity(currentSeverity = LogSeverities.UNKNOWN): LogSeverity {
        const reduceFct = (p: LogSeverity, c: LogSeverity) =>
            p.level < c.level ? c : p;

        const highestSeverity = this.getLogs()
            .map((r) => r.getSeverity())
            .reduce(reduceFct, currentSeverity);

        return this.getSubReports()
            .map((r) => r.getHighestSeverity(highestSeverity))
            .reduce(reduceFct, highestSeverity);
    }
}
