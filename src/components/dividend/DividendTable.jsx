import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'date', label: 'Ex. Dividend Date', minWidth: 70 },
  { id: 'dividend', label: 'Amount ($)', minWidth: 50, align: 'right' },
];

export default function DividendTable({ dividendData }) {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 8;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const rows = Object.entries(dividendData).map(([date, dividend]) => ({
    date,
    dividend: parseFloat(dividend),
  })).reverse();

  return (
    <Paper sx={{ backgroundColor: "#32323e" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, borderBottom: '1px solid grey', color: "#32323e", backgroundColor: "#c4c4c4" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.date}>
                    {columns.map((column) => {
                      let value = row[column.id];
                      if (column.id === 'date') {
                        value = new Date(value).toLocaleDateString();
                      } else if (column.id === 'dividend' && typeof value === 'number') {
                        value = value.toFixed(4);
                      }
                      return (
                        <TableCell key={column.id} align={column.align} style={{ color: '#fff', borderBottom: '1px solid grey' }}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => { }}
        rowsPerPageOptions={[]}
        sx={{
          color: '#89949d',
        }}

      />
    </Paper>
  );
}