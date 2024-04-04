import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password_confirm } from "../actions/auth";
import { Card, Grid, TextField, Button, Box, Typography } from '@mui/material';

const ResetPasswordConfirm = ({ reset_password_confirm }) => {

    const { uid, token } = useParams();
    const [requestSent, setRequestSent] = useState(false);
    const [resetFailed, setResetFailed] = useState(false);

    const [formData, setFormData] = useState({ 
        new_password: "", 
        re_new_password: ""
    });

    const { new_password, re_new_password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => { 
        e.preventDefault();
        try {
          await reset_password_confirm(uid, token, new_password, re_new_password);
          setRequestSent(true);
        } catch (error) {
          setResetFailed(true);
        }
    }

    if (requestSent) {
        return <Navigate to='/' />; 
    }

    return (
        <Grid container component="main" sx={{ height: '100vh', backgroundColor: t => t.palette.grey[900] }}>
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
                    Reset Password
                </Typography>
                <Box component="form" noValidate onSubmit={(e) => onSubmit(e)} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="new_password"
                        label="New Password"
                        name="new_password"
                        type="password"
                        onChange={(e) => onChange(e)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="re_new_password"
                        label="Confirm New Password"
                        name="re_new_password"
                        type="password"
                        onChange={(e) => onChange(e)}
                    />
                    {resetFailed && <div style={{color: 'red'}}>Password reset failed</div>}
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

export default connect(null, { reset_password_confirm }) (ResetPasswordConfirm);