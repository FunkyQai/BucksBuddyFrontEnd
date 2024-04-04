import * as React from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';
import DisplayError from '../DisplayError';

export default function IncomeStatement({ symbol }) {
    const [balanceSheetData, setBalanceSheetData] = React.useState(null);

    React.useEffect(() => {
        const getBalanceSheet = async () => {
            try {
                const response = await axios.get('http://localhost:8000/public/asset/financials/balance-sheet/', { params: { symbol } });
                const data = response.data;
                setBalanceSheetData(data);
            } catch (error) {
                console.error(error);
            }
        };

        getBalanceSheet();
    }, [symbol]);

    if (!balanceSheetData) {
        return <DisplayError/>;
    }

    const years = [...new Set(balanceSheetData.flatMap(item => Object.keys(item).filter(key => key !== 'item')))].sort();

    const columns = [
        { id: 'item', label: '', minWidth: 100 },
        ...years.map(year => ({ id: year, label: year.slice(0, 4), minWidth: 100 })),
    ];

    const sections = [
        { title: 'Cash & Short Term Investments', start: 0, end: 3 },
        { title: 'Receivables', start: 3, end: 4 },
        { title: 'Current Assets', start: 4, end: 7 },
        { title: 'Long Term Assets', start: 7, end: 12 },
        { title: 'Current Liabilities', start: 12, end: 16 },
        { title: 'Long Term Liabilities', start: 16, end: 20 },
        { title: 'Common Equity', start: 20, end: 23 },
        { title: 'Supplemental', start: 23, end: balanceSheetData.length },
    ];

    return (
        <Paper>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        fontWeight: 'bold', 
                                        backgroundColor: 'lightgray'
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sections.map((section) => (
                            <>
                                <TableRow>
                                    <TableCell colSpan={columns.length} style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{section.title}</TableCell>
                                </TableRow>
                                {balanceSheetData.slice(section.start, section.end).map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.item}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="body2" align="right" style={{ padding: '16px' }}>
                In millions of USD
            </Typography>
        </Paper>
    );
}