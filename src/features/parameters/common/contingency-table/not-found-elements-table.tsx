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
                            <TableCell key="list">{intl.formatMessage({ id: 'contingencyList' })}</TableCell>
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
