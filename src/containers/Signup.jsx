import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { signup } from "../actions/auth";
import { Grid, CssBaseline, Card, Typography, Box, TextField, Button, Alert } from '@mui/material';
import Stars from '../images/Stars.jpg';



const Signup = ({ signup, isAuthenticated }) => {
    const [formData, setFormData] = useState({ 
        username: "",
        email: "", 
        password: "" ,
        re_password: ""
    });

    const [accountCreated, setAccountCreated] = useState(false);

    const { username, email, password, re_password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => { 
        e.preventDefault();

        if (password === re_password) {
            signup(username, email, password, re_password);
            setAccountCreated(true);
        }
    }

    // Redirects
    if (isAuthenticated) {
        return <Navigate to='/home' />; 
    }

    if (accountCreated) {
        return <Navigate to='/' />;
    }

    return (
        <Grid container component="main" sx={{ height: '100vh', backgroundImage: `url(${Stars})`, backgroundRepeat: 'no-repeat', backgroundColor: t => t.palette.grey[900], backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <CssBaseline />
            <Card
                sx={{
                    m: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 4,
                    width: '100%',
                    borderRadius: '20px',
                    maxWidth: 400,
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" noValidate onSubmit={(e) => onSubmit(e)} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => onChange(e)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={(e) => onChange(e)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        onChange={(e) => onChange(e)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="re_password"
                        label="Confirm Password"
                        type="password"
                        id="re_password"
                        autoComplete="new-password"
                        onChange={(e) => onChange(e)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to='/login'>
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </Grid>
    );

};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { signup }) (Signup);