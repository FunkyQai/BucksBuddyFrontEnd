import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AddTransaction = ({ open, handleClose, pid }) => {
    const [ticker, setTicker] = useState('');
    const [AssetName, setAssetName] = useState('');
    const [assetType, setAssetType] = useState('Others');
    const [assetSector, setAssetSector] = useState('Others');
    const [tickerError, setTickerError] = useState(false);
    const [date, setDate] = useState(dayjs());
    const [units, setUnits] = useState('');
    const [price, setPrice] = useState('');
    const [fees, setFees] = useState('0');
    const [transactionType, setTransactionType] = useState('buy');
    const [sellAssets, setSellAssets] = useState([]);
    const [unitsError, setUnitsError] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [incompleteError, setIncompleteError] = useState(false);

    useEffect(() => {
        if (transactionType === 'sell') {
            axios.get(`http://localhost:8000/portfolio/${pid}/assets/`)
                .then(response => {
                    setSellAssets(response.data);
                })
                .catch(error => {
                    console.error('Error fetching assets:', error);
                });
        }
    }, [transactionType]);

    const handleTickerBlur = () => {
        setAssetType('Others');
        setAssetSector('Others');
        setPrice('');
        setAssetName('');
        axios.get('http://localhost:8000/public/asset/', { params: { symbol: ticker } })
            .then(response => {
                console.log(response.data);
                setAssetName(response.data.company_name);
                setAssetType(response.data.quoteType);
                setAssetSector(response.data.sector);
                setPrice(response.data.price);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setTickerError(true);
            });
    };

    useEffect(() => {
        if (ticker === '') {
            setTickerError(false);
        }
    }, [ticker]);


    const handleCreate = async () => {
        if (transactionType === 'sell') {
            const asset = sellAssets.find(asset => asset.ticker === ticker);
            if (asset && asset.units < units) {
                setUnitsError(true);
                return;
            }
        }
        try {
            const response = await axios.post('http://localhost:8000/portfolio/create-transaction/', {
                asset_name: AssetName,
                asset_ticker: ticker,
                ticker: ticker,
                asset_type: assetType || 'Others',
                asset_sector: assetSector || 'Others',
                transaction_type: transactionType,
                units,
                price,
                fee: fees,
                transaction_date: date,
                pid,
            });
            handleClose();
            setIncompleteError(false);
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error response:', error.response);
            setIncompleteError(true);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} sx={{
                '.MuiPaper-root': {
                    backgroundColor: '#32323e',
                    color: '#e3e6e9',
                },
                '.MuiOutlinedInput-root': {
                    color: '#81909d',
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5c5c6c',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                },
                '.MuiInputLabel-root': {
                    color: '#e3e6e9',
                },
                '.MuiSvgIcon-root': {
                    color: '#e3e6e9',
                },
                '.MuiInputBase-root': {
                    color: '#e3e6e9',
                },
                '.MuiSvgIcon-root.MuiSelect-icon': {
                    color: '#e3e6e9',
                },
            }}
            >
                <DialogTitle>Create Transaction</DialogTitle>
                <DialogContent style={{ minHeight: '200px', minWidth: '500px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {transactionType === 'sell' ? (
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="ticker-label">Ticker</InputLabel>
                                    <Select
                                        labelId="ticker-label"
                                        id="ticker"
                                        required
                                        value={ticker}
                                        onChange={event => setTicker(event.target.value)}
                                        onBlur={handleTickerBlur}
                                    >
                                        {sellAssets.map(asset => (
                                            <MenuItem key={asset.id} value={asset.ticker}>{asset.ticker}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="ticker"
                                    label="Ticker"
                                    type="text"
                                    fullWidth
                                    required
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value)}
                                    onBlur={handleTickerBlur}
                                    error={tickerError}
                                    helperText={tickerError ? 'Ticker does not exist' : ''}
                                />
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                id="AssetName"
                                label="Asset Name"
                                type="text"
                                fullWidth
                                required
                                value={AssetName}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="operation-label">Operation</InputLabel>
                                <Select
                                    labelId="operation-label"
                                    id="operation"
                                    value={transactionType}
                                    required
                                    onChange={event => setTransactionType(event.target.value)}
                                >
                                    <MenuItem value={'buy'}>Buy</MenuItem>
                                    <MenuItem value={'sell'}>Sell</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    required
                                    onChange={(newValue) => {
                                        setDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                id="units"
                                label="Units"
                                type="number"
                                fullWidth
                                required
                                value={units}
                                onChange={(e) => {
                                    setUnits(e.target.value);
                                    setUnitsError(false);
                                }}
                                error={unitsError}
                                helperText={unitsError ? 'Units being sold exceed the amount in the portfolio' : ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                id="price"
                                label="Price"
                                type="number"
                                fullWidth
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        margin="dense"
                        id="fees"
                        label="Fees"
                        type="number"
                        fullWidth
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='outlined' color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} variant='contained' color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1500}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    The transaction has been created.
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddTransaction;


