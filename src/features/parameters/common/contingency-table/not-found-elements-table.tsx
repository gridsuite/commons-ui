/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useIntl } from 'react-intl';
import { NotFoundElementsData } from './utils';

export type NotFoundElementsTableProps = {
    data: NotFoundElementsData[];
};

export default function NotFoundElementsTable({ data }: Readonly<NotFoundElementsTableProps>) {
    const intl = useIntl();
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 370, overflow: 'auto' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell key="list">{intl.formatMessage({ id: 'ContingenciesList' })}</TableCell>
                            <TableCell key="contingency">{intl.formatMessage({ id: 'Contingencies' })}</TableCell>
                            <TableCell key="element">{intl.formatMessage({ id: 'Equipment' })}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => {
                            return (
                                <TableRow hover tabIndex={-1} key={`${row.list}-${row.contingency}-${row.element}`}>
                                    <TableCell>{row.list}</TableCell>
                                    <TableCell>{row.contingency}</TableCell>
                                    <TableCell>{row.element}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
