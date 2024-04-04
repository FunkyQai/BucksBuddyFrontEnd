import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { verify } from "../actions/auth";



const Activate = ({ verify }) => {

    const { uid, token } = useParams();

    const [verified, setVerified] = useState(false);


    const verify_account = () => { 
        verify(uid, token);
        setVerified(true);
    }

    // redirect
    if (verified) {
        return <Navigate to='/home' />; 
    }

    return (
        <div className='container mt-5'>
            <div className='d-flex flex-column justify-content-center align-items-center' style={{marginTop: '200px'}}>
                <h1>Verify your Account</h1>
                <button className='btn btn-primary' type='button' onClick={verify_account} style={{marginTop: '50px'}}>Verify</button>
            </div>
        </div>
    );

};


export default connect(null, { verify }) (Activate);