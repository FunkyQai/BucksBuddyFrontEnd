import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { connect } from "react-redux";
import { checkAuthenticated, load_user } from "../actions/auth";
import { useLocation } from 'react-router-dom';

const Layout = (props) => {
    const location = useLocation();

    useEffect(() => {
        props.checkAuthenticated();
        props.load_user();
    }, []);
    
    return (
        <div>
            {location.pathname !== '/' && location.pathname !== '/signup' && <Navbar isAuthenticated={props.isAuthenticated} />}
            {props.children}
        </div>
    );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {checkAuthenticated, load_user}) (Layout);