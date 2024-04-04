import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Card as MuiCard, Grid, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';
import Snackbar from '@mui/material/Snackbar';
import CreatePortfolio from '../components/portfolio/CreatePortfolio';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const Card = styled(MuiCard)({
    backgroundColor: '#32323e',
    color: '#89949d',
    padding: '10%',
    borderRadius: '15px',
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
    },
    position: 'relative',
});

const Home = () => {

    // Access the user object from the Redux store
    const user = useSelector(state => state.auth.user);

    const [portfolios, setPortfolios] = useState([]);

    //For create portfolio
    const [createOpen, setCreateOpen] = useState(false);

    //for edit portfolio
    const [open, setOpen] = useState(false);

    //for delete portfolio
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [currentPortfolio, setCurrentPortfolio] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPortfolios = async () => {
            if (user) {
                const response = await axios.get(`http://localhost:8000/portfolio/get-all/${user.id}/`);
                setPortfolios(response.data);
            }
        };

        if (user) {
            fetchPortfolios();
        }
    }, [user]); // Depend on user so the effect runs again if the user changes


    const handleClickPortfolio = (portfolio) => {
        const pid = portfolio.id;
        navigate(`/dashboard/${pid}`);
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Update Portfolio
    const handleClickOpen = (portfolio) => {
        setCurrentPortfolio(portfolio);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNameChange = (event) => {
        setCurrentPortfolio({ ...currentPortfolio, name: event.target.value });
    };

    const handleRemarksChange = (event) => {
        setCurrentPortfolio({ ...currentPortfolio, remarks: event.target.value });
    };


    const handleSave = async () => {
        try {
            // Update the database
            await axios.put(`http://localhost:8000/portfolio/update/${currentPortfolio.id}/`, currentPortfolio)

            // Fetch the updated data
            const response = await axios.get(`http://localhost:8000/portfolio/get-all/${user.id}/`);

            // Update the state with the updated data
            setPortfolios(response.data);
        } catch (error) {
            console.error('Error response:', error.response);
        }

        handleClose();
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create Portfolio

    const handleCreateOpen = () => {
        setCreateOpen(true);
    };

    const handleCreateClose = () => {
        setCreateOpen(false);
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Delete Portfolio

    const handleDeleteOpen = (portfolio) => {
        setCurrentPortfolio(portfolio);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setSnackbarOpen(false);
    };

    const handleDelete = async (portfolio) => {
        try {
            console.log(portfolio.id)
            // Update the database
            await axios.delete(`http://localhost:8000/portfolio/delete/${portfolio.id}/`)

            // Fetch the updated data
            const response = await axios.get(`http://localhost:8000/portfolio/get-all/${user.id}/`);

            // Update the state with the updated data
            setPortfolios(response.data);
            handleDeleteClose();
            handleSnackbarOpen();
        } catch (error) {
            console.error('Error response:', error.response);
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Render
    return (
        <div style={{ margin: "40px 10vw" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: "white" }}>My Portfolios</h1>
                <Button variant="contained" onClick={handleCreateOpen} style={{ backgroundColor: 'rgba(128, 128, 128, 0.15)' }}   >
                    <AddIcon /> Create Portfolio
                </Button>
                <CreatePortfolio open={createOpen} handleClose={handleCreateClose} />
            </div>
            <Grid container spacing={3}>
                {portfolios.map((portfolio) => (
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <div style={{ position: 'absolute', right: 15, top: 0 }}>
                                <Tooltip title="Edit Portfolio">
                                    <IconButton
                                        style={{ outline: 'none', color: "#4c6a88" }}
                                        onClick={() => handleClickOpen(portfolio)}
                                    >
                                        <SettingsIcon />

                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        style={{ outline: 'none', color: "#4c6a88" }}
                                        onClick={() => handleDeleteOpen(portfolio)}
                                    >
                                        <DeleteIcon />

                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div onClick={() => handleClickPortfolio(portfolio)}>
                            <h6><BusinessCenterIcon style={{ fontSize: 15 }} />  {portfolio.name}</h6>
                            <h3 style={{ color: "white", marginBottom: "20px" }}>{parseFloat(portfolio.value).toFixed(2)} USD</h3>
                            <h6 style={{ color: "#67b1e3" }}>{portfolio.remarks}</h6>
                            </div>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Portfolio</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Name" type="text" fullWidth value={currentPortfolio.name} onChange={handleNameChange} />
                    <TextField margin="dense" label="Notes" type="text" fullWidth value={currentPortfolio.remarks} onChange={handleRemarksChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='error'>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                <DialogTitle>Are you sure you want to delete this portfolio?</DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete(currentPortfolio)} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    The portfolio has been deleted.
                </Alert>
            </Snackbar>


        </div>
    );
};


  export default Home;