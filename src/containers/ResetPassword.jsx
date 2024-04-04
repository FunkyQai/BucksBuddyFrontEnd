import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password } from "../actions/auth";
import { Card, Grid, TextField, Button, Box, Typography } from '@mui/material';

const ResetPassword = ({ reset_password }) => {

    const [requestSent, setRequestSent] = useState(false);

    const [formData, setFormData] = useState({ email: ""});

    const { email } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => { 
        e.preventDefault();
        reset_password(email);
        setRequestSent(true);
    }

    if (requestSent) {
        return <Navigate to='/' />; 
    }

    return (
        <Grid container component="main" sx={{ height: '100vh', backgroundColor: '#282832' }}>
            <Card
                sx={{
                    m: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 4,
                    width: '100%',
                    borderRadius: '20px',
                    maxWidth: 600,
                }}
            >
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <Box component="form" noValidate onSubmit={(e) => onSubmit(e)} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => onChange(e)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Card>
        </Grid>
    );
};

export default connect(null, { reset_password }) (ResetPassword);