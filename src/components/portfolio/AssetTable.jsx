import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    borderStyle: 'none',
                    color: 'white',
                },
                columnHeaderTitle: {
                    color: '#c4c4c4',
                },
                sortIcon: {
                    color: '#2f77d3',
                },
                row: {
                    '&:hover': {
                        backgroundColor: 'rgba(211, 211, 211, 0.1)', // lightgrey with 50% transparency
                    },
                },
            },
        },
        MuiTablePagination: {
            styleOverrides: {
                actions: {
                    color: '#c4c4c4',
                },
                displayedRows: {
                    color: '#c4c4c4',
                },
            },
        },
    },
});

export default function AssetTable({ pid }) {

    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/portfolio/${pid}/assets/`)
            .then(response => {
                const assetsWithValues = response.data.map(asset => ({
                    ...asset,
                    value: (parseFloat(asset.units) * parseFloat(asset.currentPrice)).toFixed(2),
                    basis: (parseFloat(asset.units) * parseFloat(asset.averagePrice)).toFixed(2)
                }));
                setData(assetsWithValues);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [pid]);

    const columns = [
        {
            field: 'name', headerName: 'Holdings', width: 200, flex: 3, align: 'left', headerAlign: 'left', renderCell: (params) => (
                <div>
                    <div>{params.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'gray', textTransform: 'uppercase' }}>{params.row.ticker}</div>
                </div>
            ),
        },
        { field: 'type', headerName: 'Type', width: 200, flex: 2, align: 'left', headerAlign: 'left' },
        { field: 'sector', headerName: 'Sector', width: 200, flex: 2, align: 'left', headerAlign: 'left' },
        { field: 'units', headerName: 'Units', width: 200, flex: 2, align: 'left', headerAlign: 'left' },
        {
            field: 'basis', headerName: 'Cost Basis', width: 200, flex: 2, align: 'left', headerAlign: 'left', renderCell: (params) => (
                <span>{`${params.value} USD`}</span>
            ),
        },
        {
            field: 'value', headerName: 'Current Value', width: 200, flex: 2, align: 'left', headerAlign: 'left', renderCell: (params) => (
                <span>{`${params.value} USD`}</span>
            ),
        },
        {
            field: 'profit',
            headerName: 'Profit',
            width: 200,
            flex: 2,
            align: 'left',
            headerAlign: 'left',
            renderCell: (params) => {
                const profit = params.row.profit;
                const percentageChange = params.row.percentageChange;
                let color;
                let Icon;
                if (profit > 0) {
                    color = '#6dc78b';
                    Icon = ArrowDropUpIcon;
                } else if (profit < 0) {
                    color = '#e06b5b';
                    Icon = ArrowDropDownIcon;
                } else {
                    color = 'inherit'; // Use the default color when the value is 0
                    Icon = null;
                }
                return (
                    <span style={{ color, fontWeight: 'bold' }}>
                        <div>{profit} USD</div>
                        <div>{percentageChange}%{Icon && <Icon sx={{ color: { color } }} />}</div>
                    </span>
                );
            },
        }
    ];

    return (
        <ThemeProvider theme={customTheme}>
            {data &&
                <DataGrid
                    rows={data}
                    columns={columns}
                    style={{ minHeight: 560 }} // Set minimum height here
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    rowHeight={90}
                    getRowId={(row) => { return row.id; }}
                    disableRowSelectionOnClick
                />}
        </ThemeProvider>
    )
}