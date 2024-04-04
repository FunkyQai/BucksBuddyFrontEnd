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
    const [cashData, setCashData] = React.useState(null);

    React.useEffect(() => {
        const getCashFlow = async () => {
            try {
                const response = await axios.get('http://localhost:8000/public/asset/financials/cash-flow/', { params: { symbol } });
                const data = response.data;
                setCashData(data);
            } catch (error) {
                console.error(error);
            }
        };

        getCashFlow();
    }, [symbol]);

    if (!cashData) {
        return <DisplayError/>;
    }

    const years = [...new Set(cashData.flatMap(item => Object.keys(item).filter(key => key !== 'item')))].sort();

    const columns = [
        { id: 'item', label: '', minWidth: 100 },
        ...years.map(year => ({ id: year, label: year.slice(0, 4), minWidth: 100 })),
    ];
    
    const sections = [
        { title: 'Cash Flow From Operations', start: 0, end: 2 },
        { title: 'Cash Flow From Investing', start: 2, end: 5 },
        { title: 'Cash Flow From Financing Activities', start: 5, end: 9 },
        { title: 'Net Change In Cash', start: 9, end: 10 },
        { title: 'Supplemental', start: 10, end: cashData.length },
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
                                {cashData.slice(section.start, section.end).map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.item}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            const isNegative = typeof value === 'number' && value < 0;
                                            return (
                                                <TableCell 
                                                    key={column.id} 
                                                    align={column.align} 
                                                    style={isNegative ? { color: 'red' } : {}}
                                                >
                                                    {isNegative ? `(${Math.abs(value)})` : value}
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