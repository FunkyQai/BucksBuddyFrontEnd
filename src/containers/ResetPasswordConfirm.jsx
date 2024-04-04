import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password_confirm } from "../actions/auth";



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
        <div className='container mt-5'>
            {resetFailed && <div style={{color: 'red'}}>Password reset failed</div>}
            <form onSubmit={e => onSubmit(e)}>
            <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='New Password'
                        name='new_password'
                        value={new_password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Confirm New Password'
                        name='re_new_password'
                        value={re_new_password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <br></br>
                <button className='btn btn-primary' type='submit'>Reset Password</button>
            </form>
        </div>
    );

};


export default connect(null, { reset_password_confirm }) (ResetPasswordConfirm);