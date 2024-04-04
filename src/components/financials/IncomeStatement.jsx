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
    const [incomeData, setIncomeData] = React.useState(null);

    React.useEffect(() => {
        const getIncomeStatement = async () => {
            try {
                const response = await axios.get('http://localhost:8000/public/asset/financials/income-statement/', { params: { symbol } });
                const data = response.data;
                setIncomeData(data);
            } catch (error) {
                console.error(error);
            }
        };

        getIncomeStatement();
    }, [symbol]);

    if (!incomeData) {
        return <DisplayError/>;
    }

    const years = [...new Set(incomeData.flatMap(item => Object.keys(item).filter(key => key !== 'item')))].sort();

    const columns = [
        { id: 'item', label: '', minWidth: 100 },
        ...years.map(year => ({ id: year, label: year.slice(0, 4), minWidth: 100 })),
    ];

    const sections = [
        { title: 'Revenue', start: 0, end: 4 },
        { title: 'Operating Expenses & Income', start: 4, end: 8 },
        { title: 'Earnings from Continuing Operations', start: 8, end: 10 },
        { title: 'Net Income', start: 10, end: 11 },
        { title: 'Supplemental', start: 11, end: incomeData.length },
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
                                {incomeData.slice(section.start, section.end).map((row) => (
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