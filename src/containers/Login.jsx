import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../actions/auth";
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { Card } from "@mui/material";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Astronaut from '../images/Astronaut.jpg';
import Bucksbuddylogo from '../images/Bucksbuddylogo.jpg';


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                PM
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Login = ({ login, isAuthenticated }) => {
    const authError = useSelector(state => state.auth.authError); // Access the error from your Redux store
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    }

    // Is the user authenticated?
    // If true, redirect them to the home page
    if (isAuthenticated) {
        return <Navigate to='/home' />;
    }

    return (
        <Grid container component="main" sx={{ height: '100vh', backgroundImage: `url(${Astronaut})`, backgroundRepeat: 'no-repeat', backgroundColor: t => t.palette.grey[900], backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
                <img
                    src={Bucksbuddylogo}
                    alt="Bucksbuddy logo"
                    width="150"
                    height="150"
                    style={{ borderRadius: '50%', marginBottom: '20px' }} 
                />
                <Typography component="h1" variant="h5">
                    Sign in
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => onChange(e)}
                    />
                    {/* Display the error message */}
                    {authError && (
                        <Alert severity="error">{authError}</Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to='/reset-password'>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to='/signup'>
                                {"Don't have an account?"}
                            </Link>
                        </Grid>
                    </Grid>
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Card>
        </Grid>
    );

};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { login })(Login);