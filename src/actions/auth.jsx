import axios from 'axios';
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGOUT,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL
} from './types';

export const checkAuthenticated = () => async dispatch => {
    if(localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        const body = JSON.stringify({ token: localStorage.getItem('access') });

        try {
            const res = await axios.post('http://localhost:8000/auth/jwt/verify/', body, config);

            if (res.data.code !== 'token_not_valid') {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }

        } catch (err) {
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }
    }
}


export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get('http://localhost:8000/auth/users/me/', config);

            dispatch({
                type: LOAD_USER_SUCCESS,
                payload: res.data  // Access and refresh token
            });

        } catch (err) {
            dispatch({
                type: LOAD_USER_FAIL
            });
        }
    } else{
        dispatch({
            type: LOAD_USER_FAIL
        });
    }
};

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('http://localhost:8000/auth/jwt/create/', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data  // Access and refresh token
        });

        dispatch(load_user());

    } catch (err) {
        const errorMessage = err.response && err.response.status === 401
            ? 'Invalid credentials'
            : 'An error occurred';

        dispatch({
            type: LOGIN_FAIL,
            payload: errorMessage,
        });
    }
}

export const reset_password = (email) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ email });

    try {
        await axios.post('http://localhost:8000/auth/users/reset_password/', body, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS
        });

    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
}

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const body = JSON.stringify({ uid, token, new_password, re_new_password });
  
    try {
      await axios.post('http://localhost:8000/auth/users/reset_password_confirm/', body, config);
  
      dispatch({
        type: PASSWORD_RESET_CONFIRM_SUCCESS
      });
  
      // resolve the promise if the password reset is successful
      return Promise.resolve();
  
    } catch (err) {
      dispatch({
        type: PASSWORD_RESET_CONFIRM_FAIL
      });
  
      // reject the promise if the password reset fails
      return Promise.reject(err);
    }
  }

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
}

export const signup = (username, email,  password, re_password) => async dispatch => { 
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ username, email, password, re_password });

    try {
        const res = await axios.post('http://localhost:8000/auth/users/', body, config);

        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data  
        });

    } catch (err) {
        dispatch({
            type: SIGNUP_FAIL
        });
    }
}

export const verify = (uid, token) => async dispatch => { 
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ uid, token });

    try {
        await axios.post('http://localhost:8000/auth/users/activation/', body, config);

        dispatch({
            type: ACTIVATION_SUCCESS
        });

    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        });
    }
}
