import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddTransaction from './AddTransaction';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';



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


export default function Transactions({ pid }) {

    const [addOpen, setAddOpen] = React.useState(false);
    const [transactions, setTransactions] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleAddOpen = () => setAddOpen(true);
    const handleAddClose = () => setAddOpen(false);



    useEffect(() => {
        axios.get(`http://localhost:8000/portfolio/${pid}/transactions/`)
            .then(response => {
                const dataWithIds = response.data.map((item, index) => {
                    // Create a new Date object
                    const date = new Date(item.transaction_date);

                    // Format the date
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

                    // Combine asset_name and ticker
                    const asset = `${item.asset_name} (${item.ticker.toUpperCase()})`;  // convert ticker to uppercase

                    // Convert transaction_type to uppercase
                    const transaction_type = item.transaction_type.toUpperCase();

                    return {
                        ...item,
                        indexid: index,  // add an id field
                        transaction_date: formattedDate,  // replace the date with the formatted date
                        asset,  // add the combined asset field
                        transaction_type,  // replace the transaction_type with the uppercase version
                    };
                });
                setTransactions(dataWithIds);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [pid]);


    const columns = [
        {
            field: 'transaction_type',
            headerName: 'Operation',
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            renderCell: (params) => {
                const color = params.value === 'BUY' ? '#6dc78b' : '#e06b5b';
                return <span style={{ color }}>{params.value}</span>;
            },
        },
        { field: 'asset', headerName: 'Holding', flex: 2, align: 'left', headerAlign: 'left' },
        { field: 'transaction_date', headerName: 'Transaction Date', flex: 1, align: 'left', headerAlign: 'left' },
        { field: 'units', headerName: 'Units', flex: 1, align: 'left', headerAlign: 'left' },
        { field: 'price', headerName: 'Price per unit', flex: 1, align: 'left', headerAlign: 'left' },
        { field: 'fee', headerName: 'Fee', flex: 1, align: 'left', headerAlign: 'left' },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <div>
                    <Button variant="contained" color="error" size='small' style={{ minWidth: '20px' }} onClick={() => handleDelete(params.row.id)}>
                        <DeleteOutlineIcon color='white' />
                    </Button>
                </div>
            ),
        },
    ];

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/portfolio/transaction/${deleteId}/delete/`);
        } catch (error) {
            console.error(`Failed to delete row with id ${deleteId}:`, error);
        }
        setSnackbarOpen(true);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        setOpenDialog(false);
    };


    return (
        <ThemeProvider theme={customTheme}>
            <Card sx={{ padding: "1.5%", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                <CardContent>
                    <Button variant="contained" onClick={handleAddOpen} style={{ marginBottom: "20px", color: "#c4c4c4" }}>Add</Button>
                    <AddTransaction open={addOpen} handleClose={handleAddClose} pid={pid} />

                    <div style={{ width: '100%' }}>
                        <DataGrid
                            rows={transactions}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            rowHeight={70}
                            disableRowSelectionOnClick
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Delete Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this transaction?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary" variant='outlined'>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant='outlined'>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1000}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    Transaction deleted.
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}





