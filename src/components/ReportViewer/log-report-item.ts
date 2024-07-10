/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ReportValue, SubReport } from './report.type';
import { LogSeverities, LogSeverity } from './log-severity';

export default class LogReportItem {
    key: string;

    reportId: string;

    severity: LogSeverity;

    log: string;

    static resolveTemplateMessage(
        templateMessage: string,
        templateValues: Record<string, ReportValue>
    ) {
        const templateVars: Record<string, string | number> = {};
        Object.entries(templateValues).forEach(([key, value]) => {
            templateVars[key] = value.value;
        });
        return templateMessage.replace(
            /\${([^{}]*)}/g,
            function resolveTemplate(a, b) {
                const r = templateVars[b];
                return typeof r === 'string' || typeof r === 'number'
                    ? r.toString()
                    : a;
            }
        );
    }

    constructor(jsonReport: SubReport, reportId: string) {
        this.key = jsonReport.reportKey;
        this.log = LogReportItem.resolveTemplateMessage(
            jsonReport.defaultMessage,
            jsonReport.values
        );
        this.reportId = reportId;
        this.severity = LogReportItem.initSeverity(
            jsonReport.values.reportSeverity as unknown as ReportValue
        );
    }

    getLog() {
        return this.log;
    }

    getReportId() {
        return this.reportId;
    }

    getSeverity() {
        return this.severity;
    }

    getSeverityName() {
        return this.severity.name;
    }

    getColorName() {
        return this.severity.colorName;
    }

    getColorHexCode() {
        return this.severity.colorHexCode;
    }

    static initSeverity(jsonSeverity: ReportValue) {
        let severity = LogSeverities.UNKNOWN;
        if (!jsonSeverity) {
            return severity;
        }

        Object.values(LogSeverities).some((value) => {
            const severityFound = (jsonSeverity.value as string).includes(
                value.name
            );
            if (severityFound) {
                severity = value;
            }
            return severityFound;
        });

        return severity;
    }
}
