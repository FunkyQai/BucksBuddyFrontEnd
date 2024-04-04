import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const CreatePortfolio = ({ open, handleClose }) => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [remarks, setRemarks] = useState('');

    // Access the user object from the Redux store
    const user = useSelector(state => state.auth.user);

    const handleCreate = async () => {
        if (name.trim() === '') {
            setNameError(true);
            return;
        }

        try {
            console.log(user.id);
            const response = await axios.post('http://localhost:8000/portfolio/create/', {
                user_id: user.id, // Replace with the actual user ID
                name,
                remarks,
            });
            handleClose();
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error response:', error.response);
        }
    };

    return (
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
            '.MuiInputBase-root': {
                color: '#e3e6e9',
            },
        }}>
            <DialogTitle>Create Portfolio</DialogTitle>
            <DialogContent style={{ minHeight: '200px', minWidth: '500px' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Portfolio Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {nameError && (
                    <Alert severity="error">Please enter a name</Alert>
                )}
                <TextField
                    margin="dense"
                    id="remarks"
                    label="Remarks"
                    type="text"
                    fullWidth
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="primary">
                    Cancel
                </Button>
                <Button onClick={handleCreate} variant="contained" color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreatePortfolio;